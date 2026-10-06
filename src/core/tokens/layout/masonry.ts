/**
 * @file tokens/layout/masonry.js
 * @description Masonry layout constants. These match the Vue source values
 * exactly — any change must be reflected in both the WASM layout worker and
 * these constants.
 */

export const LAYOUT = Object.freeze({
  /** Aspect ratio multiplier for featured (wide) cards */
  FEAT_MULT: 0.48,
  /** Cycling aspect ratio multipliers for standard cards */
  COMP_MULTS: Object.freeze([0.56, 0.58, 0.54, 0.57, 0.55]),
  /** Inter-card gap in pixels */
  GAP: 16,
})
