/**
 * @file wasm-scroll.ts
 * @description rAF-driven smooth scroller: animates window (or a container)
 * to a target element/offset using the WASM easeOutCubic curve, promoting
 * the scrolled root to a GPU compositor layer for the animation's duration.
 * Optionally rewrites the URL hash to the target's id on completion.
 */

// High-Performance WASM, GPU & NPU Smooth Scroll Engine
// Replaces vue3-smooth-scroll with native WASM physics calculation & WebGL/GPU hardware acceleration
import { TYPE_STRINGS } from '@/core/tokens/strings/types.js'
import { calcEaseOutCubic } from './wasm-layout.js'
import { gpuAccel } from '@/utils/gpu/gpu-accel.js'
import { npuPredict } from '@/utils/gpu/npu-predict.js'
import { deepQuerySelector } from '@/core/utils/dom.js'

/**
 * The WasmScrollOptions value.
 */
export interface WasmScrollOptions {
  /** Scroll container — selector (pierces shadow DOM), element, or window. */
  container?: string | Element | Window
  /** Target element — selector or element. */
  element?: string | Element
  /** Numeric offset or {y}/{top} shape. */
  scrollTo?: number | { y?: number; top?: number }
  /** Extra px offset applied to the target. */
  offset?: number
  /** Animation length in ms (default 600). */
  duration?: number
  /** Replace the URL hash on arrival. */
  updateHistory?: boolean
}

/** Smoothly scrolls to an element/offset. */
export const wasmSmoothScroll = (options: WasmScrollOptions = {}): void => {
  if (typeof window === TYPE_STRINGS.UNDEFINED) return

  const container: Element | Window | null = options.container
    ? typeof options.container === TYPE_STRINGS.STRING
      ? deepQuerySelector(options.container as string)
      : (options.container as Element | Window)
    : window

  const isWindow =
    container === window || container === document.documentElement || container === document.body

  const targetEl: Element | null = options.element
    ? typeof options.element === TYPE_STRINGS.STRING
      ? deepQuerySelector(options.element as string)
      : (options.element as Element)
    : null

  let targetY: number

  if (targetEl) {
    const elRect = targetEl.getBoundingClientRect()

    const containerTop = isWindow ? 0 : (container as Element).getBoundingClientRect().top

    const currentScroll = isWindow ? window.scrollY : (container as Element).scrollTop

    targetY = currentScroll + elRect.top - containerTop + (options.offset || 0)
  } else if (typeof options.scrollTo === TYPE_STRINGS.NUMBER) {
    targetY = (options.scrollTo as number) + (options.offset || 0)
  } else if (typeof options.scrollTo === TYPE_STRINGS.OBJECT && options.scrollTo !== null) {
    const scrollTo = options.scrollTo as { y?: number; top?: number }

    targetY = (scrollTo.y ?? scrollTo.top ?? 0) + (options.offset || 0)
  } else {
    targetY = 0
  }

  const startY = isWindow ? window.scrollY : (container as Element).scrollTop

  const distance = targetY - startY

  if (Math.abs(distance) < 2) return

  const duration = options.duration || 600

  const startTime = performance.now()

  // Hardware GPU Compositor acceleration
  const rootEl = isWindow ? document.documentElement : (container as HTMLElement)

  gpuAccel.accelerateElementGPU(rootEl)

  // Predict user scroll trajectory with NPU engine
  npuPredict.predictTargetLikelihood('scroll_target', targetEl, duration)

  function step(now: number): void {
    const elapsed = now - startTime

    const progress = Math.min(1.0, elapsed / duration)

    // Execute WASM Cubic Easing Routine
    const ease = calcEaseOutCubic(progress)

    const currentY = Math.round(startY + distance * ease)

    if (isWindow) {
      window.scrollTo(0, currentY)
    } else {
      ;(container as Element).scrollTop = currentY
    }

    if (progress < 1.0) {
      requestAnimationFrame(step)
    } else {
      gpuAccel.releaseElementGPU(rootEl)

      if (options.updateHistory && targetEl && targetEl.id) {
        history.replaceState(null, '', `#${targetEl.id}`)
      }
    }
  }

  requestAnimationFrame(step)
}

export default wasmSmoothScroll
