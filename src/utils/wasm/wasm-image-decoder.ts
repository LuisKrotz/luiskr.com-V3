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
import { WASM_ACTIONS } from '@/core/tokens/data/wasm.js'
import { CACHE_CONFIG } from '@/core/tokens/media/cache.js'
import { wasmPool } from './wasm-pool.js'
import { gpuAccel } from '@/utils/gpu/gpu-accel.js'

/**
 * Decodes item.
 */
export interface DecodeItem {
  url: string
  width?: number
  height?: number
}

interface PendingItem extends Required<Pick<DecodeItem, 'url' | 'width' | 'height'>> {
  index: number
}

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
  bitmapCache = new Map<string, ImageBitmap>()

  // Single-image decode — passes GPU resize hints so createImageBitmap resizes
  // in hardware at decode time, not in software afterward.
  async decodeImageWASM(url: string, targetW = 800, targetH = 450): Promise<ImageBitmap | null> {
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
   */
  async decodeImageBatchWASM(items: DecodeItem[]): Promise<Map<string, ImageBitmap>> {
    if (!items || !items.length) return new Map()

    // Filter out already-cached URLs
    const pending: PendingItem[] = []

    const result = new Map<string, ImageBitmap>()

    for (let i = 0; i < items.length; i++) {
      const { url, width = 800, height = 450 } = items[i]

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
    const workerCount = Math.max(1, wasmPool.workers?.length || 4)

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

        gpuAccel.processBitmapGPU(bitmap, width || 800, height || 450)
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
 * The wasmImageDecoder constant.
 */
export const wasmImageDecoder = new WASMImageDecoder()
