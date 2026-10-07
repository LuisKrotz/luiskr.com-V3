/**
 * @file tokens/media/dimensions.js
 * @description Canonical pixel dimensions + media timing tokens split per
 * subsystem — grouped subsets of MEDIA_DIMENSIONS.
 */

/**
 * Canonical pixel dimensions + media timing tokens split per subsystem. Sole declaration site — consumers import members
 * from this frozen map rather than re-declaring the literals
 * (zero-hardcoding rule).
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
 * Frozen generic dimension map — sole declaration site for these tokens; consumers read
 * members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
 * the token contract immutable at runtime.
 */
export const GENERIC_DIMENSIONS = Object.freeze({
  DEFAULT_WIDTH: 800,
  DEFAULT_HEIGHT: 450,
  PROFILE_SIZE: 200,
  /** Fallback intrinsic px for award-icon images when the CMS row omits width/height — declares a stable box so lazy loads don't shift layout. */
  AWARD_ICON_SIZE: 60,
})

/** Image decode budgets shared by progressive media pipelines. */
export const IMAGE_DIMENSIONS = Object.freeze({
  /** 4096² pixels: preserves the former memory ceiling without rejecting tall, narrow screenshots. */
  MAX_DECODE_PIXELS: 4096 * 4096,
})

/**
 * Frozen video dimension map — sole declaration site for these tokens; consumers read
 * members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
 * the token contract immutable at runtime.
 */
export const VIDEO_DIMENSIONS = Object.freeze({
  VIDEO_DEFAULT_WIDTH: 640,
  VIDEO_DEFAULT_HEIGHT: 360,
})

/**
 * Frozen flag-icon geometry map — flag images are drawn at small pixel
 * sizes where every px counts: NAV (18×13) for the locale picker, DIALOG
 * (60×44) for the language dialog, SPLIT widths for the half-flag
 * divider, and `FLAG_DEFAULT_ASPECT` 1.5 (3:2, the most common national
 * flag ratio) as the fallback when a flag lacks intrinsic dims.
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
 * Frozen nav dimension map — sole declaration site for these tokens; consumers read members
 * and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the
 * token contract immutable at runtime.
 */
export const NAV_DIMENSIONS = Object.freeze({
  BURGER_CANVAS_SIZE: 68,
})

/**
 * Frozen mosaic dimension map — sole declaration site for these tokens; consumers read
 * members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
 * the token contract immutable at runtime.
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
 * Frozen gravatar map — sole declaration site for these tokens; consumers read members and
 * never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the token
 * contract immutable at runtime.
 */
export const GRAVATAR_SIZES = Object.freeze({
  GRAVATAR_SIZE_1X: 200,
  GRAVATAR_SIZE_2X: 300,
  GRAVATAR_SIZE_3X: 400,
})

/**
 * Frozen scroll-timing map (ms) — `SCROLL_DURATION_FULL` paces animated
 * page scrolls, `SCROLL_DURATION_REDUCED` is the slower ramp under
 * prefers-reduced-motion (longer, gentler rather than instant so the jump
 * stays perceivable), `SCROLL_INIT_DELAY` defers scroll restoration until
 * after first paint settles.
 */
export const SCROLL_TIMINGS = Object.freeze({
  SCROLL_DURATION_FULL: 1000,
  SCROLL_DURATION_REDUCED: 2500,
  SCROLL_INIT_DELAY: 500,
})

/**
 * Frozen draw-text timing map (ms + observer fraction) — caps and defaults
 * for the per-character staggered reveal: `EXTRA_MS`/`MAX_MS` bound total
 * animation length regardless of string size, `WORD_MAX_DELAY`/
 * `DEFAULT_DELAY` shape the per-word stagger, `OBSERVER_THRESHOLD` (0.05)
 * is the IntersectionObserver visibility fraction that triggers a draw,
 * and the `MENU_LABEL_*` triple paces nav-item labels so each item's
 * underline lands right after its last character.
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
