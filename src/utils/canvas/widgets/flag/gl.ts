/**
 * @file flag-gl.ts
 * @description GL lifecycle for the shared FlagRenderer: lazy context
 * creation with context-loss tracking, flag shader program init and
 * uniform resolution, and full disposal when the pool empties.
 */

import { HTML_TAGS } from '@/core/tokens/elements/html.js'
import { GL_EVENTS } from '@/core/tokens/events/dom.js'
import { TYPE_STRINGS } from '@/core/tokens/strings/types.js'
import { WEBGL_STRINGS } from '@/core/tokens/strings/webgl.js'
import { FLAG_FS, FLAG_VS } from './shaders.js'
import { createQuadProgram, getUniforms } from '../../gl-program.js'
import type { FlagRenderer } from './renderer.js'
import { webglContext } from '../../webgl-mode.js'
import { devWarn } from '@/core/devlog.js'

/** Creates the GL context, flag shaders and textures. */
export function initFlagGL(renderer: FlagRenderer): void {
  if (typeof document === TYPE_STRINGS.UNDEFINED) return

  renderer.canvas = document.createElement(HTML_TAGS.CANVAS)

  let gl: WebGLRenderingContext | null

  try {
    gl = webglContext(renderer.canvas, {
      alpha: true,
      antialias: true,
      premultipliedAlpha: true,
    }) as WebGLRenderingContext | null
  } catch {
    gl = null
  }

  if (!gl) return

  const canvas = renderer.canvas

  // No preventDefault: a prevented loss lets the browser restore the
  // context — including the ones we force-lose in _dispose(), which
  // would resurrect zombie contexts that silently exhaust the pool.
  canvas.addEventListener(
    GL_EVENTS.WEBGL_CONTEXT_LOST,
    () => {
      // A context we released on purpose fires this asynchronously; only a
      // loss on the *current* canvas is a real failure.
      if (renderer.canvas !== canvas) return

      renderer.lost = true

      renderer.gl = null

      renderer.textures.clear()
    },
    false
  )

  if (!initFlagProgram(renderer, gl)) {
    // Program failed but the context is alive — free it so the slot isn't
    // held by a renderer that can never draw.
    gl.getExtension?.(WEBGL_STRINGS.WEBGL_LOSE_CONTEXT)?.loseContext()

    return
  }

  renderer.gl = gl
}

/** Frees GL program, textures and buffers. */
export function disposeFlagGL(renderer: FlagRenderer): void {
  const gl = renderer.gl

  if (gl) {
    renderer.textures.forEach((tex) => gl.deleteTexture(tex))

    if (renderer.quadBuffer) gl.deleteBuffer(renderer.quadBuffer)

    if (renderer.program) gl.deleteProgram(renderer.program)

    gl.getExtension?.(WEBGL_STRINGS.WEBGL_LOSE_CONTEXT)?.loseContext()
  }

  renderer.textures.clear()

  renderer.gl = null

  renderer.canvas = null

  renderer.program = null

  renderer.lost = false
}

/** Compiles the wave vertex/fragment shaders and resolves uniform locations. */
export function initFlagProgram(renderer: FlagRenderer, gl: WebGLRenderingContext): boolean {
  let built: ReturnType<typeof createQuadProgram>

  try {
    built = createQuadProgram(gl, FLAG_VS, FLAG_FS, 'FlagWebGL')
  } catch (e) {
    devWarn('FlagWebGL fallback:', e)

    return false
  }

  if (!built) return false

  renderer.program = built.program

  renderer.quadBuffer = built.quadBuffer

  const u = getUniforms(gl, built.program, {
    u_resolution: 'u_resolution',
    u_time: 'u_time',
    u_hover: 'u_hover',
    u_anim_type: 'u_anim_type',
    u_is_split: 'u_is_split',
    u_split_x: 'u_split_x',
    u_tex1: 'u_tex1',
    u_tex2: 'u_tex2',
  })

  renderer.uResolution = u.u_resolution

  renderer.uTime = u.u_time

  renderer.uHover = u.u_hover

  renderer.uAnimType = u.u_anim_type

  renderer.uIsSplit = u.u_is_split

  renderer.uSplitX = u.u_split_x

  renderer.uTex1 = u.u_tex1

  renderer.uTex2 = u.u_tex2

  renderer.aPos = gl.getAttribLocation(built.program, WEBGL_STRINGS.A_POS)

  return true
}
