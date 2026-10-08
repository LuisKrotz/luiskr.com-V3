/**
 * @file tokens/ids/assets.js
 * @description Dynamically-created element id tokens (critical CSS, WASM
 * style sheet, playground canvas) — token group.
 */

/**
 * Dynamically-created element id tokens (critical CSS, WASM style sheet, playground canvas) Sole declaration site — consumers import members
 * from this frozen map rather than re-declaring the literals
 * (zero-hardcoding rule).
 */
export const ASSET_IDS = Object.freeze({
  CRITICAL_CSS: 'critical-css',
  WASM_DYNAMIC_CSS: 'wasm-dynamic-css',
  EARTH_CANVAS: 'earth-canvas',
  FILTER: 'filter',
})
