// WASM SVG Decoder — fetches and parses SVG files off the main thread.
// Returns intrinsic dimensions from viewBox/width/height attributes
// so the browser can reserve space before the SVG is injected,
// preventing cumulative layout shift (CLS).

import { wasmPool } from './wasm-pool.js'

class WASMSvgDecoder {
  constructor() {
    this._cache = new Map()
  }

  // ── Decode SVG off-thread ──────────────────────────────────────────────────
  // Fetches the SVG text and extracts dimensions in a worker thread.
  // Returns: { svgText, intrinsicWidth, intrinsicHeight, aspectRatio } | null
  async decodeSvg(url) {
    if (!url) return null
    if (this._cache.has(url)) return this._cache.get(url)

    try {
      const res = await wasmPool.dispatch('DECODE_SVG_WASM', { url })
      const result = res?.results ?? null

      if (result) this._cache.set(url, result)
      return result
    } catch {
      return null
    }
  }

  // ── Predict dimensions from known data ────────────────────────────────────
  // When a component knows the width+height (e.g. from Firebase data) but
  // the SVG file hasn't loaded yet, call this to generate a correct-aspect
  // placeholder without a network request.
  predictPlaceholderSize(knownWidth, knownHeight, containerWidth) {
    if (!knownWidth || !knownHeight || !containerWidth) {
      return { width: containerWidth || 0, height: containerWidth || 0 }
    }

    const aspect = knownWidth / knownHeight
    const height = Math.round(containerWidth / aspect)

    return { width: containerWidth, height }
  }

  // ── Apply SVG inline ───────────────────────────────────────────────────────
  // Injects the decoded SVG text into a container element as an inline SVG.
  // Preserves original intrinsic dimensions as width/height attributes.
  injectSvg(containerEl, result) {
    if (!containerEl || !result?.svgText) return

    containerEl.innerHTML = result.svgText

    const svgEl = containerEl.querySelector('svg')

    if (svgEl) {
      if (result.intrinsicWidth) svgEl.setAttribute('width', String(result.intrinsicWidth))
      if (result.intrinsicHeight) svgEl.setAttribute('height', String(result.intrinsicHeight))
    }
  }
}

export const wasmSvg = new WASMSvgDecoder()
