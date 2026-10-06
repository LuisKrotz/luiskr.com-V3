/**
 * @file theme-slider-render.ts — render loop for the theme slider:
 * the RAF spring animation (14%/frame geometric decay), the static
 * single-frame path used under reduced motion, and the per-frame
 * WebGL/Canvas2D draw.
 */

import { bindQuad } from '../../gl-program.js'
import { paintThemeSlider2D } from './paint-2d.js'
import store from '@/core/store.js'
import type { ThemeSliderWebGL } from '../theme-slider.js'

/** Spring constant — each frame closes 14% of the remaining distance. */
const SPRING = 0.14

/**
 * Snap state to target and draw a single settled frame — used under
 * reduced motion or when the loop is stopped, so theme changes still
 * visibly apply without animating.
 */
export function renderStatic(host: ThemeSliderWebGL): void {
  host.currentP = host.targetP

  host.knobX = host._pToKnobX(host.currentP)

  const now = performance.now()

  if (host.useWebGL && host.gl) {
    renderWebGL(host, now)
  } else if (host.ctx) {
    renderCanvas2D(host)
  }
}

/** Starts the requestAnimationFrame render loop (skipped under reduced motion). */
export function animate(host: ThemeSliderWebGL): void {
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

  // Frame-rate-independent-looking spring: each frame closes 14% of the
  // remaining distance — an exponential ease-out (geometric decay ≈
  // time-constant 7 frames, ~95% settled in ~20 frames / 330ms at 60fps).
  const diff = host.targetP - host.currentP

  host.currentP += diff * SPRING

  host.knobX = host._pToKnobX(host.currentP)

  if (host.useWebGL && host.gl) {
    renderWebGL(host, now)
  } else if (host.ctx) {
    renderCanvas2D(host)
  }
}

/** Per-frame WebGL render: updates time/knob uniforms and draws the quad. */
export function renderWebGL(host: ThemeSliderWebGL, now: number): void {
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

  gl.uniform1f(host.uRippleTime, host.rippleTime)

  gl.uniform1f(host.uRipplePos, host.ripplePos)

  gl.drawArrays(gl.TRIANGLES, 0, 6)
}

/**
 * Canvas2D fallback renderer — mirrors the shader's composition.
 * NOTE: `host.ctx` is never assigned in this class — _triggerFallback()
 * instead hides the canvas and activates the CSS/DOM fallback on the
 * wrapper. This path is dormant defensive code kept so a future caller
 * can supply a 2d context and still get a sensible scene.
 */
export function renderCanvas2D(host: ThemeSliderWebGL): void {
  paintThemeSlider2D(host.ctx, {
    width: host.width,
    height: host.height,
    currentP: host.currentP,
    knobX: host.knobX,
    startTime: host.startTime,
  })
}
