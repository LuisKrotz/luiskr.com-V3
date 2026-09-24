import { STRINGS, ATTRS, MEDIA_DIMENSIONS } from '../constants.js'

/**
 * Traverses shadow DOM roots recursively to find the first element matching selector.
 * @param {string} selector - CSS selector
 * @param {Document|Element|ShadowRoot} root - Starting root node
 * @returns {Element|null}
 */
export const deepQuerySelector = (
  selector,
  root = typeof document !== STRINGS.UNDEFINED ? document : null
) => {
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
 * Traverses shadow DOM roots recursively to collect all elements matching selector.
 * @param {string} selector - CSS selector
 * @param {Document|Element|ShadowRoot} root - Starting root node
 * @param {Element[]} results - Accumulated matches
 * @returns {Element[]}
 */
export const deepQuerySelectorAll = (
  selector,
  root = typeof document !== STRINGS.UNDEFINED ? document : null,
  results = []
) => {
  if (!root) return results

  const els = root.querySelectorAll ? root.querySelectorAll(selector) : []

  results.push(...els)

  const elements = root.querySelectorAll ? root.querySelectorAll('*') : []

  for (const child of elements) {
    if (child.shadowRoot) {
      deepQuerySelectorAll(selector, child.shadowRoot, results)
    }
  }

  return results
}

/**
 * Generates an ultra-lightweight inline SVG placeholder data URI with exact dimensions.
 * @param {number} w - Width
 * @param {number} h - Height
 * @returns {string} Data URI
 */
export const svgPlaceholder = (w = MEDIA_DIMENSIONS.FHD_WIDTH, h = MEDIA_DIMENSIONS.FHD_HEIGHT) => {
  const svg = `<svg xmlns="${STRINGS.SVG_XMLNS}" viewBox="0 0 ${w} ${h}"></svg>`

  return `${STRINGS.SVG_DATA_URI_PREFIX}${encodeURIComponent(svg)}`
}

