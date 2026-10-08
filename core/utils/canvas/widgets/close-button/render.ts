/**
 * @file close-button-render.ts — render loop for the close button:
 * three eased channels (liquid fill 1.6%/frame, X-spin 4%/frame to a
 * half-turn, one-time stroke draw-in 2%/frame) plus the static
 * single-frame path used under reduced motion.
 */

import store from '@core/store.js'
import { bindQuad } from '../../gl-program.js'
import type { CloseButtonWebGL } from '../close-button.js'

/** Liquid fill rate — deliberately slowest so the wash pours. */
const LIQUID_RATE = 0.016

/** X-spin rate — faster so the half-turn lands near the end of the pour. */
const ROT_RATE = 0.04

/** One-time stroke draw-in rate (~50 frames ≈ 830ms on mount). */
const DRAW_RATE = 0.02

/**
 * Draws one settled frame with the X fully drawn — used under reduced
 * motion or when the loop is stopped so the button stays visible and
 * hover-state still applies (without animating).
 */
export function renderStatic(host: CloseButtonWebGL): void {
  host.drawProgress = 1.0

  host.hoverLevel = host.isHovered ? 1.0 : 0.0

  host.rotation = host.hoverLevel * Math.PI

  const now = performance.now()

  if (host.useWebGL && host.gl) {
    renderWebGL(host, now)
  }
}

/** Starts the requestAnimationFrame render loop (skipped under reduced motion). */
export function animate(host: CloseButtonWebGL): void {
  if (!host.useWebGL) return

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

  // Liquid fill: 1.6%/frame — deliberately the slowest channel so the
  // turquoise wash feels like it's pouring rather than toggling
  // (~1s to fill on hover-in, same on drain).
  const targetHover = host.isHovered ? 1.0 : 0.0

  host.hoverLevel += (targetHover - host.hoverLevel) * LIQUID_RATE

  // X spin follows the fill at a faster 4%/frame so the rotation
  // *finishes* near the end of the pour rather than tracking it 1:1 —
  // target is a half-turn (π) at full hover.
  const targetRot = host.hoverLevel * Math.PI

  host.rotation += (targetRot - host.rotation) * ROT_RATE

  // One-time stroke draw-in: +2%/frame → the X draws itself over the
  // first ~50 frames (~830ms) after mount, then stays at 1.
  if (host.drawProgress < 1.0) {
    host.drawProgress = Math.min(1.0, host.drawProgress + DRAW_RATE)
  }

  if (host.useWebGL && host.gl) {
    renderWebGL(host, now)
  }
}

/** Per-frame WebGL render: updates time/hover uniforms and draws the quad. */
export function renderWebGL(host: CloseButtonWebGL, now: number): void {
  const gl = host.gl

  if (!gl || !host.program || !host.quadBuffer) return

  gl.viewport(0, 0, host.canvas.width, host.canvas.height)

  gl.clearColor(0.0, 0.0, 0.0, 0.0)

  gl.clear(gl.COLOR_BUFFER_BIT)

  gl.useProgram(host.program)

  bindQuad(gl, host.quadBuffer, host.aPos)

  gl.uniform2f(host.uResolution, host.canvas.width, host.canvas.height)

  gl.uniform1f(host.uTime, (now - host.startTime) * 0.001)

  gl.uniform1f(host.uLiquid, host.hoverLevel)

  gl.uniform1f(host.uDraw, host.drawProgress)

  gl.uniform1f(host.uRot, host.rotation)

  gl.uniform1f(host.uClickTime, host.clickTime)

  gl.drawArrays(gl.TRIANGLES, 0, 6)
}
