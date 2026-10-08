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
import { WASM_ACTIONS, WASM_CSS } from '@core/tokens/data/wasm.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { ASSET_IDS } from '@core/tokens/ids/assets.js'
import { CSS_STRINGS } from '@core/tokens/strings/css.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'
import { wasmPool } from './wasm-pool.js'

/** Skeleton-placeholder style tuple produced by calcWasmSkeletonStyle. */
export interface WasmSkeletonStyle {
  /** CSS width — `${n}px` for numeric input, passthrough for strings. */
  width: string
  /** CSS height — `${n}px` for numeric input, passthrough for strings. */
  height: string
  /** CSS border-radius — a var() token reference. */
  borderRadius: string
  /** CSS display — inline-block so the placeholder participates in text flow. */
  display: string
}

/** The lazily-created managed <style> node in <head>. */
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

  /**
   * Finds-or-creates the shared <style id="wasm-dynamic-css"> node and
   * injects the static rule set. SSR-safe: returns early without document.
   */
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

  /**
   * Writes the baseline rules — the GPU compositor-promotion utility class
   * (will-change + translate3d + backface-visibility) used by carousel and
   * media components. Skeleton shimmer stays CSS-only in _structure.scss.
   */
  injectStaticWasmCSS(): void {
    if (!styleSheetEl) return

    // GPU-acceleration utility class used by carousel and media components.
    // Skeleton shimmer is CSS-only (see _structure.scss) — no JS loop needed.
    styleSheetEl.textContent = `
      .${WASM_CSS.GPU_CLASS} {
        will-change: transform, opacity;
        transform: translate3d(0, 0, 0);
        -webkit-backface-visibility: hidden;
        backface-visibility: hidden;
      }
    `
  }

  /**
   * Computes the skeleton-placeholder style tuple (dimensions only — the
   * shimmer animation is CSS-driven). Numeric inputs become px strings;
   * strings pass through. As a side effect it dispatches a media-analytics
   * job to the pool so sizing telemetry feeds the WASM analytics pipeline.
   * @param width CSS width or pixel number (default 100%).
   * @param height CSS height or pixel number (default 1.2em ≈ one text line).
   * @param borderRadius CSS radius (default var(--radius-2xs)).
   * @returns The style tuple for inline application.
   */
  calcWasmSkeletonStyle(
    width: string | number = WASM_CSS.DEFAULT_WIDTH,
    height: string | number = WASM_CSS.DEFAULT_HEIGHT,
    borderRadius: string = CSS_STRINGS.VAR_RADIUS_2XS
  ): WasmSkeletonStyle {
    const numericWidth = (
      typeof width === TYPE_STRINGS.NUMBER ? width : WASM_CSS.FALLBACK_WIDTH_PX
    ) as number

    const numericHeight = (
      typeof height === TYPE_STRINGS.NUMBER ? height : WASM_CSS.FALLBACK_HEIGHT_PX
    ) as number

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
      display: WASM_CSS.DISPLAY,
    }
  }

  /**
   * Appends a new selector rule once — dedupes by selector substring so
   * repeat calls can't bloat the sheet with identical rules.
   * @param selector CSS selector text.
   * @param declarations Declaration body (`prop: value; …`).
   */
  setWasmCSSRule(selector: string, declarations: string): void {
    if (!styleSheetEl) return

    const ruleString = `${selector} { ${declarations} }`

    if (!styleSheetEl.textContent?.includes(selector)) {
      styleSheetEl.textContent += `\n${ruleString}`
    }
  }
}

/**
 * Shared injector singleton — one managed <style> node serves every
 * runtime rule so the head never accumulates duplicate sheets.
 */
export const wasmCSS = new WASMCSSManager()

/**
 * Convenience wrapper over wasmCSS.calcWasmSkeletonStyle — the historical
 * free-function API kept so call sites stay on the old import.
 * @param w Width (CSS string or px number).
 * @param h Height (CSS string or px number).
 * @param r Border-radius override.
 * @returns The skeleton style tuple.
 */
export const calcWasmSkeletonStyle = (
  w?: string | number,
  h?: string | number,
  r?: string
): WasmSkeletonStyle => wasmCSS.calcWasmSkeletonStyle(w, h, r)
