/**
 * @file gpu-info.js
 * @description Shared GPU capability detection + WebGL context-option hints.
 *
 * Probes a throwaway 1×1 WebGL context once, reads the unmasked renderer
 * string via WEBGL_debug_renderer_info, classifies it (dedicated / Apple
 * Silicon / integrated / software), then releases the context immediately.
 *
 * Every canvas widget consumes `glContextOptions()` so the `powerPreference`
 * hint is decided in exactly one place: discrete-capable desktops get
 * 'high-performance', battery-constrained paths get 'default', and pure
 * software rasterizers get 'low-power' (the hint steers the browser to the
 * cheapest path when rendering will be CPU-bound anyway).
 */
import { CHAR_STRINGS } from '@core/tokens/strings/chars.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'
import { WEBGL_STRINGS } from '@core/tokens/strings/webgl.js'
import { webglAllowed } from '../canvas/webgl-mode.js'
import { GPU_PATTERNS, UA_PATTERNS } from '@core/tokens/motion/gpu.js'

/** Classified GPU probe result — frozen so consumers can't mutate the cache. */
export interface GPUInfo {
  /** Unmasked renderer string ('ANGLE (NVIDIA…)', 'Apple M1', 'SwiftShader', …). */
  renderer: string
  /** Discrete-card class detected (NVIDIA/AMD/Radeon Pro). */
  dedicated: boolean
  /** Apple Silicon detected — unified memory but GPU-class performance. */
  apple: boolean
  /** Integrated GPU detected (Intel UHD/Iris, basic ANGLE adapters). */
  integrated: boolean
  /** Software rasterizer (SwiftShader/llvmpipe) — GPU work falls back to CSS. */
  software: boolean
  /** Mobile-class user agent — deprioritizes GPU pinning regardless of chip. */
  mobile: boolean
  /** Worth pinning GPU work to — desktop discrete or Apple Silicon. */
  capable: boolean
}

let _info: GPUInfo | null = null

/**
 * Reads the real GPU renderer string via WEBGL_debug_renderer_info —
 * tries WebGL2 then WebGL1, preferring the unmasked constants so the result
 * identifies the actual adapter instead of the vendor redaction string.
 * @returns {string} the renderer description, or "" when GPU probing is impossible
 */
const _probeRenderer = (): string => {
  if (typeof document === TYPE_STRINGS.UNDEFINED) return CHAR_STRINGS.EMPTY

  let canvas: HTMLCanvasElement | undefined
  let gl: WebGLRenderingContext | WebGL2RenderingContext | null | undefined

  try {
    canvas = document.createElement('canvas')
    canvas.width = 1
    canvas.height = 1

    gl = webglAllowed()
      ? (canvas.getContext(WEBGL_STRINGS.WEBGL2) as WebGL2RenderingContext | null) ||
        (canvas.getContext(WEBGL_STRINGS.WEBGL) as WebGLRenderingContext | null)
      : null
    if (!gl) return CHAR_STRINGS.EMPTY

    const ext = gl.getExtension(
      WEBGL_STRINGS.WEBGL_DEBUG_RENDERER_INFO
    ) as WEBGL_debug_renderer_info | null

    return String(
      gl.getParameter(ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER) || CHAR_STRINGS.EMPTY
    )
  } catch {
    return CHAR_STRINGS.EMPTY
  } finally {
    try {
      gl?.getExtension?.(WEBGL_STRINGS.WEBGL_LOSE_CONTEXT)?.loseContext()
    } catch {
      // Probe context is throwaway — loss is intentional.
    }
  }
}

/**
 * Detects GPU capabilities once and caches the result.
 * @returns {{renderer: string, dedicated: boolean, apple: boolean, integrated: boolean, software: boolean, mobile: boolean, capable: boolean}}
 */
export const getGPUInfo = (): GPUInfo => {
  if (_info) return _info

  const renderer = _probeRenderer()

  const mobile =
    typeof navigator !== TYPE_STRINGS.UNDEFINED && UA_PATTERNS.MOBILE_UA.test(navigator.userAgent)

  const dedicated = GPU_PATTERNS.DEDICATED.test(renderer)

  const apple = GPU_PATTERNS.APPLE.test(renderer)

  const software = GPU_PATTERNS.SOFTWARE.test(renderer)

  const integrated = !dedicated && !apple && !software && GPU_PATTERNS.INTEGRATED.test(renderer)

  _info = Object.freeze({
    renderer,
    dedicated,
    apple,
    integrated,
    software,
    mobile,
    // Capable = a GPU worth pinning work to: discrete card or Apple Silicon
    // on a desktop-class device.
    capable: !mobile && !software && (dedicated || apple),
  })

  return _info
}

/**
 * Builds WebGL context attributes with the correct `powerPreference` hint
 * for this device. Callers merge their rendering-specific flags on top.
 * @param {object} overrides
 * @returns {object}
 */
export const glContextOptions = (
  overrides: WebGLContextAttributes = {}
): WebGLContextAttributes => {
  const { capable, software } = getGPUInfo()

  const powerPreference = (
    capable
      ? WEBGL_STRINGS.POWER_PREF_HIGH
      : software
        ? WEBGL_STRINGS.POWER_PREF_LOW
        : WEBGL_STRINGS.POWER_PREF_DEFAULT
  ) as WebGLContextAttributes['powerPreference']

  return { powerPreference, ...overrides }
}
