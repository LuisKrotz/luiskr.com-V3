/**
 * @file tokens/strings/wasm.js
 * @description WASM worker vocab string tokens — token group.
 */

/**
 * WASM worker vocab string tokens. Sole declaration site — consumers import members
 * from this frozen map rather than re-declaring the literals
 * (zero-hardcoding rule).
 */
export const WASM_STRINGS = Object.freeze({
  BATCH_LAYOUT: 'BATCH_LAYOUT',
  MOSAIC_CARD: 'mosaic_card',
})
