/**
 * @file tokens/layout/breakpoints.js
 * @description Responsive breakpoint registry (px).
 */

/**
 * Responsive breakpoint registry (px). Sole declaration site — consumers import members
 * from this frozen map rather than re-declaring the literals
 * (zero-hardcoding rule).
 */
export const BREAKPOINTS = Object.freeze({
  272: 272,
  320: 320,
  375: 375,
  414: 414,
  540: 540,
  768: 768,
  960: 960,
  1024: 1024,
  1280: 1280,
  1360: 1360,
  1440: 1440,
  1560: 1560,
  1680: 1680,
  1920: 1920,
  2100: 2100,
  2560: 2560,
  3840: 3840,
})
