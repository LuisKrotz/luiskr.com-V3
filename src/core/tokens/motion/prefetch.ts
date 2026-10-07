/**
 * @file tokens/motion/prefetch.js
 * @description Predictive-prefetch tuning tokens.
 */

/**
 * Predictive-prefetch tuning tokens. Sole declaration site — consumers import members
 * from this frozen map rather than re-declaring the literals
 * (zero-hardcoding rule).
 */
export const PREFETCH_CONFIG = Object.freeze({
  IDLE_TIMEOUT: 2000,
  FALLBACK_DELAY: 120,
  ROOT_MARGIN: '200px 0px',
  THRESHOLD: 0.1,
  PORTFOLIO_REGEX: /\/portfolio\/([^/?#]+)/,
})

/**
 * NPU/GPU predictor scoring constants — the heuristic weights for
 * hover-dwell vs pointer-speed and the auto-prefetch confidence cutoff.
 * NPU/GPU tiers share the same linear blend (base + hover·w + (1−speed)·w)
 * with slightly different coefficients per compute target; the WASM
 * tier converts a spring-physics position into the same 0–1 scale.
 */
export const NPU_PREDICT = Object.freeze({
  /** Confidence needed to auto-prefetch the route asset. */
  PREFETCH_THRESHOLD: 0.6,
  /** Hover dwell (ms) that counts as full intent. */
  HOVER_FULL_MS: 300,
  /** Pointer speed (px/ms) that counts as "passing through". */
  SPEED_FULL: 2.0,
  /** NPU tier: base + hover weight + inverse-speed weight + cap. */
  NPU_BASE: 0.4,
  NPU_HOVER_W: 0.45,
  NPU_SPEED_W: 0.15,
  NPU_CAP: 0.99,
  /** GPU tier — same blend, fractionally different coefficients. */
  GPU_BASE: 0.38,
  GPU_HOVER_W: 0.47,
  GPU_SPEED_W: 0.15,
  GPU_CAP: 0.98,
  /** WASM tier: spring position normalization + bounds. */
  WASM_SPRING_TARGET: 300,
  WASM_SPRING_STIFFNESS: 120,
  WASM_SPRING_DAMPING: 10,
  WASM_POS_MIN: 0.2,
  WASM_CAP: 0.98,
  /** Last-resort JS heuristic when the worker returns no position. */
  JS_BASE: 0.45,
  JS_HOVER_HALF_MS: 250,
  JS_HOVER_MAX: 0.5,
  JS_CAP: 0.95,
  /** WebNN deviceType requested from navigator.ml. */
  DEVICE_TYPE: 'npu',
})
