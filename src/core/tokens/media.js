/**
 * @file @core/tokens/media.js
 * @description Media asset naming suffixes, responsive sizes, and dimensions.
 */

export const MEDIA = Object.freeze({
  MOZ: '-mozjpg',
  THUMB_SUFFIX: '3-MSSIM-tuned-kodak',
  Q50: '-50',
  Q100: '-uncompressed',
  EXT: '.jpg',
  VIDEO_EXT: '.mp4',
  VIDEO_THUMB_EXT: '.mp4.jpg-thumb.jpg',
  VIDEO_SCALE: '.mp4-scaledown-2x',
})

export const IMAGE_SIZES = Object.freeze({
  HOME_MOSAIC: '(max-width: 540px) 100vw, (max-width: 960px) 50vw, (max-width: 1440px) 33vw, 25vw',
  RELATED_MOSAIC: '(max-width: 768px) 100vw, 50vw',
  PROFILE_PICTURE: '200px',
})

export const MEDIA_DIMENSIONS = Object.freeze({
  COVER_WIDTH: 1600,
  COVER_HEIGHT: 900,
  DEFAULT_WIDTH: 800,
  DEFAULT_HEIGHT: 450,
  PROFILE_SIZE: 200,
  FLAG_NAV_WIDTH: 18,
  FLAG_NAV_HEIGHT: 13,
  FLAG_NAV_SPLIT_WIDTH: 8,
  FLAG_DIALOG_WIDTH: 60,
  FLAG_DIALOG_HEIGHT: 44,
  FLAG_DIALOG_SPLIT_WIDTH: 33,
})
