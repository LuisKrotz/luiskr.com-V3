/**
 * @file tokens/motion/prefetch.js
 * @description Predictive-prefetch tuning tokens.
 */

export const PREFETCH_CONFIG = Object.freeze({
  IDLE_TIMEOUT: 2000,
  FALLBACK_DELAY: 120,
  ROOT_MARGIN: '200px 0px',
  THRESHOLD: 0.1,
  PORTFOLIO_REGEX: /\/portfolio\/([^/?#]+)/,
})
