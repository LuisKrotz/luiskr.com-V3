/**
 * @file tokens/motion/animation.js
 * @description Easing curve + transition duration tokens — grouped subsets
 * of ANIMATION.
 */

/**
 * Easing curve + transition duration tokens. Sole declaration site — consumers import members
 * from this frozen map rather than re-declaring the literals
 * (zero-hardcoding rule).
 */
export const EASING = Object.freeze({
  /** Smooth cubic-bezier used throughout the design system */
  EASING: 'cubic-bezier(0.22, 1, 0.36, 1)',
  /** Page transition easing */
  PAGE_EASING: 'cubic-bezier(0.16, 1, 0.3, 1)',
})

/**
 * Frozen animation map — sole declaration site for these tokens; consumers read members and
 * never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the token
 * contract immutable at runtime.
 */
export const ANIMATION_DURATIONS = Object.freeze({
  /** Route transition duration (ms) */
  ROUTE_DURATION: 450,
  /** Half-duration of the view cross-fade (ms) — fade-out leg, then fade-in */
  PAGE_FADE_HALF: 350,
  /**
   * Delay before the progress bar's --done class is removed (ms) — must
   * outlast the CSS sweep-to-100% (0.3s) + delayed fade-out (0.3s delay +
   * 0.4s fade) so the transform reset happens while the bar is invisible.
   */
  PROGRESS_BAR_RESET: 1100,
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
  /** Space-playground loader fade-out before the node is removed (ms) — must match the CSS opacity transition */
  LOADER_FADE_MS: 800,
  /** Default smooth-scroll animation length (ms) — long enough to read the ease, short enough to not feel laggy */
  SCROLL_DURATION: 600,
  /** Minimum scroll distance (px) below which the animation is skipped — sub-2px moves are invisible and would only churn frames */
  SCROLL_MIN_DISTANCE: 2,
})
