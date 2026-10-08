/**
 * @file tokens/media/flag-texture.js
 * @description Shared flag renderer texture-atlas size (power of two).
 */

/**
 * Shared flag renderer texture-atlas size (power of two). Sole declaration site — consumers import members
 * from this frozen map rather than re-declaring the literals
 * (zero-hardcoding rule).
 */
export const FLAG_TEXTURE = Object.freeze({
  WIDTH: 512,
  HEIGHT: 256,
})
