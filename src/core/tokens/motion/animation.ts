/**
 * @file tokens/motion/animation.js
 * @description Easing curve + transition duration tokens — grouped subsets
 * of ANIMATION.
 */

export const EASING = Object.freeze({
  /** Smooth cubic-bezier used throughout the design system */
  EASING: 'cubic-bezier(0.22, 1, 0.36, 1)',
  /** Page transition easing */
  PAGE_EASING: 'cubic-bezier(0.16, 1, 0.3, 1)',
})

/**
 * The ANIMATION_DURATIONS constant.
 */
export const ANIMATION_DURATIONS = Object.freeze({
  /** Route transition duration (ms) */
  ROUTE_DURATION: 450,
  /** Mosaic expand/collapse transition duration (ms) */
  MOSAIC_DURATION: 420,
  /** Carousel fade-in transition duration (ms) */
  CAROUSEL_FADE_DURATION: 800,
  /** Menu modal close/fade-out duration (ms) — must cover the 1.1s shader dissolve + 0.9s modal fade */
  MENU_CLOSE_DURATION: 1200,
  /** Menu modal entrance settle time (ms) — longest item delay (0.76s) + item duration (1.3s) */
  MENU_SETTLE_DURATION: 2200,
  /** Dialog genie zoom-out duration (ms) — must match .pref-backdrop--leave transition */
  DIALOG_LEAVE_DURATION: 640,
})
