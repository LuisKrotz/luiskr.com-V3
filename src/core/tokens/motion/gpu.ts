/**
 * @file tokens/motion/gpu.js
 * @description GPU detection & power-hint tokens — renderer-string
 * classifiers for WEBGL_debug_renderer_info output. Used to pick WebGL
 * `powerPreference` — requesting the discrete GPU only when one actually
 * exists avoids draining battery on integrated-only laptops.
 */

export const GPU_PATTERNS = Object.freeze({
  /** Desktop discrete GPUs (NVIDIA / AMD / Intel Arc) */
  DEDICATED: /nvidia|geforce|quadro|rtx|gtx|radeon|(?<!v)amd|arc a\d/i,
  /** Apple Silicon — unified memory but performant; safe to treat as capable */
  APPLE: /apple/i,
  /** Integrated/mobile GPUs where the discrete hint is meaningless */
  INTEGRATED: /intel(?!.*arc a)|uhd|iris|hd graphics|mali|adreno|powervr|videocore/i,
  /** CPU rasterizers — never request high-performance */
  SOFTWARE: /swiftshader|llvmpipe|softpipe|software|mesa offscreen/i,
})

/**
 * Frozen ua map — sole declaration site for these tokens; consumers read members and never
 * re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the token contract
 * immutable at runtime.
 */
export const UA_PATTERNS = Object.freeze({
  /** Mobile user agents — WebGL hinting is irrelevant (single GPU path) */
  MOBILE_UA: /iPhone|iPad|iPod|Android|Mobile/i,
})
