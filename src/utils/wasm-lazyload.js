// High-Performance WASM, GPU & NPU Native Lazyloader Engine
// Batches all images that enter the viewport in the same frame tick and
// decodes them in parallel across multiple WASM worker threads via
// decodeImageBatchWASM, then uploads every bitmap to GPU VRAM zero-copy.
import { localMediaCache } from './local-media-cache.js'
import { gpuAccel } from './gpu-accel.js'
import { wasmPool } from './wasm-pool.js'
import { wasmImageDecoder } from './wasm-image-decoder.js'

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
    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') return

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

    if (typeof requestIdleCallback !== 'undefined') {
      requestIdleCallback(flush, { timeout: 50 })
    } else {
      // rAF fallback — fires before next paint
      requestAnimationFrame(flush)
    }
  }

  observe(el, bindingValue) {
    if (!el) return
    const src = typeof bindingValue === 'string' ? bindingValue : bindingValue?.src
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
          wasmPool.dispatch('PROCESS_MEDIA_ANALYTICS', {
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
      for (const { el, url } of resolvedItems) {
        const bitmap = bitmapMap.get(url)
        el.src = url
        el.classList.add('wasm-lazy-loaded')
        // GPU upload already happened inside decodeImageBatchWASM;
        // only fall back to processImageGPU if no bitmap was returned
        if (!bitmap) {
          const img = new Image()
          img.src = url
          img.onload = () => {
            gpuAccel.processImageGPU(img, el.clientWidth || 800, el.clientHeight || 450)
          }
        }
      }
    }

    // ── 2. Handle videos and background-image elements individually ─────────
    for (const el of otherEls) {
      const src = el.dataset.wasmSrc
      if (!src) continue

      wasmPool.dispatch('PROCESS_MEDIA_ANALYTICS', {
        width: el.clientWidth || 800,
        height: el.clientHeight || 450,
        isVideo: el.tagName === 'VIDEO',
      })

      const resolvedUrl = await localMediaCache.fetchOrGetLocalMedia(src)

      if (el.tagName === 'VIDEO') {
        el.src = resolvedUrl
        el.classList.add('wasm-lazy-loaded')
        gpuAccel.processVideoGPU(el, el.clientWidth || 640, el.clientHeight || 360)
      } else {
        el.style.backgroundImage = `url("${resolvedUrl}")`
        el.classList.add('wasm-lazy-loaded')
      }
    }
  }
}

export const wasmLazyloader = new WASMLazyloader()
export default wasmLazyloader
