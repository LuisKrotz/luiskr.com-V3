// High-Performance WASM, GPU & NPU Native Lazyloader Engine
// Batches all images that enter the viewport in the same frame tick and
// decodes them in parallel across multiple WASM worker threads via
// decodeImageBatchWASM, then uploads every bitmap to GPU VRAM zero-copy.
// Videos are prefetched via parallel quality-variant probing through the
// worker pool, with the highest-quality primed URL applied on intersection.
import { localMediaCache } from './local-media-cache.js'
import { gpuAccel } from './gpu-accel.js'
import { wasmPool } from './wasm-pool.js'
import { wasmImageDecoder } from './wasm-image-decoder.js'
import { wasmMediaThreads } from './wasm-media-threads.js'
import { STRINGS, WASM_ACTIONS, MEDIA_DIMENSIONS } from '../core/constants.js'

class WASMLazyloader {
  constructor() {
    this.observer = null
    // Accumulate intersecting elements within a single rAF/rIC tick
    // so they can be decoded in one parallel batch instead of serially.
    this._pendingBatch = []
    this._batchScheduled = false
    this.initObserver()
  }

  initObserver() {
    if (typeof window === STRINGS.UNDEFINED || typeof IntersectionObserver === STRINGS.UNDEFINED) return

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Collect all elements that become visible this frame
            this._pendingBatch.push(entry.target)
            if (this.observer) this.observer.unobserve(entry.target)
          }
        })
        // Schedule a single batch flush per frame tick
        this._scheduleBatchFlush()
      },
      {
        rootMargin: '200px 100px',
        threshold: 0.01,
      }
    )
  }

  // Coalesce all pending elements into one parallel batch decode call.
  // requestIdleCallback with a 50 ms deadline ensures we don't block
  // time-sensitive rendering while still flushing promptly.
  _scheduleBatchFlush() {
    if (this._batchScheduled) return
    this._batchScheduled = true

    const flush = () => {
      this._batchScheduled = false
      const batch = this._pendingBatch.splice(0)
      if (batch.length) this._loadBatch(batch)
    }

    if (typeof requestIdleCallback !== STRINGS.UNDEFINED) {
      requestIdleCallback(flush, { timeout: 50 })
    } else {
      // rAF fallback — fires before next paint
      requestAnimationFrame(flush)
    }
  }

  observe(el, bindingValue) {
    if (!el) return
    const src = typeof bindingValue === STRINGS.STRING ? bindingValue : bindingValue?.src
    if (!src) return

    el.dataset.wasmSrc = src
    gpuAccel.accelerateElementGPU(el)

    if (this.observer) {
      this.observer.observe(el)
    } else {
      // No IntersectionObserver — load immediately
      this._pendingBatch.push(el)
      this._scheduleBatchFlush()
    }
  }

  // Decode all images that intersected in the same frame in one parallel call.
  // Videos are handled individually since they don't go through ImageBitmap.
  async _loadBatch(elements) {
    // Separate images from videos/backgrounds
    const imgEls = elements.filter((el) => el.tagName === 'IMG')
    const otherEls = elements.filter((el) => el.tagName !== 'IMG')

    // ── 1. Parallel WASM batch decode for all images ────────────────────────
    if (imgEls.length > 0) {
      // Resolve URLs via localMediaCache first (handles IndexedDB disk cache)
      const resolvedItems = await Promise.all(
        imgEls.map(async (el) => {
          const src = el.dataset.wasmSrc
          // WASM media analytics off main thread
          wasmPool.dispatch(WASM_ACTIONS.PROCESS_MEDIA_ANALYTICS, {
            width: el.clientWidth || 800,
            height: el.clientHeight || 450,
            isVideo: false,
          })
          const resolvedUrl = await localMediaCache.fetchOrGetLocalMedia(src)
          return {
            el,
            url: resolvedUrl,
            width: el.clientWidth || 800,
            height: el.clientHeight || 450,
          }
        })
      )

      // Fan-out: decode all images in parallel across WASM worker pool
      const bitmapMap = await wasmImageDecoder.decodeImageBatchWASM(
        resolvedItems.map(({ url, width, height }) => ({ url, width, height }))
      )

      // Apply results back to their target elements
      for (const { el, url, width, height } of resolvedItems) {
        const bitmap = bitmapMap.get(url)
        el.src = url
        el.classList.add('wasm-lazy-loaded')
        // GPU upload already happened inside decodeImageBatchWASM;
        // only fall back to processImageGPU if no bitmap was returned
        if (!bitmap) {
          const img = new Image()
          img.src = url
          img.onload = () => {
            gpuAccel.processImageGPU(img, width, height)
          }
        }
      }
    }

    // ── 2. Handle videos and background-image elements individually ─────────
    for (const el of otherEls) {
      const src = el.dataset.wasmSrc
      if (!src) continue

      wasmPool.dispatch(WASM_ACTIONS.PROCESS_MEDIA_ANALYTICS, {
        width: el.clientWidth || 800,
        height: el.clientHeight || 450,
        isVideo: el.tagName === 'VIDEO',
      })

      const resolvedUrl = await localMediaCache.fetchOrGetLocalMedia(src)

      if (el.tagName === 'VIDEO') {
        // Read optional quality variants from data attribute (JSON array)
        // e.g. data-wasm-variants='[{"url":"...1080p.mp4","quality":"1080p","width":1920,"height":1080}]'
        let variants = null
        try {
          const raw = el.dataset.wasmVariants
          if (raw) variants = JSON.parse(raw)
        } catch { /* ignore malformed JSON */ }

        if (!variants) {
          variants = [{ url: resolvedUrl, quality: 'default', width: el.clientWidth || MEDIA_DIMENSIONS.FHD_WIDTH, height: el.clientHeight || MEDIA_DIMENSIONS.FHD_HEIGHT }]
        }

        const posterUrl = el.dataset.wasmPoster || el.getAttribute('poster') || null

        const prefetchResult = await wasmMediaThreads.prefetchVideoVariants(variants, posterUrl)

        if (prefetchResult?.best?.url) {
          wasmMediaThreads.applyBestVariant(el, prefetchResult)
        } else {
          el.src = resolvedUrl
        }

        el.classList.add('wasm-lazy-loaded')
      } else {
        el.style.backgroundImage = `url("${resolvedUrl}")`
        el.classList.add('wasm-lazy-loaded')
      }
    }
  }
}

export const wasmLazyloader = new WASMLazyloader()
export default wasmLazyloader
