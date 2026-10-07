/**
 * @file tokens/motion/carousel.js
 * @description Carousel timing/geometry tokens — grouped subsets of
 * CAROUSEL.
 */

/**
 * Carousel timing/geometry tokens. Sole declaration site — consumers import members
 * from this frozen map rather than re-declaring the literals
 * (zero-hardcoding rule).
 */
export const CAROUSEL_TIMING = Object.freeze({
  /** Autoplay interval in milliseconds before advancing to next slide */
  AUTOPLAY_DURATION: 5000,
  /** Teleport animation duration (ms) — must match CSS transition */
  TELEPORT_DELAY: 420,
})

/**
 * Frozen carousel map — sole declaration site for these tokens; consumers read members and
 * never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the token
 * contract immutable at runtime.
 */
export const CAROUSEL_LAYOUT = Object.freeze({
  /** SVG countdown ring circumference: 2π × r (r=19) */
  CIRCUMFERENCE: 2 * Math.PI * 19,
  /** Viewport width below which mobile behaviour applies */
  MOBILE_BREAKPOINT: 768,
  /** Minimum viewport width for the ≤2-item side-by-side (non-carousel) layout */
  SIDE_BY_SIDE_BREAKPOINT: 960,
  /** Minimum swipe distance (px) required to trigger a slide change */
  SWIPE_THRESHOLD: 40,
  /** Slide height cap as a fraction of the viewport height */
  MAX_HEIGHT_VH: 70,
  /** Skeleton sections reserve the same capped height so content loads without shifting */
  SKELETON_ITEM_HEIGHT: '70vh',
})

/**
 * Frozen carousel map — sole declaration site for these tokens; consumers read members and
 * never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the token
 * contract immutable at runtime.
 */
export const CAROUSEL_LOADING = Object.freeze({
  /** Carousels rendered synchronously with the page (the ones that can be in the first viewport) */
  EAGER_COUNT: 2,
  /** Below-the-fold carousels are rendered this many at a time in idle periods */
  BATCH_SIZE: 2,
  /** Upper bound before a deferred batch runs anyway (ms) */
  DEFERRED_TIMEOUT: 250,
})
