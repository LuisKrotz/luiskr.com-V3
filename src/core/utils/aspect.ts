/**
 * @file utils/aspect.js
 * @description Aspect-ratio math shared by media layout code — keeps boxes
 * proportional so skeletons and placeholders reserve the exact final shape.
 */

/**
 * Calculates aspect-ratio scaled height while preserving proportions.
 * Formula: `height_out = (h/w) × maxWidth` — the intrinsic ratio (h/w)
 * scaled to the bounding width. Rounded to an integer pixel so it can land
 * directly on a style/attribute. Returns the raw height (or 0) when any
 * input is missing rather than NaN — callers render `height || fallback`.
 * @param width - Intrinsic width
 * @param height - Intrinsic height
 * @param maxWidth - Target max bounding width
 * @returns Scaled integer height
 */
export const calcAspectScaled = (width: number, height: number, maxWidth: number): number => {
  if (!width || !height || !maxWidth) return height || 0

  return Math.round((height / width) * maxWidth)
}
