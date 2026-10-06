/**
 * @file webgl-mode.ts
 * @description Single choke point for WebGL availability. Every widget asks
 * `webglAllowed()` (or goes through `webglContext()`) before touching
 * `canvas.getContext('webgl*')`, so `?debug=webGLMode:fallback` forces the
 * entire CSS/2D/static fallback surface without mocking a single context —
 * useful for visual-testing the fallback path on capable hardware and for
 * verifying the site works in GPU-less environments.
 *
 * `?debug=webGLMode:active` is the explicit "force on" counterpart: it
 * overrides nothing today (probing is already the default) but documents
 * the intended mode and future-proofed overrides (e.g. persisted user
 * preference) have one place to honour it.
 *
 * The URL is re-parsed on every call — parsing is a two-microregex scan and
 * tests flip `location.search` between cases without a module reset.
 */

import { DEBUG_PARAMS, WEBGL_MODES } from '@/core/tokens/strings/debug.js'
import { WEBGL_STRINGS } from '@/core/tokens/strings/webgl.js'
import { TYPE_STRINGS } from '@/core/tokens/strings/types.js'

/** The effective WebGL mode declared by the URL — 'active' | 'fallback'. */
export type WebGLMode = typeof WEBGL_MODES.ACTIVE | typeof WEBGL_MODES.FALLBACK

/**
 * Reads `?debug=webGLMode:<mode>` from the current location. Multiple
 * `debug` params are allowed; the LAST `webGLMode:` value wins so a
 * pasted URL can override an earlier flag.
 */
export const webglMode = (): WebGLMode => {
  if (typeof window === TYPE_STRINGS.UNDEFINED) return WEBGL_MODES.ACTIVE

  const params = new URLSearchParams(window.location.search)

  let mode: WebGLMode = WEBGL_MODES.ACTIVE

  for (const raw of params.getAll(DEBUG_PARAMS.KEY)) {
    const [key, value] = raw.split(':')

    if (
      key === DEBUG_PARAMS.WEBGL_MODE &&
      (value === WEBGL_MODES.FALLBACK || value === WEBGL_MODES.ACTIVE)
    ) {
      mode = value
    }
  }

  return mode
}

/** False when `?debug=webGLMode:fallback` forces the CSS/2D path. */
export const webglAllowed = (): boolean => webglMode() !== WEBGL_MODES.FALLBACK

/**
 * `canvas.getContext('webgl')` + the 'experimental-webgl' alias in one call.
 * Returns null in fallback mode without touching the canvas at all — a
 * canvas that failed `getContext('webgl')` once can never hand it out
 * again, so probing must be skipped entirely, not faked.
 */
export const webglContext = (
  canvas: HTMLCanvasElement,
  attrs?: WebGLContextAttributes,
  alsoWebGL2 = false
): WebGLRenderingContext | WebGL2RenderingContext | null => {
  if (!webglAllowed()) return null

  const primary = alsoWebGL2 ? WEBGL_STRINGS.WEBGL2 : WEBGL_STRINGS.WEBGL
  const secondary = alsoWebGL2 ? WEBGL_STRINGS.WEBGL : WEBGL_STRINGS.EXPERIMENTAL_WEBGL

  return (
    (canvas.getContext(primary, attrs) as WebGLRenderingContext | null) ||
    (canvas.getContext(secondary, attrs) as WebGLRenderingContext | null)
  )
}
