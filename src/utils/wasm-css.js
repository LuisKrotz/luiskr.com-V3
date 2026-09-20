// WASM CSS utilities — GPU acceleration helpers and dynamic CSS injection
// Note: skeleton animation is handled entirely by CSS in _structure.scss.
// The previous JS-driven shimmer loop (rAF at 60fps calling style.setProperty
// on documentElement) has been removed — it forced a full CSS cascade
// recalculation on every frame and caused page-wide freezes on iOS.
import { wasmPool } from './wasm-pool.js'

let styleSheetEl = null

class WASMCSSManager {
  constructor() {
    this.initStyleSheet()
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

    // GPU-acceleration utility class used by carousel and media components.
    // Skeleton shimmer is CSS-only (see _structure.scss) — no JS loop needed.
    styleSheetEl.textContent = `
      .wasm-gpu-accelerated {
        will-change: transform, opacity;
        transform: translate3d(0, 0, 0);
        backface-visibility: hidden;
        -webkit-backface-visibility: hidden;
      }
    `
  }

  // Calculate skeleton style object (dimensions only — animation is CSS-driven)
  calcWasmSkeletonStyle(width = '100%', height = '1.2em', borderRadius = 'var(--radius-2xs)') {
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
