/**
 * @file wasm-image-decoder.ts
 * @description Image decode pipeline: fetch → worker-side createImageBitmap
 * (with GPU resize hints) → zero-copy upload to the shared WebGL texture via
 * gpuAccel. Bitmaps are cached per URL; batch decoding fans sub-batches
 * across the worker pool in parallel.
 */

// WASM & WebGL2 Heavy GPU Image Decoding Engine
// Offloads binary parsing & ImageBitmap decoding to WASM Web Worker threads,
// then uploads decoded bitmaps directly to WebGL2 GPU hardware VRAM.
// Supports parallel batch decoding via DECODE_IMAGE_BATCH_WASM fan-out.
import { WASM_ACTIONS, WASM_POOL } from '@/core/tokens/data/wasm.js'
import { CACHE_CONFIG } from '@/core/tokens/media/cache.js'
import { GENERIC_DIMENSIONS } from '@/core/tokens/media/dimensions.js'
import { wasmPool } from './wasm-pool.js'
import { gpuAccel } from '@/utils/gpu/gpu-accel.js'

/** One queued decode request — URL plus optional GPU resize hints. */
export interface DecodeItem {
  /** CDN URL of the source image. */
  url: string
  /** Target display width — passed to createImageBitmap as a resize hint. */
  width?: number
  /** Target display height — passed to createImageBitmap as a resize hint. */
  height?: number
}

/** A decode request after defaults are applied — index preserves input order. */
interface PendingItem extends Required<Pick<DecodeItem, 'url' | 'width' | 'height'>> {
  index: number
}

/**
 * Worker postMessage envelope — `results` carries either the batch array
 * or a single {bitmap} object depending on the action; `bitmap` covers
 * the flat single-result reply shape.
 */
interface WorkerBitmapResult {
  results?:
    | Array<{ url?: string; bitmap?: ImageBitmap; width?: number; height?: number }>
    | { bitmap?: ImageBitmap }
  bitmap?: ImageBitmap
}

/**
 * Decodes images via createImageBitmap with GPU resize hints and caches the
 * resulting ImageBitmaps keyed by URL, so repeat draws skip decode entirely.
 */
class WASMImageDecoder {
  /** URL → decoded ImageBitmap — repeat draws skip fetch+decode entirely. */
  bitmapCache = new Map<string, ImageBitmap>()

  /**
   * Single-image decode — passes GPU resize hints so createImageBitmap
   * resizes in hardware at decode time, not in software afterward.
   * `fetch(cache:'force-cache')` reuses the HTTP cache so a prior <img>
   * warm-up doesn't double-download. Every failure arm resolves null —
   * callers fall back to plain <img> decode.
   * @param url CDN image URL.
   * @param targetW GPU resize-hint width.
   * @param targetH GPU resize-hint height.
   * @returns The decoded+GPU-uploaded bitmap, or null.
   */
  async decodeImageWASM(
    url: string,
    targetW: number = GENERIC_DIMENSIONS.DEFAULT_WIDTH,
    targetH: number = GENERIC_DIMENSIONS.DEFAULT_HEIGHT
  ): Promise<ImageBitmap | null> {
    if (!url) return null

    if (this.bitmapCache.has(url)) {
      const cached = this.bitmapCache.get(url) as ImageBitmap

      gpuAccel.processBitmapGPU(cached, targetW, targetH)

      return cached
    }

    try {
      const res = await fetch(url, { cache: CACHE_CONFIG.FORCE_CACHE as RequestCache })

      if (!res.ok) return null

      const blob = await res.blob()

      // Pass width/height hints — the worker will supply them as
      // ImageBitmapOptions.resizeWidth/resizeHeight so the GPU performs
      // hardware-accelerated resize during decompression.
      const workerRes = (await wasmPool.dispatch(WASM_ACTIONS.DECODE_IMAGE_WASM, {
        blob,
        width: targetW,
        height: targetH,
      })) as WorkerBitmapResult | null

      // The worker result key is 'results' (from worker postMessage shape)
      const results = workerRes?.results

      const bitmap =
        (!Array.isArray(results) ? results?.bitmap : undefined) ?? workerRes?.bitmap ?? null

      if (bitmap) {
        this.bitmapCache.set(url, bitmap)

        // Upload zero-copy ImageBitmap to WebGL2 GPU VRAM
        gpuAccel.processBitmapGPU(bitmap, targetW, targetH)

        return bitmap
      }
    } catch {
      // Fallback to standard Image element decoding
    }

    return null
  }

  /**
   * Batch decode: splits the pending list across the pool's workers and
   * decodes in parallel, returning a url→ImageBitmap Map. Cached URLs are
   * served from bitmapCache without a worker hop.
   * @param items Decode requests; entries without a URL are skipped.
   * @returns url→bitmap map — missing URLs simply have no entry.
   */
  async decodeImageBatchWASM(items: DecodeItem[]): Promise<Map<string, ImageBitmap>> {
    if (!items || !items.length) return new Map()

    // Filter out already-cached URLs
    const pending: PendingItem[] = []

    const result = new Map<string, ImageBitmap>()

    for (let i = 0; i < items.length; i++) {
      const {
        url,
        width = GENERIC_DIMENSIONS.DEFAULT_WIDTH,
        height = GENERIC_DIMENSIONS.DEFAULT_HEIGHT,
      } = items[i]

      if (!url) continue

      if (this.bitmapCache.has(url)) {
        const cached = this.bitmapCache.get(url) as ImageBitmap

        result.set(url, cached)

        gpuAccel.processBitmapGPU(cached, width, height)
      } else {
        pending.push({ url, width, height, index: i })
      }
    }

    if (!pending.length) return result

    // Split pending items into chunks sized to pool's worker count so each
    // worker receives roughly equal work and all decodes run in parallel.
    const workerCount = Math.max(1, wasmPool.workers?.length || WASM_POOL.DESKTOP_MAX)

    const chunkSize = Math.ceil(pending.length / workerCount)

    const chunks: PendingItem[][] = []

    for (let i = 0; i < pending.length; i += chunkSize) {
      chunks.push(pending.slice(i, i + chunkSize))
    }

    // Dispatch all chunks simultaneously — each goes to a different worker
    // via round-robin inside wasmPool.dispatch
    const chunkResults = (await Promise.all(
      chunks.map((chunk) =>
        wasmPool.dispatch(WASM_ACTIONS.DECODE_IMAGE_BATCH_WASM, { items: chunk })
      )
    )) as Array<WorkerBitmapResult | null>

    // Collect all bitmaps, populate cache, upload to GPU
    for (const res of chunkResults) {
      const resultItems = Array.isArray(res?.results) ? res.results : []

      for (const item of resultItems) {
        if (!item || !item.bitmap || !item.url) continue

        const { url, bitmap, width, height } = item

        this.bitmapCache.set(url, bitmap)

        result.set(url, bitmap)

        gpuAccel.processBitmapGPU(
          bitmap,
          width || GENERIC_DIMENSIONS.DEFAULT_WIDTH,
          height || GENERIC_DIMENSIONS.DEFAULT_HEIGHT
        )
      }
    }

    return result
  }

  /** Releases every cached ImageBitmap (frees GPU-backed memory) and clears the map. */
  clearCache(): void {
    this.bitmapCache.forEach((bitmap) => {
      if (bitmap.close) bitmap.close()
    })

    this.bitmapCache.clear()
  }
}

/**
 * Shared decoder singleton — the bitmap cache is global so a bitmap
 * decoded for one surface (mosaic) is reused by another (carousel).
 */
export const wasmImageDecoder = new WASMImageDecoder()
