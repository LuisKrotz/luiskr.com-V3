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
]

/**
 * Frozen `{ NAME: 'NAME' }` action map built from `_WASM_ACTION_LIST` —
 * workers dispatch on `type`, and self-keyed entries make typos
 * compile-checkable while the wire value stays the plain string.
 */
export const WASM_ACTIONS = Object.freeze(
  Object.fromEntries(_WASM_ACTION_LIST.map((key) => [key, key]))
)
