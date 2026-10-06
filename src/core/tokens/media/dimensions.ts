/**
 * @file tokens/media/dimensions.js
 * @description Canonical pixel dimensions + media timing tokens split per
 * subsystem — grouped subsets of MEDIA_DIMENSIONS.
 */

export const COVER_DIMENSIONS = Object.freeze({
  COVER_WIDTH: 1600,
  COVER_HEIGHT: 900,
  COVER_HEIGHT_WIDE: 798,
  FHD_WIDTH: 1920,
  FHD_HEIGHT: 1080,
  FHD_WIDTH_STR: '1920',
})

/**
 * The GENERIC_DIMENSIONS constant.
 */
export const GENERIC_DIMENSIONS = Object.freeze({
  DEFAULT_WIDTH: 800,
  DEFAULT_HEIGHT: 450,
  PROFILE_SIZE: 200,
})

/**
 * The VIDEO_DIMENSIONS constant.
 */
export const VIDEO_DIMENSIONS = Object.freeze({
  VIDEO_DEFAULT_WIDTH: 640,
  VIDEO_DEFAULT_HEIGHT: 360,
})

/**
 * flags dimensions.
 */
export const FLAG_DIMENSIONS = Object.freeze({
  FLAG_NAV_WIDTH: 18,
  FLAG_NAV_HEIGHT: 13,
  FLAG_SMALL_THRESHOLD: 25,
  FLAG_DEFAULT_ASPECT: 1.5,
  FLAG_NAV_SPLIT_WIDTH: 8,
  FLAG_DIALOG_WIDTH: 60,
  FLAG_DIALOG_HEIGHT: 44,
  FLAG_DIALOG_SPLIT_WIDTH: 33,
})

/**
 * The NAV_DIMENSIONS constant.
 */
export const NAV_DIMENSIONS = Object.freeze({
  BURGER_CANVAS_SIZE: 68,
})

/**
 * The MOSAIC_DIMENSIONS constant.
 */
export const MOSAIC_DIMENSIONS = Object.freeze({
  MOSAIC_DESKTOP_WIDTH: 1920,
  MOSAIC_MOBILE_WIDTH: 768,
  MOSAIC_DESKTOP_HEIGHT: 913,
  MOSAIC_MOBILE_HEIGHT: 340,
  MOSAIC_MOBILE_WIDTH_STR: '768',
  MOSAIC_DESKTOP_HEIGHT_STR: '913',
  MOSAIC_MOBILE_HEIGHT_STR: '340',
})

/**
 * The GRAVATAR_SIZES constant.
 */
export const GRAVATAR_SIZES = Object.freeze({
  GRAVATAR_SIZE_1X: 200,
  GRAVATAR_SIZE_2X: 300,
  GRAVATAR_SIZE_3X: 400,
})

/**
 * scrolls timings.
 */
export const SCROLL_TIMINGS = Object.freeze({
  SCROLL_DURATION_FULL: 1000,
  SCROLL_DURATION_REDUCED: 2500,
  SCROLL_INIT_DELAY: 500,
})

/**
 * Draws timings.
 */
export const DRAW_TIMINGS = Object.freeze({
  DRAW_ANIM_EXTRA_MS: 800,
  DRAW_ANIM_MAX_MS: 2000,
  DRAW_WORD_MAX_DELAY: 120,
  DRAW_DEFAULT_DELAY: 100,
  DRAW_OBSERVER_THRESHOLD: 0.05,
  // Menu labels: per-char draw pace, per-item stagger, base delay before the
  // first item starts — the item underline uses these to land after the last char.
  MENU_LABEL_CHAR_DELAY: 45,
  MENU_LABEL_STAGGER_MS: 140,
  MENU_LABEL_OFFSET_MS: 400,
})
