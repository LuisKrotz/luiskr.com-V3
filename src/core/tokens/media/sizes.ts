/**
 * @file tokens/media/sizes.js
 * @description Responsive `sizes` attribute strings per media surface.
 */

/**
 * Responsive `sizes` attribute strings per media surface. Sole declaration site — consumers import members
 * from this frozen map rather than re-declaring the literals
 * (zero-hardcoding rule).
 */
export const IMAGE_SIZES = Object.freeze({
  HOME_MOSAIC: '(max-width: 540px) 100vw, (max-width: 960px) 50vw, (max-width: 1440px) 33vw, 25vw',
  RELATED_MOSAIC: '(max-width: 768px) 100vw, 50vw',
  PROFILE_PICTURE: '200px',
})
