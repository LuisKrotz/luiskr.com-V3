/**
 * @file tokens/data/wasm.js
 * @description WASM worker action tokens — message `type` values understood
 * by the media/layout worker pools.
 */

/**
 * Action-name list before objectification — kept as an array so adding an
 * action is a one-line append; `Object.fromEntries` below maps each name
 * to itself (action strings double as their own keys for switch dispatch).
 */
const _WASM_ACTION_LIST = [
  'DECODE_IMAGE_WASM',
  'DECODE_IMAGE_BATCH_WASM',
  'PROCESS_MEDIA_ANALYTICS',
  'COMPUTE_MEDIA_HASH',
  'COMPUTE_SPRING_PHYSICS',
  'DECODE_MEDIA_URL_WASM',
  'PROBE_VIDEO_WASM',
  'PREFETCH_VIDEO_WASM',
  'DECODE_VIDEO_SEGMENT_WASM',
  'DECODE_SVG_WASM',
  'DOCS_SCENE_LAYOUT',
]

/**
 * Frozen `{ NAME: 'NAME' }` action map built from `_WASM_ACTION_LIST` —
 * workers dispatch on `type`, and self-keyed entries make typos
 * compile-checkable while the wire value stays the plain string.
 */
export const WASM_ACTIONS = Object.freeze(
  Object.fromEntries(_WASM_ACTION_LIST.map((key) => [key, key]))
)

/**
 * Frozen worker-pool sizing + asset tokens. Sole declaration site for the
 * worker script path and the pool-size caps — mobile SoCs thermal-throttle
 * under wide pools so the cap is tighter than desktop; the cores fallback
 * covers engines without navigator.hardwareConcurrency.
 */
export const WASM_POOL = Object.freeze({
  WORKER_URL: '/scripts/workers/wasm-worker.js',
  ENGINE_URL: '/scripts/wasm/engine.wasm',
  MOBILE_MAX: 2,
  DESKTOP_MIN: 2,
  DESKTOP_MAX: 4,
  FALLBACK_CORES: 2,
  /**
   * Dispatch reply deadline — a worker that never posts back (broken
   * script, uncaught handler throw, wedged wasm) drops the whole worker
   * after this so callers land on their JS fallback instead of hanging.
   */
  REPLY_TIMEOUT_MS: 8000,
})

/**
 * Dynamic-CSS injector tokens — the managed <style> node's sole rule is
 * the GPU compositor-promotion utility class; skeleton defaults cover the
 * analytics-sizing helper's CSS fallbacks.
 */
export const WASM_CSS = Object.freeze({
  GPU_CLASS: 'wasm-gpu-accelerated',
  DEFAULT_WIDTH: '100%',
  DEFAULT_HEIGHT: '1.2em',
  DISPLAY: 'inline-block',
  FALLBACK_WIDTH_PX: 200,
  FALLBACK_HEIGHT_PX: 24,
})
