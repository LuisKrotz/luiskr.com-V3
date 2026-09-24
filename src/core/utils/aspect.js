/**
 * Calculates aspect-ratio scaled height while preserving proportions.
 * @param {number} width - Intrinsic width
 * @param {number} height - Intrinsic height
 * @param {number} maxWidth - Target max bounding width
 * @returns {number} Scaled integer height
 */
export const calcAspectScaled = (width, height, maxWidth) => {
  if (!width || !height || !maxWidth) return height || 0

  return Math.round((height / width) * maxWidth)
}
