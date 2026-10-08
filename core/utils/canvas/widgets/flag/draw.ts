/**
 * @file flag-draw.ts
 * @description Per-frame draw for the shared FlagRenderer: binds the wave
 * shader, uploads per-flag uniforms (time, hover, anim mode, split point),
 * draws to the shared GL canvas and blits into the flag's own 2D canvas.
 */

import { bindQuad } from '../../gl-program.js'
import type { FlagRenderer } from './renderer.js'
import type { FlagWebGL } from '../flag-webgl.js'

/**
 * Renders one wave-shader frame for a flag (or its split pair for dual
 * flags like en-GB/en-US hybrids) onto the shared canvas, then blits
 * the result to the flag's own 2D canvas at time t.
 */
export function drawFlag(renderer: FlagRenderer, flag: FlagWebGL, time: number): boolean {
  const gl = renderer.gl

  const sharedCanvas = renderer.canvas

  const tex1 = renderer.texture(flag.lang.cc)

  const tex2 = flag.lang.cc2 ? renderer.texture(flag.lang.cc2) : null

  if (
    !gl ||
    !sharedCanvas ||
    !renderer.program ||
    !renderer.quadBuffer ||
    !tex1 ||
    (flag.lang.cc2 && !tex2)
  )
    return false

  const w = flag.canvas.width

  const h = flag.canvas.height

  if (sharedCanvas.width !== w || sharedCanvas.height !== h) {
    sharedCanvas.width = w

    sharedCanvas.height = h
  }

  gl.viewport(0, 0, w, h)

  gl.clearColor(0, 0, 0, 0)

  gl.clear(gl.COLOR_BUFFER_BIT)

  gl.useProgram(renderer.program)

  bindQuad(gl, renderer.quadBuffer, renderer.aPos)

  gl.uniform2f(renderer.uResolution, w, h)

  gl.uniform1f(renderer.uTime, time)

  gl.uniform1f(renderer.uHover, flag.hoverLevel)

  gl.uniform1f(renderer.uAnimType, flag._getAnimType())

  gl.uniform1f(renderer.uIsSplit, flag.lang.cc2 ? 1.0 : 0.0)

  gl.uniform1f(renderer.uSplitX, flag._splitPoint())

  gl.activeTexture(gl.TEXTURE0)

  gl.bindTexture(gl.TEXTURE_2D, tex1)

  gl.uniform1i(renderer.uTex1, 0)

  gl.activeTexture(gl.TEXTURE1)

  gl.bindTexture(gl.TEXTURE_2D, tex2 || tex1)

  gl.uniform1i(renderer.uTex2, 1)

  gl.drawArrays(gl.TRIANGLES, 0, 6)

  const ctx = flag.ctx

  if (!ctx) return false

  ctx.clearRect(0, 0, w, h)

  ctx.drawImage(sharedCanvas, 0, 0)

  return true
}
