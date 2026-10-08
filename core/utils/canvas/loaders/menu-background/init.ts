/**
 * @file menu-background-init.ts — GL bootstrap + fallback for the menu
 * background: context creation (rejected on software rasterizers — a
 * CPU-drawn fullscreen shader is the crashy path), the
 * OES_standard_derivatives probe (fwidth() powers the analytic isoline
 * AA), program build via the shared gl-program helper, and the CSS moiré
 * fallback trigger which always releases any partial GL state.
 */

import { STATE_CLASSES } from '@core/tokens/classes/state.js'
import { NAV_MENU_CLASSES } from '@core/tokens/classes/nav.js'
import { STATE_STRINGS } from '@core/tokens/strings/state.js'
import { CHAR_STRINGS } from '@core/tokens/strings/chars.js'
import { WEBGL_STRINGS } from '@core/tokens/strings/webgl.js'
import { bindQuad, createQuadProgram, getUniforms } from '../../gl-program.js'
import { watchContextLoss } from '../../gl-lifecycle.js'
import { MENU_BG_VS, menuBgFsSource } from './shaders.js'
import { QUAD_STRIP } from '@core/tokens/motion/gpu.js'
import { glContextOptions } from '@core/utils/gpu/gpu-info.js'
import type { MenuBackgroundWebGL } from '../menu-background-webgl.js'
import { webglContext } from '../../webgl-mode.js'

/** Creates the WebGL context + shader program; falls back to the CSS/DOM path on failure. */
export function initGL(host: MenuBackgroundWebGL): void {
  try {
    if (!host.canvas) {
      host._triggerFallback()

      return
    }

    // Re-init after a purge: clear the fallback marks a previous failure
    // left behind so the canvas participates again.
    host.canvas.style.display = CHAR_STRINGS.EMPTY

    host.canvas.classList.remove(STATE_CLASSES.IS_FALLBACK)

    host.canvas
      .closest(`.${NAV_MENU_CLASSES.NAV_MENU_MODAL}`)
      ?.classList.remove(NAV_MENU_CLASSES.NAV_MENU_MODAL_GL_FALLBACK)

    const gl = webglContext(
      host.canvas,
      glContextOptions({ alpha: true, antialias: false, preserveDrawingBuffer: false })
    ) as WebGLRenderingContext | null

    if (!gl) {
      host._triggerFallback()

      return
    }

    host.gl = gl

    // fwidth() needs this extension in WebGL1 — it's the basis of the
    // analytic isoline AA below. Missing → the shader takes the fixed
    // smoothstep band (supersampling still softens it).
    host._hasDeriv = !!gl.getExtension(WEBGL_STRINGS.OES_STANDARD_DERIVATIVES)

    const built = createQuadProgram(gl, MENU_BG_VS, menuBgFsSource(host._hasDeriv), 'MenuBg', {
      verts: new Float32Array(QUAD_STRIP.VERTS),
      premultiplied: false,
      warn: () => host._triggerFallback(),
    })

    // The context may exist even when the program failed — the fallback
    // path releases it so a hidden canvas never keeps a live context slot.
    if (!built) {
      host._triggerFallback()

      return
    }

    host.program = built.program

    host.quadBuffer = built.quadBuffer

    gl.useProgram(host.program)

    host.useWebGL = true

    const aPos = gl.getAttribLocation(host.program, WEBGL_STRINGS.A_POS)

    bindQuad(gl, host.quadBuffer, aPos)

    const u = getUniforms(gl, host.program, {
      u_time: 'u_time',
      u_res: 'u_res',
      u_color: 'u_color',
      u_color2: 'u_color2',
      u_reveal: 'u_reveal',
      u_alpha: 'u_alpha',
    })

    host.uTime = u.u_time

    host.uResolution = u.u_res

    host.uColor = u.u_color

    host.uColor2 = u.u_color2

    host.uReveal = u.u_reveal

    host.uAlpha = u.u_alpha

    // Stored so releaseQuadGL can detach it before an intentional
    // loseContext() — otherwise the async loss event re-fires the
    // fallback and preventDefault would resurrect a zombie context.
    host._onContextLost = watchContextLoss(host.canvas, () => host._triggerFallback())
  } catch {
    host._triggerFallback()
  }
}

/** Switches to the non-WebGL path (CSS moiré layer) — used on context loss or init failure. */
export function triggerFallback(host: MenuBackgroundWebGL): void {
  host.useWebGL = false

  if (host.animId) {
    cancelAnimationFrame(host.animId)

    host.animId = null
  }

  // Whatever GL state exists is released — a failed or lost context must
  // never keep a slot alive on the hidden canvas.
  host._releaseGL()

  if (host.canvas) {
    host.canvas.style.display = STATE_STRINGS.NONE

    host.canvas.classList.add(STATE_CLASSES.IS_FALLBACK)

    // Class-driven gate on the modal as well — :has() alone would leave
    // browsers without it (older FF/Safari/Samsung) with no membrane at all.
    host.canvas
      .closest(`.${NAV_MENU_CLASSES.NAV_MENU_MODAL}`)
      ?.classList.add(NAV_MENU_CLASSES.NAV_MENU_MODAL_GL_FALLBACK)
  }
}
