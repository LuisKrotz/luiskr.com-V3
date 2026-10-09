/**
 * @file docs/gl-strip.ts
 * @description WebGL thread-field backdrop for the docs navigation region.
 *
 * The breadcrumb bar + treeview sit on a canvas whose fragment shader
 * draws slow-drifting iso-lines of a layered sine field — the same
 * organic thread motif as the nav menu, tuned much fainter so it reads
 * as texture behind navigation chrome rather than motion. Falls back to
 * the `docs-gl-fallback` CSS class when `webglContext()` declines
 * (?debug=webGLMode:fallback, software renderer, lost context).
 */

import {
  createQuadProgram,
  getUniforms,
  bindQuad,
  getWebGLContext,
} from '@core/utils/canvas/gl-program.js'
import {
  watchContextLoss,
  releaseQuadGL,
  type QuadGLResources,
} from '@core/utils/canvas/gl-lifecycle.js'
import { parseCssColor } from '@core/utils/canvas/css-color.js'
import { DOCS_CLASSES } from '@core/tokens/classes/docs.js'
import { DOCS_UNITS } from '@core/tokens/strings/docs.js'

/** Live GL resources for the mounted strip. */
export interface DocsGlHandle {
  /** Frees program/buffer/context and stops the rAF loop. */
  destroy(): void
}

/** Vertex shader — fullscreen quad passthrough. */
const VS = `attribute vec2 a_pos;varying vec2 v_uv;void main(){v_uv=a_pos*.5+.5;gl_Position=vec4(a_pos,0.,1.);}`

/**
 * Fragment shader — threads: distance from `fract` of a warped sine field
 * gives evenly spaced iso-contours; two field octaves + slow time drift
 * keep the line pattern organic. Output alpha stays low so the strip
 * never competes with the crumb labels.
 */
const FS = `precision mediump float;varying vec2 v_uv;uniform float u_t;uniform vec2 u_res;uniform vec3 u_col;void main(){vec2 p=v_uv*vec2(u_res.x/u_res.y,1.)*3.;float f=sin(p.x*1.7+sin(p.y*2.3+u_t*.6)*1.3+u_t*.35)+sin(p.y*2.1+sin(p.x*1.9-u_t*.4)*1.1-u_t*.3);float lines=smoothstep(.04,.008,abs(fract(f*.5)-.5));gl_FragColor=vec4(u_col,lines*.11);}`

/**
 * Mounts the animated strip on `canvas`.
 * @param canvas Target canvas (already sized by CSS; backing store syncs
 *   to devicePixelRatio each resize).
 * @param host   Element receiving the `docs-gl-fallback` class on loss.
 * @returns Handle with destroy(), or null when WebGL is unavailable.
 */
export const mountDocsGlStrip = (
  canvas: HTMLCanvasElement,
  host: HTMLElement
): DocsGlHandle | null => {
  const gl = getWebGLContext(canvas, { alpha: true, premultipliedAlpha: false })

  if (!gl) return null

  const built = createQuadProgram(gl, VS, FS, 'docs-gl-strip')

  if (!built) return null

  const res: QuadGLResources = { gl, program: built.program, quadBuffer: built.quadBuffer }

  const uniforms = getUniforms(gl, built.program, { t: 'u_t', r: 'u_res', c: 'u_col' })

  const aPos = gl.getAttribLocation(built.program, 'a_pos')

  let raf = 0

  let lost = false

  const start = performance.now()

  const color = parseCssColor(getComputedStyle(canvas).color) || [0, 0, 0]

  const frame = () => {
    if (lost) return

    // `gl` is the mount-time context — narrowed non-null above; teardown
    // sets `lost` before releaseQuadGL clears res.gl, so this can't race.
    const g = gl

    const w = canvas.clientWidth * window.devicePixelRatio

    const hgt = canvas.clientHeight * window.devicePixelRatio

    if (canvas.width !== w || canvas.height !== hgt) {
      canvas.width = w

      canvas.height = hgt

      g.viewport(0, 0, w, hgt)
    }

    g.useProgram(res.program)

    bindQuad(g, res.quadBuffer as WebGLBuffer, aPos)

    g.uniform1f(uniforms.t, ((performance.now() - start) / 1000) * DOCS_UNITS.GL_STRIP_TIME_SCALE)

    g.uniform2f(uniforms.r, w, hgt)

    g.uniform3f(uniforms.c, color[0], color[1], color[2])

    g.drawArrays(g.TRIANGLES, 0, 6)

    raf = requestAnimationFrame(frame)
  }

  const onLost = watchContextLoss(canvas, () => {
    lost = true

    // No rAF cancel here — the pending frame sees `lost` and stops
    // scheduling; the loop unwinds on its own.
    host.classList.add(DOCS_CLASSES.DOCS_GL_FALLBACK)
  })

  raf = requestAnimationFrame(frame)

  return {
    destroy() {
      lost = true

      cancelAnimationFrame(raf)

      releaseQuadGL(canvas, res, onLost)
    },
  }
}
