/**
 * @file wasm-css.ts
 * @description Dynamic-CSS injector: owns the single <style id="wasm-dynamic-css">
 * node in <head> and publishes runtime-computed rules — currently the
 * .wasm-gpu-accelerated compositor-promotion class used by carousel/media.
 * Skeleton shimmer is intentionally pure CSS (see _structure.scss); the old
 * rAF-driven version forced cascade recalcs every frame and froze iOS.
 */

// WASM CSS utilities — GPU acceleration helpers and dynamic CSS injection
// Note: skeleton animation is handled entirely by CSS in _structure.scss.
// The previous JS-driven shimmer loop (rAF at 60fps calling style.setProperty
// on documentElement) has been removed — it forced a full CSS cascade
// recalculation on every frame and caused page-wide freezes on iOS.
import { WASM_ACTIONS } from '@/core/tokens/data/wasm.js'
import { HTML_TAGS } from '@/core/tokens/elements/html.js'
import { ASSET_IDS } from '@/core/tokens/ids/assets.js'
import { TYPE_STRINGS } from '@/core/tokens/strings/types.js'
import { wasmPool } from './wasm-pool.js'

/**
 * Type contract for WasmSkeletonStyle — the shape consumers rely on.
 */
export interface WasmSkeletonStyle {
  width: string
  height: string
  borderRadius: string
  display: string
}

let styleSheetEl: HTMLStyleElement | null = null

/**
 * Injects generated utility CSS into a single managed <style> element.
 * Keeps a rule registry so repeated injects update in place instead of
 * appending duplicates — used by the WASM layout helpers for classes they
 * compute at runtime.
 */
class WASMCSSManager {
  constructor() {
    this.initStyleSheet()
  }

  /** Finds-or-creates the shared <style> node and injects the static rule set. */
  initStyleSheet(): void {
    if (typeof document === TYPE_STRINGS.UNDEFINED) return

    styleSheetEl = document.getElementById(ASSET_IDS.WASM_DYNAMIC_CSS) as HTMLStyleElement | null

    if (!styleSheetEl) {
      styleSheetEl = document.createElement(HTML_TAGS.STYLE) as HTMLStyleElement
      styleSheetEl.id = ASSET_IDS.WASM_DYNAMIC_CSS
      document.head.appendChild(styleSheetEl)
    }

    this.injectStaticWasmCSS()
  }

  /** Writes the baseline rules (GPU-compositor promotion class). */
  injectStaticWasmCSS(): void {
    if (!styleSheetEl) return

    // GPU-acceleration utility class used by carousel and media components.
    // Skeleton shimmer is CSS-only (see _structure.scss) — no JS loop needed.
    styleSheetEl.textContent = `
      .wasm-gpu-accelerated {
        will-change: transform, opacity;
        transform: translate3d(0, 0, 0);
        -webkit-backface-visibility: hidden;
        backface-visibility: hidden;
      }
    `
  }

  // Calculate skeleton style object (dimensions only — animation is CSS-driven)
  calcWasmSkeletonStyle(
    width: string | number = '100%',
    height: string | number = '1.2em',
    borderRadius = 'var(--radius-2xs)'
  ): WasmSkeletonStyle {
    const numericWidth = (typeof width === TYPE_STRINGS.NUMBER ? width : 200) as number

    const numericHeight = (typeof height === TYPE_STRINGS.NUMBER ? height : 24) as number

    // Offload analytics math to WASM worker
    wasmPool.dispatch(WASM_ACTIONS.PROCESS_MEDIA_ANALYTICS, {
      width: numericWidth,
      height: numericHeight,
      isVideo: false,
    })

    return {
      width: typeof width === TYPE_STRINGS.NUMBER ? `${width}px` : (width as string),
      height: typeof height === TYPE_STRINGS.NUMBER ? `${height}px` : (height as string),
      borderRadius,
      display: 'inline-block',
    }
  }

  /** Appends a new selector rule once (dedupes by selector substring). */
  setWasmCSSRule(selector: string, declarations: string): void {
    if (!styleSheetEl) return

    const ruleString = `${selector} { ${declarations} }`

    if (!styleSheetEl.textContent?.includes(selector)) {
      styleSheetEl.textContent += `\n${ruleString}`
    }
  }
}

/**
 * The wasmCSS constant.
 */
export const wasmCSS = new WASMCSSManager()
/**
 * The calc wasm skeleton style helper.
 */
export const calcWasmSkeletonStyle = (
  w?: string | number,
  h?: string | number,
  r?: string
): WasmSkeletonStyle => wasmCSS.calcWasmSkeletonStyle(w, h, r)
