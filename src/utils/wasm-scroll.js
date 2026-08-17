// High-Performance WASM, GPU & NPU Smooth Scroll Engine
// Replaces vue3-smooth-scroll with native WASM physics calculation & WebGL/GPU hardware acceleration
import { calcEaseOutCubic } from './wasm-layout.js'
import { gpuAccel } from './gpu-accel.js'
import { npuPredict } from './npu-predict.js'

export function wasmSmoothScroll(options = {}) {
  if (typeof window === 'undefined') return

  const container = options.container
    ? typeof options.container === 'string'
      ? document.querySelector(options.container)
      : options.container
    : window

  const isWindow =
    container === window || container === document.documentElement || container === document.body
  const targetEl = options.element
    ? typeof options.element === 'string'
      ? document.querySelector(options.element)
      : options.element
    : null

  let targetY

  if (targetEl) {
    const elRect = targetEl.getBoundingClientRect()
    const containerTop = isWindow ? 0 : container.getBoundingClientRect().top
    const currentScroll = isWindow ? window.scrollY : container.scrollTop
    targetY = currentScroll + elRect.top - containerTop + (options.offset || 0)
  } else if (typeof options.scrollTo === 'number') {
    targetY = options.scrollTo + (options.offset || 0)
  } else if (typeof options.scrollTo === 'object' && options.scrollTo !== null) {
    targetY = (options.scrollTo.y ?? options.scrollTo.top ?? 0) + (options.offset || 0)
  } else {
    targetY = 0
  }

  const startY = isWindow ? window.scrollY : container.scrollTop
  const distance = targetY - startY
  if (Math.abs(distance) < 2) return

  const duration = options.duration || 600
  const startTime = performance.now()

  // Hardware GPU Compositor acceleration
  const rootEl = isWindow ? document.documentElement : container
  gpuAccel.accelerateElementGPU(rootEl)

  // Predict user scroll trajectory with NPU engine
  npuPredict.predictTargetLikelihood('scroll_target', targetEl, duration)

  function step(now) {
    const elapsed = now - startTime
    const progress = Math.min(1.0, elapsed / duration)
    // Execute WASM Cubic Easing Routine
    const ease = calcEaseOutCubic(progress)
    const currentY = Math.round(startY + distance * ease)

    if (isWindow) {
      window.scrollTo(0, currentY)
    } else {
      container.scrollTop = currentY
    }

    if (progress < 1.0) {
      requestAnimationFrame(step)
    } else {
      if (options.updateHistory && targetEl && targetEl.id) {
        history.replaceState(null, '', `#${targetEl.id}`)
      }
    }
  }

  requestAnimationFrame(step)
}

export default {
  install(app) {
    app.config.globalProperties.$smoothScroll = wasmSmoothScroll
  },
}
