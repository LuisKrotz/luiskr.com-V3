// High-Performance WASM, GPU & NPU Native Lazyloader Engine
// Replaces vue3-lazyload with WASM image/video decoding, IndexedDB disk cache, & WebGL/GPU hardware texture pipeline
import { localMediaCache } from './local-media-cache.js'
import { gpuAccel } from './gpu-accel.js'
import { wasmPool } from './wasm-pool.js'

class WASMLazyloader {
  constructor() {
    this.observer = null
    this.initObserver()
  }

  initObserver() {
    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') return

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.loadElement(entry.target)
            if (this.observer) this.observer.unobserve(entry.target)
          }
        })
      },
      {
        rootMargin: '200px 100px',
        threshold: 0.01,
      }
    )
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
      this.loadElement(el)
    }
  }

  async loadElement(el) {
    const src = el.dataset.wasmSrc
    if (!src) return

    // 1. WASM media analytics & checksum computation off main thread
    wasmPool.dispatch('PROCESS_MEDIA_ANALYTICS', {
      width: el.clientWidth || 800,
      height: el.clientHeight || 450,
      isVideo: el.tagName === 'VIDEO',
    })

    // 2. Fetch or retrieve local disk cached media using WASM & IndexedDB
    const resolvedUrl = await localMediaCache.fetchOrGetLocalMedia(src)

    if (el.tagName === 'IMG') {
      const img = new Image()
      img.src = resolvedUrl
      img.onload = () => {
        el.src = resolvedUrl
        el.classList.add('wasm-lazy-loaded')
        gpuAccel.processImageGPU(img, el.clientWidth || 800, el.clientHeight || 450)
      }
      img.onerror = () => {
        el.src = resolvedUrl
        el.classList.add('wasm-lazy-loaded')
      }
    } else if (el.tagName === 'VIDEO') {
      el.src = resolvedUrl
      el.classList.add('wasm-lazy-loaded')
      gpuAccel.processVideoGPU(el, el.clientWidth || 640, el.clientHeight || 360)
    } else {
      el.style.backgroundImage = `url("${resolvedUrl}")`
      el.classList.add('wasm-lazy-loaded')
    }
  }
}

export const wasmLazyloader = new WASMLazyloader()

export default {
  install(app) {
    app.directive('lazy', {
      mounted(el, binding) {
        wasmLazyloader.observe(el, binding.value)
      },
      updated(el, binding) {
        if (binding.value !== binding.oldValue) {
          wasmLazyloader.observe(el, binding.value)
        }
      },
    })

    app.directive('wasm-lazy', {
      mounted(el, binding) {
        wasmLazyloader.observe(el, binding.value)
      },
      updated(el, binding) {
        if (binding.value !== binding.oldValue) {
          wasmLazyloader.observe(el, binding.value)
        }
      },
    })
  },
}
