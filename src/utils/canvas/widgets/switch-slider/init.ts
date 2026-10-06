/**
 * @file switch-slider-init.ts — boot + GL setup for the switch slider:
 * DPR-clamped backing store, context-loss/Canvas2D fallback chain, and
 * the program build via the shared gl-program helper.
 */

import { STATE_CLASSES } from '@/core/tokens/classes/state.js'
import { STATE_STRINGS } from '@/core/tokens/strings/state.js'
import { TYPE_STRINGS } from '@/core/tokens/strings/types.js'
import { WEBGL_STRINGS } from '@/core/tokens/strings/webgl.js'
import { createQuadProgram, getUniforms, getWebGLContext } from '../../gl-program.js'
import { releaseQuadGL, watchContextLoss } from '../../gl-lifecycle.js'
import { webglPool } from '../../webgl-pool.js'
import { SWITCH_SLIDER_FS, SWITCH_SLIDER_VS } from './shaders.js'
import { glContextOptions } from '@/utils/gpu/gpu-info.js'
import type { SwitchWebGL } from '../switch-slider.js'
import { devWarn } from '@/core/devlog.js'

/**
 * Backing store at clamp(devicePixelRatio, 2, 3) — the 2px floor keeps
 * the 1px SDF edges crisp on 1× displays; the 3× ceiling caps fill
 * cost on phones (the widget is only 54×28 CSS px anyway).
 */
function backingDpr(): number {
  return Math.min(
    Math.max((typeof window !== TYPE_STRINGS.UNDEFINED ? window.devicePixelRatio : 1) || 1, 2),
    3
  )
}

/** Switches to the non-WebGL path — releases any live GL, then hides the canvas so the CSS fallback shows. */
export function triggerFallback(host: SwitchWebGL): void {
  host.useWebGL = false

  if (host.animId) cancelAnimationFrame(host.animId)

  releaseQuadGL(host.canvas, host, host._onContextLost)

  host._onContextLost = null

  host.canvas.style.display = STATE_STRINGS.NONE

  host.canvas.classList.add(STATE_CLASSES.IS_FALLBACK)
}

/** Boot sequence: GL init → event binding → render start; fully degrades to the fallback path. */
export function init(host: SwitchWebGL): void {
  if (!host.canvas || typeof host.canvas.getContext !== TYPE_STRINGS.FUNCTION) {
    triggerFallback(host)

    return
  }

  host.dpr = backingDpr()

  host.canvas.width = Math.round(host.width * host.dpr)

  host.canvas.height = Math.round(host.height * host.dpr)

  host.canvas.style.width = `${host.width}px`

  host.canvas.style.height = `${host.height}px`

  // No preventDefault: preventing loss asks the browser to restore the
  // context, which would resurrect the one deliberately lost in purge().
  host._onContextLost = watchContextLoss(host.canvas, () => triggerFallback(host))

  initWebGL(host)

  if (!host.useWebGL) {
    try {
      host.ctx = host.canvas.getContext(WEBGL_STRINGS.CONTEXT_2D)
    } catch {
      triggerFallback(host)

      return
    }

    if (!host.ctx) {
      triggerFallback(host)

      return
    }
  }

  host.bindEvents()

  // Offscreen instances free their context entirely; restore() rebuilds.
  webglPool.register(host.canvas, host)

  host.animate()
}

/** Creates the WebGL context, compiles the shader program and sets up uniforms/buffers; falls back on any failure. */
export function initWebGL(host: SwitchWebGL): void {
  try {
    const attrs = glContextOptions({ alpha: true, antialias: true })

    const gl = getWebGLContext(host.canvas, attrs)

    if (!gl) return

    const built = createQuadProgram(gl, SWITCH_SLIDER_VS, SWITCH_SLIDER_FS, 'SwitchWebGL', {
      warn: (stage: string, info: unknown) =>
        devWarn(
          stage === WEBGL_STRINGS.LINK_STAGE
            ? 'SwitchWebGL Program link error:'
            : `SwitchWebGL ${stage} error:`,
          info
        ),
    })

    if (!built) return

    host.gl = gl

    host.program = built.program

    host.quadBuffer = built.quadBuffer

    const u = getUniforms(gl, built.program, {
      u_resolution: 'u_resolution',
      u_time: 'u_time',
      u_progress: 'u_progress',
      u_knob_x: 'u_knob_x',
      u_context: 'u_context',
    })

    host.uResolution = u.u_resolution

    host.uTime = u.u_time

    host.uProgress = u.u_progress

    host.uKnobX = u.u_knob_x

    host.uContext = u.u_context

    host.aPos = gl.getAttribLocation(built.program, WEBGL_STRINGS.A_POS)

    host.useWebGL = true
  } catch (e) {
    devWarn('SwitchWebGL fallback:', e)

    host.useWebGL = false
  }
}
