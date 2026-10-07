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
  /** Batch-layout worker call name — sent on the wire to wasm-worker.js. */
  BATCH_LAYOUT: 'BATCH_LAYOUT',
  /** NPU prediction label for mosaic-card hover intent. */
  MOSAIC_CARD: 'mosaic_card',
  /** NPU prediction label for smooth-scroll targets. */
  SCROLL_TARGET: 'scroll_target',
})
