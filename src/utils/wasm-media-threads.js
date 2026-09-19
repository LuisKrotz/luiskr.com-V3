// High-Performance Multi-Threaded WASM Video Pipeline
// Dispatches parallel quality-variant prefetch, lightweight probing, and
// byte-range segment fetching across the WASM worker pool. All operations
// happen off the main thread with zero-copy ArrayBuffer/ImageBitmap transfers.

import { wasmPool } from './wasm-pool.js'
import { gpuAccel } from './gpu-accel.js'

class WASMMediaThreadManager {
  constructor() {
    this.decodedBitmaps = new Map()
    this.probedUrls = new Map()
    this.prefetchedVideos = new Map()
  }

  // ── Legacy single-URL decode (images) ─────────────────────────────────────
  // Kept for backward compatibility — prefer decodeImageBatchWASM for images.
  async decodeMediaInSeparateThread(url, width = 800, height = 450) {
    if (!url) return null

    if (this.decodedBitmaps.has(url)) {
      const bitmap = this.decodedBitmaps.get(url)

      gpuAccel.processBitmapGPU(bitmap, width, height)
      return bitmap
    }

    try {
      const res = await wasmPool.dispatch('DECODE_MEDIA_URL_WASM', { url })
      const bitmap = res?.results?.bitmap ?? res?.bitmap ?? null

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
  // Range-requests first 128 KB of a video URL in a worker thread to detect
  // codec, total size, and range-request support — without downloading the
  // full file. Used by the NPU predictor before the user navigates.
  async probeVideo(url) {
    if (!url) return null
    if (this.probedUrls.has(url)) return this.probedUrls.get(url)

    try {
      const res = await wasmPool.dispatch('PROBE_VIDEO_WASM', { url })
      const result = res?.results ?? null

      if (result) this.probedUrls.set(url, result)
      return result
    } catch {
      return null
    }
  }

  // ── Parallel quality-variant prefetch ─────────────────────────────────────
  // Dispatches one worker to simultaneously fetch the first 256 KB of every
  // quality variant + the poster frame using Promise.all — returning the best
  // available variant URL and a zero-copy poster ImageBitmap.
  //
  // variants: [{ url, quality: '1080p'|'720p'|'480p', width, height }]
  // posterUrl: optional poster image URL
  async prefetchVideoVariants(variants, posterUrl = null) {
    if (!variants?.length) return null

    const cacheKey = variants[0]?.url

    if (this.prefetchedVideos.has(cacheKey)) {
      return this.prefetchedVideos.get(cacheKey)
    }

    try {
      const res = await wasmPool.dispatch('PREFETCH_VIDEO_WASM', { variants, posterUrl })
      const result = res?.results ?? null

      if (result) {
        this.prefetchedVideos.set(cacheKey, result)

        // Upload poster to GPU VRAM immediately if available
        if (result.poster) {
          gpuAccel.processBitmapGPU(result.poster, result.best?.width || 1920, result.best?.height || 1080)
        }
      }

      return result
    } catch {
      return null
    }
  }

  // ── Parallel segment fetching ──────────────────────────────────────────────
  // Fetches N byte-range segments simultaneously across multiple workers,
  // returning each as a zero-copy ArrayBuffer for MediaSource or WebCodecs.
  // segmentList: [{ url, byteStart, byteEnd }]
  async fetchSegmentsParallel(segmentList) {
    if (!segmentList?.length) return []

    // Dispatch all segments simultaneously — each goes to a different worker
    // via round-robin in the pool, so they genuinely run in parallel threads.
    const results = await Promise.all(
      segmentList.map((seg) =>
        wasmPool.dispatch('DECODE_VIDEO_SEGMENT_WASM', {
          url: seg.url,
          byteStart: seg.byteStart ?? 0,
          byteEnd: seg.byteEnd ?? null,
        })
      )
    )

    return results
      .map((r) => r?.results ?? null)
      .filter(Boolean)
  }

  // ── Apply best variant to a video element ─────────────────────────────────
  // After prefetchVideoVariants resolves, call this to set the highest-quality
  // primed URL on the element and apply the poster bitmap to GPU.
  applyBestVariant(videoEl, prefetchResult) {
    if (!videoEl || !prefetchResult) return

    const best = prefetchResult.best

    if (best?.url && videoEl.src !== best.url) {
      videoEl.src = best.url
    }

    if (prefetchResult.poster) {
      gpuAccel.processBitmapGPU(prefetchResult.poster, videoEl.clientWidth || 1920, videoEl.clientHeight || 1080)
    }
  }
}

export const wasmMediaThreads = new WASMMediaThreadManager()
