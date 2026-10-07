/**
 * @file tokens/motion/gpu.js
 * @description GPU detection & power-hint tokens — renderer-string
 * classifiers for WEBGL_debug_renderer_info output. Used to pick WebGL
 * `powerPreference` — requesting the discrete GPU only when one actually
 * exists avoids draining battery on integrated-only laptops.
 */

/**
 * GPU detection & power-hint tokens. Sole declaration site — consumers import members
 * from this frozen map rather than re-declaring the literals
 * (zero-hardcoding rule).
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

/**
 * Fullscreen-quad clip-space vertices for TRIANGLE_STRIP draw — 4 verts
 * covering [-1,-1]→[1,1]. Shared by every shader quad so the literal is
 * declared once (zero-hardcoding rule); VERTEX_COUNT is the drawArrays n.
 */
export const QUAD_STRIP = Object.freeze({
  VERTS: [-1, -1, 1, -1, -1, 1, 1, 1],
  VERTEX_COUNT: 4,
})

/**
 * WebGL-pool visibility observer tuning — a 1% intersection suffices to
 * count a canvas as visible (any pixel restores it; the rootMargin
 * pre-warms slightly before it scrolls in).
 */
export const WEBGL_POOL_OBSERVER = Object.freeze({
  THRESHOLD: 0.01,
})
