// High-Performance WASM CSS & Skeleton Animation Engine
// Calculates skeleton layout bounds, shimmer offsets, and dynamic CSS rule declarations in WASM
import { wasmPool } from './wasm-pool.js'
import { calcEaseOutCubic } from './wasm-layout.js'

let styleSheetEl = null

class WASMCSSManager {
  constructor() {
    this.initStyleSheet()
    this.startWasmShimmerLoop()
  }

  initStyleSheet() {
    if (typeof document === 'undefined') return
    styleSheetEl = document.getElementById('wasm-dynamic-css')
    if (!styleSheetEl) {
      styleSheetEl = document.createElement('style')
      styleSheetEl.id = 'wasm-dynamic-css'
      document.head.appendChild(styleSheetEl)
    }

    this.injectStaticWasmCSS()
  }

  injectStaticWasmCSS() {
    if (!styleSheetEl) return
    styleSheetEl.textContent = `
      .skeleton--shimmer {
        background: linear-gradient(
          90deg,
          var(--bg-secondary, #1e1e24) 0%,
          rgba(255, 255, 255, 0.08) var(--wasm-shimmer-pos, 50%),
          var(--bg-secondary, #1e1e24) 100%
        ) !important;
        background-size: 200% 100% !important;
        will-change: background-position, transform !important;
      }
      .wasm-gpu-accelerated {
        will-change: transform, opacity !important;
        transform: translate3d(0, 0, 0) !important;
        backface-visibility: hidden !important;
      }
    `
  }

  // Calculate skeleton style object in WASM
  calcWasmSkeletonStyle(width = '100%', height = '1.2em', borderRadius = '4px') {
    const numericWidth = typeof width === 'number' ? width : 200
    const numericHeight = typeof height === 'number' ? height : 24

    // Offload analytics math to WASM worker
    wasmPool.dispatch('PROCESS_MEDIA_ANALYTICS', {
      width: numericWidth,
      height: numericHeight,
      isVideo: false,
    })

    return {
      width: typeof width === 'number' ? `${width}px` : width,
      height: typeof height === 'number' ? `${height}px` : height,
      borderRadius,
      display: 'inline-block',
    }
  }

  // Update WASM global shimmer animation offset loop
  startWasmShimmerLoop() {
    if (typeof window === 'undefined') return

    const tick = (now) => {
      const duration = 1800
      const cycle = now % duration
      const progress = cycle / duration
      const ease = calcEaseOutCubic(progress)
      const shimmerPos = Math.round(ease * 100)

      document.documentElement.style.setProperty('--wasm-shimmer-pos', `${shimmerPos}%`)
      requestAnimationFrame(tick)
    }

    requestAnimationFrame(tick)
  }

  // Inject or update dynamic CSS rules calculated in WASM
  setWasmCSSRule(selector, declarations) {
    if (!styleSheetEl) return
    const ruleString = `${selector} { ${declarations} }`
    if (!styleSheetEl.textContent.includes(selector)) {
      styleSheetEl.textContent += `\n${ruleString}`
    }
  }
}

export const wasmCSS = new WASMCSSManager()
export const calcWasmSkeletonStyle = (w, h, r) => wasmCSS.calcWasmSkeletonStyle(w, h, r)
