/**
 * @file wasm-media-threads.ts
 * @description Off-main-thread media pipeline built on the WASM worker pool:
 * image decode→ImageBitmap→GPU upload, lightweight video probing (range
 * request of the header), parallel quality-variant prefetch, and byte-range
 * segment fetching. Every public method is a thin orchestrator over
 * wasmPool.dispatch + gpuAccel — the heavy work never touches the main
 * thread. Results are memoized per URL.
 */

// High-Performance Multi-Threaded WASM Video Pipeline
// Dispatches parallel quality-variant prefetch, lightweight probing, and
// byte-range segment fetching across the WASM worker pool. All operations
// happen off the main thread with zero-copy ArrayBuffer/ImageBitmap transfers.

import { WASM_ACTIONS } from '@/core/tokens/data/wasm.js'
import { wasmPool } from './wasm-pool.js'
import { gpuAccel } from '@/utils/gpu/gpu-accel.js'
import { COVER_DIMENSIONS } from '@/core/tokens/media/dimensions.js'

/**
 * The VideoVariant value.
 */
export interface VideoVariant {
  url: string
  quality?: string
  width?: number
  height?: number
}

/**
 * The VideoProbe value.
 */
export interface VideoProbe {
  codec?: string
  size?: number
  rangeSupported?: boolean
  [key: string]: unknown
}

/**
 * Prefetches result.
 */
export interface PrefetchResult {
  best?: VideoVariant
  poster?: ImageBitmap
  [key: string]: unknown
}

interface WorkerResults {
  results?: unknown
  bitmap?: ImageBitmap
}

/**
 * The MediaSegment value.
 */
export interface MediaSegment {
  url: string
  byteStart?: number
  byteEnd?: number | null
}

/**
 * Orchestrator over wasmPool.dispatch + gpuAccel. Three memoization maps
 * key results by URL so repeat requests (carousel re-renders, related-item
 * mounts) never re-dispatch worker work.
 */
class WASMMediaThreadManager {
  /** URL → ImageBitmap — decoded poster/frame results, zero-copy. */
  decodedBitmaps = new Map<string, ImageBitmap>()
  /** URL → probe result {codec, size, rangeSupported}. */
  probedUrls = new Map<string, VideoProbe>()
  /** First-variant URL → {best, poster} prefetch results. */
  prefetchedVideos = new Map<string, PrefetchResult>()

  // ── Legacy single-URL decode (images) ─────────────────────────────────────
  // Kept for backward compatibility — prefer decodeImageBatchWASM for images.
  /**
   * Decodes one image URL to an ImageBitmap in a pool worker, then uploads
   * it to GPU at the requested display size. Cache hit → GPU re-upload only
   * (the bitmap is already resident). Any worker/decode failure resolves
   * null so callers fall back to <img> decode.
   */
  async decodeMediaInSeparateThread(
    url: string,
    width = 800,
    height = 450
  ): Promise<ImageBitmap | null> {
    if (!url) return null

    if (this.decodedBitmaps.has(url)) {
      const bitmap = this.decodedBitmaps.get(url) as ImageBitmap

      gpuAccel.processBitmapGPU(bitmap, width, height)

      return bitmap
    }

    try {
      const res = (await wasmPool.dispatch(WASM_ACTIONS.DECODE_MEDIA_URL_WASM, {
        url,
      })) as WorkerResults | null

      const bitmap =
        (res?.results as { bitmap?: ImageBitmap } | undefined)?.bitmap ?? res?.bitmap ?? null

      if (bitmap) {
        this.decodedBitmaps.set(url, bitmap)

        gpuAccel.processBitmapGPU(bitmap, width, height)

        return bitmap
      }
    } catch {
      // Graceful fallback
    }

    return null
  }

  // ── Lightweight probe ──────────────────────────────────────────────────────
  /**
   * Range-requests the first 128 KB of a video URL in a worker thread to
   * detect codec, total size, and range-request support — without
   * downloading the full file. Used by the NPU predictor before the user
   * navigates so quality-variant choice is informed, not guessed.
   */
  async probeVideo(url: string): Promise<VideoProbe | null> {
    if (!url) return null

    if (this.probedUrls.has(url)) return this.probedUrls.get(url) as VideoProbe

    try {
      const res = (await wasmPool.dispatch(WASM_ACTIONS.PROBE_VIDEO_WASM, {
        url,
      })) as WorkerResults | null

      const result = (res?.results as VideoProbe | undefined) ?? null

      if (result) this.probedUrls.set(url, result)

      return result
    } catch {
      return null
    }
  }

  // ── Parallel quality-variant prefetch ─────────────────────────────────────
  /**
   * Dispatches one worker to simultaneously fetch the first 256 KB of every
   * quality variant + the poster frame — returning the best available
   * variant URL and a zero-copy poster ImageBitmap. The cache key is the
   * first variant's URL (the canonical "this video" identifier).
   * A successful poster is uploaded to GPU VRAM immediately at FHD
   * fallback dimensions.
   */
  async prefetchVideoVariants(
    variants: VideoVariant[],
    posterUrl: string | null = null
  ): Promise<PrefetchResult | null> {
    if (!variants?.length) return null

    const cacheKey = variants[0]?.url

    if (cacheKey && this.prefetchedVideos.has(cacheKey)) {
      return this.prefetchedVideos.get(cacheKey) as PrefetchResult
    }

    try {
      const res = (await wasmPool.dispatch(WASM_ACTIONS.PREFETCH_VIDEO_WASM, {
        variants,
        posterUrl,
      })) as WorkerResults | null

      const result = (res?.results as PrefetchResult | undefined) ?? null

      if (result) {
        if (cacheKey) this.prefetchedVideos.set(cacheKey, result)

        // Upload poster to GPU VRAM immediately if available
        if (result.poster) {
          gpuAccel.processBitmapGPU(
            result.poster,
            result.best?.width || COVER_DIMENSIONS.FHD_WIDTH,
            result.best?.height || COVER_DIMENSIONS.FHD_HEIGHT
          )
        }
      }

      return result
    } catch {
      return null
    }
  }

  // ── Parallel segment fetching ──────────────────────────────────────────────
  /**
   * Fetches N byte-range segments simultaneously — each dispatch
   * round-robins to a different pool worker, so ranges genuinely download
   * in parallel threads. Returns zero-copy results for MediaSource or
   * WebCodecs consumption; failed segments are filtered out (partial
   * results are still usable — the caller decides if gaps are fatal).
   */
  async fetchSegmentsParallel(segmentList: MediaSegment[]): Promise<unknown[]> {
    if (!segmentList?.length) return []

    // Dispatch all segments simultaneously — each goes to a different worker
    // via round-robin in the pool, so they genuinely run in parallel threads.
    const results = await Promise.all(
      segmentList.map((seg) =>
        wasmPool.dispatch(WASM_ACTIONS.DECODE_VIDEO_SEGMENT_WASM, {
          url: seg.url,
          byteStart: seg.byteStart ?? 0,
          byteEnd: seg.byteEnd ?? null,
        })
      )
    )

    return results.map((r) => (r as WorkerResults | null)?.results ?? null).filter(Boolean)
  }

  // ── Apply best variant to a video element ─────────────────────────────────
  /** After prefetchVideoVariants resolves: sets the winning URL on the element and uploads the poster to GPU. */
  applyBestVariant(videoEl: HTMLVideoElement, prefetchResult: PrefetchResult | null): void {
    if (!videoEl || !prefetchResult) return

    const best = prefetchResult.best

    if (best?.url && videoEl.src !== best.url) {
      videoEl.src = best.url
    }

    if (prefetchResult.poster) {
      gpuAccel.processBitmapGPU(
        prefetchResult.poster,
        videoEl.clientWidth || COVER_DIMENSIONS.FHD_WIDTH,
        videoEl.clientHeight || COVER_DIMENSIONS.FHD_HEIGHT
      )
    }
  }
}

/**
 * The wasmMediaThreads constant.
 */
export const wasmMediaThreads = new WASMMediaThreadManager()
