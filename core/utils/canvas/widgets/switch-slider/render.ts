/**
 * @file switch-slider-render.ts — render loop for the switch slider:
 * the 18%/frame spring ease, the static single-frame path used under
 * reduced motion, and the per-frame WebGL/Canvas2D draws.
 */

import store from '@core/store.js'
import { bindQuad } from '../../gl-program.js'
import { paintSwitchSlider2D } from './paint-2d.js'
import type { SwitchWebGL } from '../switch-slider.js'

/** Spring constant — snappier than the theme slider's 0.14 (26px travel). */
const SPRING = 0.18

/**
 * Snap state to target and draw a single settled frame — used under
 * reduced motion or when the loop is stopped, so toggles still visibly
 * update without animating.
 */
export function renderStatic(host: SwitchWebGL): void {
  host.currentP = host.targetP

  host.knobX = host._pToKnobX(host.currentP)

  const now = performance.now()

  if (host.useWebGL && host.gl) {
    renderWebGL(host, now)
  } else if (host.ctx) {
    renderCanvas2D(host, now)
  }
}

/** Starts the requestAnimationFrame render loop (skipped under reduced motion). */
export function animate(host: SwitchWebGL): void {
  if (store.getters.getReducedMotion()) {
    if (host.animId) {
      cancelAnimationFrame(host.animId)

      host.animId = null
    }

    renderStatic(host)

    return
  }

  host.animId = requestAnimationFrame(() => host.animate())

  const now = performance.now()

  // Exponential ease-out spring: closes 18% of the remaining distance
  // per frame (τ ≈ 5 frames — snappier than the theme slider's 0.14,
  // matching the smaller 26px travel distance).
  const diff = host.targetP - host.currentP

  host.currentP += diff * SPRING

  host.knobX = host._pToKnobX(host.currentP)

  if (host.useWebGL && host.gl) {
    renderWebGL(host, now)
  } else if (host.ctx) {
    renderCanvas2D(host, now)
  }
}

/** Per-frame WebGL render: updates time/knob uniforms and draws the quad. */
export function renderWebGL(host: SwitchWebGL, now: number): void {
  const gl = host.gl

  if (!gl || !host.program || !host.quadBuffer) return

  gl.viewport(0, 0, host.canvas.width, host.canvas.height)

  gl.clearColor(0.0, 0.0, 0.0, 0.0)

  gl.clear(gl.COLOR_BUFFER_BIT)

  gl.useProgram(host.program)

  bindQuad(gl, host.quadBuffer, host.aPos)

  gl.uniform2f(host.uResolution, host.width, host.height)

  gl.uniform1f(host.uTime, (now - host.startTime) * 0.001)

  gl.uniform1f(host.uProgress, host.currentP)

  gl.uniform1f(host.uKnobX, host.knobX)

  gl.uniform1f(host.uContext, host._contextCode())

  gl.drawArrays(gl.TRIANGLES, 0, 6)
}

/** Per-frame Canvas2D fallback render — same visual language as the shader. */
export function renderCanvas2D(host: SwitchWebGL, now: number): void {
  paintSwitchSlider2D(
    host.ctx,
    {
      dpr: host.dpr,
      width: host.width,
      height: host.height,
      currentP: host.currentP,
      startTime: host.startTime,
      knobX: host.knobX,
      contextType: host.contextType,
      canvasWidth: host.canvas?.width ?? 0,
      canvasHeight: host.canvas?.height ?? 0,
    },
    now
  )
}
