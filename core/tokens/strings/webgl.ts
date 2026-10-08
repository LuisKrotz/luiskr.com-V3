/**
 * @file tokens/strings/webgl.js
 * @description WebGL context/extension/power-preference string tokens —
 * token group.
 */

/**
 * WebGL context/extension/power-preference string tokens. Sole declaration site — consumers import members
 * from this frozen map rather than re-declaring the literals
 * (zero-hardcoding rule).
 */
export const WEBGL_STRINGS = Object.freeze({
  WEBGL: 'webgl',
  EXPERIMENTAL_WEBGL: 'experimental-webgl',
  WEBGL2: 'webgl2',
  WEBGL_LOSE_CONTEXT: 'WEBGL_lose_context',
  WEBGL_DEBUG_RENDERER_INFO: 'WEBGL_debug_renderer_info',
  POWER_PREF_HIGH: 'high-performance',
  POWER_PREF_LOW: 'low-power',
  POWER_PREF_DEFAULT: 'default',
  CONTEXT_2D: '2d',
  OES_STANDARD_DERIVATIVES: 'OES_standard_derivatives',
  // Shader stage labels used in widget warn logs (`X VS error:`).
  VERTEX_STAGE: 'VS',
  FRAGMENT_STAGE: 'FS',
  LINK_STAGE: 'Link',
  FALLBACK_STAGE: 'fallback',
  // Shared attribute/uniform names every fullscreen-quad shader uses.
  A_POS: 'a_pos',
  A_POSITION: 'a_position',
  U_RESOLUTION: 'u_resolution',
  U_TIME: 'u_time',
} as const)
