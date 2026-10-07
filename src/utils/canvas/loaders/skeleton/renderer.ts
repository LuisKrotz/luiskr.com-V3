/**
 * @file skeleton-renderer.ts
 * @description Shared WebGL shimmer renderer for skeleton layers,
 * extracted from skeleton-webgl.ts. One GL context serves every layer;
 * frames are drawn on a shared canvas (grown to the largest live layer)
 * and blitted into each layer's 2D canvas. Released when the last layer
 * is destroyed; recreated on demand.
 */
import { HTML_TAGS } from '@/core/tokens/elements/html.js'
import { GL_EVENTS } from '@/core/tokens/events/dom.js'
import { CHAR_STRINGS } from '@/core/tokens/strings/chars.js'
import { bindQuad, createQuadProgram, getUniforms } from '../../gl-program.js'
import { SKELETON_FS, SKELETON_VS } from './shaders.js'
import { WEBGL_STRINGS } from '@/core/tokens/strings/webgl.js'
import type { SkeletonWebGL } from '../skeleton-webgl.js'
import { webglContext } from '../../webgl-mode.js'
import { QUAD_STRIP } from '@/core/tokens/motion/gpu.js'
import { SKELETON_WARN } from '@/core/tokens/motion/skeleton.js'
import { devWarn } from '@/core/devlog.js'

/**
 * Single shared WebGL context for every skeleton layer on the page. Layers
 * own a cheap 2D canvas; each frame is drawn on the shared GL canvas (grown
 * to the largest live layer, never reallocated per frame) and blitted over.
 * Released when the last layer is destroyed, recreated on demand.
 */
export class SkeletonRenderer {
  /** The shared GL context — null before init, after loss, or after dispose. */
  gl: WebGLRenderingContext | null = null
  /** The offscreen GL canvas frames are drawn on (grown to the largest layer). */
  canvas: HTMLCanvasElement | null = null
  /** Compiled shimmer program (SKELETON_VS/SKELETON_FS). */
  program: WebGLProgram | null = null
  /** Quad vertex buffer bound for every draw. */
  quadBuffer: WebGLBuffer | null = null
  /** Resolved uniform locations keyed by logical name. */
  u: Record<string, WebGLUniformLocation | null> = {}
  /** Live borrowers — the context is disposed when this reaches zero. */
  refs = 0
  /** Sticky "context is gone" flag — acquire() stops retrying after loss. */
  lost = false

  /**
   * Borrows (and lazily creates) the shared GL context. Refcount +1 on
   * success; a failed init hands the ref back so the count still reaches
   * zero and disposal stays reachable. Returns null when GL is
   * unavailable/lost — the layer keeps its CSS fallback.
   */
  acquire(): SkeletonRenderer | null {
    this.refs += 1

    if (!this.gl && !this.lost) this._init()

    // A failed init never hands out a context — give the ref back so the
    // pool can still reach zero and dispose cleanly later.
    if (!this.gl) {
      this.refs -= 1

      return null
    }

    return this
  }

  /**
   * Returns the shared context to the pool, disposing at refcount zero —
   * the last layer dropping out frees the GL context entirely (browsers
   * cap ~16 live contexts).
   */
  release() {
    this.refs = Math.max(0, this.refs - 1)

    if (this.refs === 0) this._dispose()
  }

  /**
   * Creates the shared canvas + GL context, wires context-loss handling,
   * and compiles the shimmer program. Aborts (leaving `gl` null) when the
   * context can't be created, is software-rendered, or the shaders fail —
   * each failure self-releases the context so nothing leaks.
   */
  _init() {
    this.canvas = document.createElement(HTML_TAGS.CANVAS)

    let gl: WebGLRenderingContext | null

    try {
      // No preserveDrawingBuffer: the 2D blit runs synchronously in the same
      // task as the draw calls, so the back buffer is still valid when read.
      gl = webglContext(this.canvas, {
        alpha: true,
        antialias: false,
        premultipliedAlpha: true,
      }) as WebGLRenderingContext | null
    } catch {
      gl = null
    }

    if (!gl) return

    // Software rasterizers (headless audits, GPU-less machines) pay for every
    // frame on the main thread: keep the CSS shimmer there instead.
    if (this._isSoftwareRenderer(gl)) {
      gl.getExtension?.(WEBGL_STRINGS.WEBGL_LOSE_CONTEXT)?.loseContext()

      this.lost = true

      return
    }

    const canvas = this.canvas

    // No preventDefault: a prevented loss lets the browser restore the
    // context — including the ones we force-lose in _dispose(), which
    // would resurrect zombie contexts that silently exhaust the pool.
    canvas.addEventListener(GL_EVENTS.WEBGL_CONTEXT_LOST, () => {
      // A context we released on purpose fires this asynchronously; only a
      // loss on the *current* canvas is a real failure.
      if (this.canvas !== canvas) return

      this.lost = true

      this.gl = null
    })

    if (!this._initProgram(gl)) {
      gl.getExtension?.(WEBGL_STRINGS.WEBGL_LOSE_CONTEXT)?.loseContext()

      return
    }

    this.gl = gl
  }

  /**
   * Detects CPU rasterizers (SwiftShader/llvmpipe) via the unmasked
   * renderer string — software GL pays per-frame CPU cost, so those take
   * the CSS fallback instead.
   * @param gl The just-acquired context.
   * @returns true when the renderer matches SKELETON_WARN.SOFTWARE_RENDERERS.
   */
  _isSoftwareRenderer(gl: WebGLRenderingContext): boolean {
    try {
      const info = gl.getExtension(WEBGL_STRINGS.WEBGL_DEBUG_RENDERER_INFO)

      const renderer = info
        ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL))
        : CHAR_STRINGS.EMPTY

      return SKELETON_WARN.SOFTWARE_RENDERERS.test(renderer)
    } catch {
      return false
    }
  }

  /**
   * Frees the GL program + quad buffer and force-loses the context so the
   * browser's context budget is returned immediately (deleteProgram alone
   * leaves the context alive). Resets `lost` so a later acquire can retry
   * on a fresh canvas.
   */
  _dispose() {
    const gl = this.gl

    if (gl) {
      if (this.quadBuffer) gl.deleteBuffer(this.quadBuffer)

      if (this.program) gl.deleteProgram(this.program)

      gl.getExtension?.(WEBGL_STRINGS.WEBGL_LOSE_CONTEXT)?.loseContext()
    }

    this.gl = null

    this.canvas = null

    this.program = null

    this.lost = false
  }

  /**
   * Renders one shimmer frame for a skeleton layer on the shared offscreen
   * canvas at time t, then blits the result onto the layer's own canvas —
   * `resolve` ∈ [0,1] cross-fades the shimmer into the "decoded" look.
   * The shared canvas only ever grows (never shrinks), so per-frame draws
   * don't thrash GPU allocations; the scissor box limits the draw to the
   * layer's w×h corner (GL origin is bottom-left — hence the
   * canvas.height−h blit offset).
   * @param layer The skeleton layer requesting the frame.
   * @param t Animation clock in seconds — feeds u_time.
   * @param resolve Content-arrival cross-fade 0→1.
   * @returns false when GL/layer canvas is missing (caller skips the frame).
   */
  draw(layer: SkeletonWebGL, t: number, resolve: number): boolean {
    const gl = this.gl
    const canvas = this.canvas
    const ctx = layer.ctx
    const layerCanvas = layer.canvas

    if (!gl || !canvas || !ctx || !layerCanvas) return false

    const w = layerCanvas.width

    const h = layerCanvas.height

    if (canvas.width < w || canvas.height < h) {
      canvas.width = Math.max(canvas.width, w)

      canvas.height = Math.max(canvas.height, h)
    }

    gl.viewport(0, 0, w, h)

    gl.enable(gl.SCISSOR_TEST)

    gl.scissor(0, 0, w, h)

    gl.clearColor(0, 0, 0, 0)

    gl.clear(gl.COLOR_BUFFER_BIT)

    gl.useProgram(this.program)

    gl.uniform2f(this.u.res, w, h)

    gl.uniform1f(this.u.time, t)

    gl.uniform1f(this.u.resolve, resolve)

    gl.uniform4fv(this.u.sbase, layer.skelBaseData)

    gl.uniform4fv(this.u.sink, layer.skelInkData)

    gl.uniform1f(this.u.inkAlpha, layer.inkAlpha)

    gl.uniform4fv(this.u.rects, layer.rectData)

    gl.uniform4fv(this.u.meta, layer.metaData)

    gl.uniform1i(this.u.count, layer.rects.length)

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, QUAD_STRIP.VERTEX_COUNT)

    gl.disable(gl.SCISSOR_TEST)

    ctx.clearRect(0, 0, w, h)

    // GL origin is bottom-left: the viewport occupies the bottom rows of the shared canvas
    ctx.drawImage(canvas, 0, canvas.height - h, w, h, 0, 0, w, h)

    return true
  }

  /**
   * Compiles the shimmer shaders and resolves every uniform location up
   * front — getUniformLocation during draw would cost a driver round-trip
   * per frame. A compile/link failure returns false so _init can release
   * the context instead of leaving a broken half-pipeline.
   * @param gl The live shared context.
   * @returns true when the program is bound and uniforms resolved.
   */
  _initProgram(gl: WebGLRenderingContext): boolean {
    const built = createQuadProgram(gl, SKELETON_VS, SKELETON_FS, 'SkeletonWebGL', {
      verts: new Float32Array(QUAD_STRIP.VERTS),
      warn: (_stage: string, info: unknown) => devWarn(SKELETON_WARN.SHADER_WARN, info),
    })

    if (!built) return false

    gl.useProgram(built.program)

    const aPos = gl.getAttribLocation(built.program, WEBGL_STRINGS.A_POS)

    bindQuad(gl, built.quadBuffer, aPos)

    this.program = built.program

    this.quadBuffer = built.quadBuffer

    this.u = getUniforms(gl, built.program, {
      res: 'u_res',
      time: 'u_time',
      resolve: 'u_resolve',
      inkAlpha: 'u_ink_alpha',
      rects: 'u_rects',
      meta: 'u_meta',
      sbase: 'u_sbase',
      sink: 'u_sink',
      count: 'u_count',
    })

    return true
  }
}

/**
 * Shared renderer singleton — every skeleton layer borrows this one
 * context via acquire()/release() so the page never holds more than one
 * shimmer pipeline regardless of how many skeletons mount.
 */
export const skeletonRenderer = new SkeletonRenderer()
