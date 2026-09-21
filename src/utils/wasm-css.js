// WASM CSS utilities — GPU acceleration helpers and dynamic CSS injection
// Note: skeleton animation is handled entirely by CSS in _structure.scss.
// The previous JS-driven shimmer loop (rAF at 60fps calling style.setProperty
// on documentElement) has been removed — it forced a full CSS cascade
// recalculation on every frame and caused page-wide freezes on iOS.
import { wasmPool } from './wasm-pool.js'
import { STRINGS } from '../core/constants.js'

let styleSheetEl = null

class WASMCSSManager {
  constructor() {
    this.initStyleSheet()
  }

  initStyleSheet() {
    if (typeof document === STRINGS.UNDEFINED) return

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
    const numericWidth = typeof width === STRINGS.NUMBER ? width : 200
    const numericHeight = typeof height === STRINGS.NUMBER ? height : 24

    // Offload analytics math to WASM worker
    wasmPool.dispatch('PROCESS_MEDIA_ANALYTICS', {
      width: numericWidth,
      height: numericHeight,
      isVideo: false,
    })

    return {
      width: typeof width === STRINGS.NUMBER ? `${width}px` : width,
      height: typeof height === STRINGS.NUMBER ? `${height}px` : height,
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
