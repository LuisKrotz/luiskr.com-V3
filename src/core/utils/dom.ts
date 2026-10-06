/**
 * @file utils/dom.ts
 * @description Shadow-piercing DOM queries + the SVG placeholder helper.
 * Every component renders inside a closed-ish shadow tree, so a plain
 * `document.querySelector` can never reach e.g. a `<video>` inside
 * `<media-figure>` — the deep* walkers recurse through `.shadowRoot` so
 * app-level code (autoplay sweep, measurements) can still find them.
 */
import { SVG_STRINGS } from '@/core/tokens/strings/svg.js'
import { TYPE_STRINGS } from '@/core/tokens/strings/types.js'
import { COVER_DIMENSIONS } from '@/core/tokens/media/dimensions.js'

/** Any node that can host a subtree worth scanning. */
type DeepRoot = Document | Element | ShadowRoot

const _root = (): Document | null => (typeof document !== TYPE_STRINGS.UNDEFINED ? document : null)

/**
 * Depth-first search for the FIRST element matching `selector`, descending
 * through every nested shadow root it passes. Order matches the visual
 * document order (parents before their shadow children).
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
 * dimensions. An empty `<svg viewBox="0 0 w h">` weighs ~90 bytes, decodes
 * instantly, and — crucially — gives the `<img>` the right intrinsic aspect
 * ratio so layout is stable while the real image streams in (zero CLS).
 * Default is FHD 1920×1080 (16:9), the common media shape.
 */
export const svgPlaceholder = (
  w: number = COVER_DIMENSIONS.FHD_WIDTH,
  h: number = COVER_DIMENSIONS.FHD_HEIGHT
): string => {
  const svg = `<svg xmlns="${SVG_STRINGS.SVG_XMLNS}" viewBox="0 0 ${w} ${h}"></svg>`

  return `${SVG_STRINGS.SVG_DATA_URI_PREFIX}${encodeURIComponent(svg)}`
}
