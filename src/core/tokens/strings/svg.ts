/**
 * @file tokens/strings/svg.js
 * @description SVG namespace/data-URI string tokens — grouped subset of
 * STRINGS.
 */

/**
 * SVG namespace/data-URI string tokens. Sole declaration site — consumers import members
 * from this frozen map rather than re-declaring the literals
 * (zero-hardcoding rule).
 */
export const SVG_STRINGS = Object.freeze({
  SVG_XMLNS: 'http://www.w3.org/2000/svg',
  SVG_DATA_URI_PREFIX: 'data:image/svg+xml,',
  SVG_EXT: '.svg',
})
