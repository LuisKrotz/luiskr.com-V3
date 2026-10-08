/**
 * @file utils/dom.ts
 * @description Shadow-piercing DOM queries + the SVG placeholder helper.
 * Every component renders inside a closed-ish shadow tree, so a plain
 * `document.querySelector` can never reach e.g. a `<video>` inside
 * `<media-figure>` — the deep* walkers recurse through `.shadowRoot` so
 * app-level code (autoplay sweep, measurements) can still find them.
 */
import { SVG_STRINGS } from '@core/tokens/strings/svg.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'
import { COVER_DIMENSIONS } from '@core/tokens/media/dimensions.js'

/** Any node that can host a subtree worth scanning. */
type DeepRoot = Document | Element | ShadowRoot

/** document when it exists, null in non-DOM contexts (SSR/test shims). */
const _root = (): Document | null => (typeof document !== TYPE_STRINGS.UNDEFINED ? document : null)

/**
 * Depth-first search for the FIRST element matching `selector`, descending
 * through every nested shadow root it passes. Order matches the visual
 * document order (parents before their shadow children). Recursion — not a
 * hand-rolled stack — matches the self-similar tree shape per repo rule 20.
 * @param selector CSS selector.
 * @param root Subtree root; defaults to document when present.
 * @returns First match or null.
 */
export const deepQuerySelector = (
  selector: string,
  root: DeepRoot | null = _root()
): Element | null => {
  if (!root) return null

  const el = root.querySelector?.(selector)

  if (el) return el

  const elements = root.querySelectorAll ? root.querySelectorAll('*') : []

  for (const child of elements) {
    if (child.shadowRoot) {
      const found = deepQuerySelector(selector, child.shadowRoot)

      if (found) return found
    }
  }

  return null
}

/**
 * Same traversal as deepQuerySelector but collects EVERY match across all
 * shadow trees — used for sweeps like "pause every video on the page".
 * The results array is threaded through recursion (accumulator style) so
 * no intermediate arrays get concatenated per level.
 * @param selector CSS selector.
 * @param root Subtree root; defaults to document.
 * @param results Accumulator — internal recursion state, omit externally.
 * @returns All matching elements in visual document order.
 */
export const deepQuerySelectorAll = (
  selector: string,
  root: DeepRoot | null = _root(),
  results: Element[] = []
): Element[] => {
  if (!root) return results

  const els = root.querySelectorAll ? root.querySelectorAll(selector) : []

  results.push(...Array.from(els))

  const elements = root.querySelectorAll ? root.querySelectorAll('*') : []

  for (const child of elements) {
    if (child.shadowRoot) {
      deepQuerySelectorAll(selector, child.shadowRoot, results)
    }
  }

  return results
}

/**
 * Generates an ultra-lightweight inline SVG placeholder data URI with exact
 * dimensions. An empty `<svg width height viewBox>` weighs ~110 bytes,
 * decodes instantly, and — crucially — gives the `<img>` a definite intrinsic
 * size AND aspect ratio, so `width:auto` layouts reserve the real natural box
 * while the actual image streams in (zero CLS, no uniform-width stretching).
 * Without the width/height attrs the SVG is intrinsic-ratio-only and the img
 * collapses to the ~300×150 default replaced size. Default is FHD
 * 1920×1080 (16:9), the common media shape. `encodeURIComponent` (not
 * base64) keeps the URI readable and is the spec-supported form for
 * `data:image/svg+xml` per RFC 2397 — b64 would inflate size ~33%.
 * @param w Intrinsic width to declare (px).
 * @param h Intrinsic height to declare (px).
 * @returns `data:image/svg+xml;charset=utf-8,…` URI for img.src.
 */
export const svgPlaceholder = (
  w: number = COVER_DIMENSIONS.FHD_WIDTH,
  h: number = COVER_DIMENSIONS.FHD_HEIGHT
): string => {
  const svg = `<svg xmlns="${SVG_STRINGS.SVG_XMLNS}" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"></svg>`

  return `${SVG_STRINGS.SVG_DATA_URI_PREFIX}${encodeURIComponent(svg)}`
}
