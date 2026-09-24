/**
 * @file @core/tokens/wasm.js
 * @description Centralized WASM worker action tokens for multi-threaded media and math workloads.
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

export const WASM_ACTIONS = Object.freeze(
  Object.fromEntries(_WASM_ACTION_LIST.map((key) => [key, key]))
)

