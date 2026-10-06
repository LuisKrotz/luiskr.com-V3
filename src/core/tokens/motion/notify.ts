/**
 * @file tokens/motion/notify.js
 * @description Notification/toast runtime tuning tokens.
 */

export const NOTIFY = Object.freeze({
  /** Default auto-dismiss for a toast item (ms) */
  TOAST_DURATION: 5000,
  /** Max simultaneously visible toasts — oldest evicted first */
  MAX_VISIBLE: 4,
  /** Re-show window for identical type+message pairs (ms) */
  DEDUPE_MS: 2500,
  /** Cap on the dedupe registry before oldest entries are pruned */
  DEDUPE_CACHE_MAX: 64,
})
