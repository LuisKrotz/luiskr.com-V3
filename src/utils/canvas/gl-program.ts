/**
 * @file gl-program.ts
 * @description Shared WebGL boilerplate for the canvas widgets — every
 * widget (flag, skeleton, sliders, buttons, menu background) runs the
 * same sequence: compile vertex+fragment shaders → link program →
 * upload a fullscreen quad buffer → enable premultiplied-alpha blend.
 * Failures warn with the caller's label and return null so each widget
 * can fall back to its CSS/Canvas2D path.
 */
import { WEBGL_STRINGS } from '@/core/tokens/strings/webgl.js'
import { webglContext } from './webgl-mode.js'
import { devWarn } from '@/core/devlog.js'

/**
 * Probes the canvas for a WebGL context — prefers `webgl`, falls back to
 * `experimental-webgl`. Returns null when the browser has no GL support or
 * when `?debug=webGLMode:fallback` forces the CSS/2D surface (callers then
 * take their fallback path).
 */
export const getWebGLContext = (
  canvas: HTMLCanvasElement,
  attrs?: WebGLContextAttributes
): WebGLRenderingContext | null => webglContext(canvas, attrs) as WebGLRenderingContext | null

/** Compiles one shader; warns with `label` + stage on failure. */
const compileShader = (
  gl: WebGLRenderingContext | WebGL2RenderingContext,
  type: number,
  source: string,
  stage: string,
  warn: (_stage: string, _info: unknown) => void
): WebGLShader | null => {
  const shader = gl.createShader(type)

  if (!shader) return null

  gl.shaderSource(shader, source)

  gl.compileShader(shader)

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    warn(stage, gl.getShaderInfoLog(shader))

    return null
  }

  return shader
}

/**
 * Compiles + links a vertex/fragment pair and uploads the shared
 * fullscreen-quad buffer ([-1,-1 … 1,1] triangle pair). Returns null on
 * any stage failure — the caller treats it as "no WebGL" and falls back.
 */
export interface QuadProgramOptions {
  /** Quad vertex layout — defaults to the 6-vertex TRIANGLES quad;
   *  TRIANGLE_STRIP callers pass their 4-vertex ordering instead. */
  verts?: Float32Array
  /** Custom warn sink — stage is 'VS' | 'FS' | 'Link' | 'fallback'. */
  warn?: (_stage: string, _info: unknown) => void
  /** Blend factors — default premultiplied (ONE, ONE_MINUS_SRC_ALPHA);
   *  false gives straight-alpha (SRC_ALPHA, ONE_MINUS_SRC_ALPHA). */
  premultiplied?: boolean
}

/**
 * Creates quad program.
 */
export const createQuadProgram = (
  gl: WebGLRenderingContext | WebGL2RenderingContext,
  vsSource: string,
  fsSource: string,
  label: string,
  opts: QuadProgramOptions = {}
): { program: WebGLProgram; quadBuffer: WebGLBuffer } | null => {
  const warn =
    opts.warn ?? ((stage: string, info: unknown) => devWarn(`${label} ${stage} error:`, info))

  // Throws propagate to the caller's own catch (its 'X fallback:' warn),
  // matching the pre-extraction single-warn behavior.
  {
    const vs = compileShader(gl, gl.VERTEX_SHADER, vsSource, WEBGL_STRINGS.VERTEX_STAGE, warn)

    if (!vs) return null

    const fs = compileShader(gl, gl.FRAGMENT_SHADER, fsSource, WEBGL_STRINGS.FRAGMENT_STAGE, warn)

    if (!fs) return null

    const program = gl.createProgram()

    if (!program) return null

    gl.attachShader(program, vs)

    gl.attachShader(program, fs)

    gl.linkProgram(program)

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      warn(WEBGL_STRINGS.LINK_STAGE, gl.getProgramInfoLog(program))

      return null
    }

    const quadBuffer = gl.createBuffer()

    if (!quadBuffer) return null

    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer)

    gl.bufferData(
      gl.ARRAY_BUFFER,
      opts.verts ?? new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    )

    gl.enable(gl.BLEND)

    gl.blendFunc(opts.premultiplied === false ? gl.SRC_ALPHA : gl.ONE, gl.ONE_MINUS_SRC_ALPHA)

    return { program, quadBuffer }
  }
}

/** Resolves a uniform-location map — keys are the caller's shorthand,
 *  values are the shader's `u_*` names (identical keys work too). */
export const getUniforms = (
  gl: WebGLRenderingContext | WebGL2RenderingContext,
  program: WebGLProgram,
  names: Record<string, string>
): Record<string, WebGLUniformLocation | null> => {
  const out: Record<string, WebGLUniformLocation | null> = {}

  for (const [key, name] of Object.entries(names)) out[key] = gl.getUniformLocation(program, name)

  return out
}

/** Binds the quad buffer to `a_pos` — the common pre-uniforms draw step. */
export const bindQuad = (
  gl: WebGLRenderingContext | WebGL2RenderingContext,
  quadBuffer: WebGLBuffer,
  aPos: number
): void => {
  gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer)

  gl.enableVertexAttribArray(aPos)

  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)
}
