/**
 * @file flag-renderer.ts
 * @description Shared WebGL renderer for FlagWebGL. One GL context serves
 * every flag on the page — each widget owns only a 2D canvas; frames
 * render on the shared GL canvas and are blitted over. Textures decode
 * once per country code and are shared; the context is released when the
 * last flag destroys. Implementation lives in flag-gl.ts (context
 * lifecycle), flag-texture.ts (image/texture caches) and flag-draw.ts
 * (per-frame draw) — this facade keeps the pool/refcount surface.
 */
import { disposeFlagGL, initFlagGL, initFlagProgram } from './gl.js'
import { flagImage, flagTexture } from './texture.js'
import { drawFlag } from './draw.js'
import type { FlagWebGL } from '../flag-webgl.js'

/**
 * One WebGL context for every flag on the page. Each FlagWebGL owns only a
 * 2D canvas; frames are rendered on the shared GL canvas and blitted over.
 * Textures are decoded once per country code and shared by all instances.
 * The context and every texture are released when the last flag is
 * destroyed and recreated on demand when a flag is mounted again.
 */
export class FlagRenderer {
  gl: WebGLRenderingContext | null = null
  canvas: HTMLCanvasElement | null = null
  program: WebGLProgram | null = null
  quadBuffer: WebGLBuffer | null = null
  textures = new Map<string, WebGLTexture>()
  images = new Map<string, HTMLImageElement>()
  refs = 0
  lost = false
  aPos = 0
  uResolution: WebGLUniformLocation | null = null
  uTime: WebGLUniformLocation | null = null
  uHover: WebGLUniformLocation | null = null
  uAnimType: WebGLUniformLocation | null = null
  uIsSplit: WebGLUniformLocation | null = null
  uSplitX: WebGLUniformLocation | null = null
  uTex1: WebGLUniformLocation | null = null
  uTex2: WebGLUniformLocation | null = null

  /** Borrows (and lazily creates) the shared GL context. */

  acquire(): FlagRenderer | null {
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

  /** Returns the shared context to the pool, disposing when refcount hits zero. */

  release() {
    this.refs = Math.max(0, this.refs - 1)

    if (this.refs === 0) this._dispose()
  }

  /** Creates the GL context, flag shaders and textures. */

  _init(): void {
    initFlagGL(this)
  }

  /** Frees GL program, textures and buffers. */

  _dispose(): void {
    disposeFlagGL(this)
  }

  /**
   * Builds (once) and caches the flag's composited <img> for country code
   * cc — composite means the base flag plus any overlays (e.g. the EU
   * circle for split-locale flags) baked into one source image.
   * @param {string} cc
   * @returns {HTMLImageElement}
   */
  image(cc: string): HTMLImageElement {
    return flagImage(this, cc)
  }

  /** Builds/caches the GL texture for the flag image. */

  texture(cc: string): WebGLTexture | null {
    return flagTexture(this, cc)
  }

  /**
   * Renders one wave-shader frame for a flag (or its split pair for dual
   * flags like en-GB/en-US hybrids) onto the shared canvas, then blits
   * the result to the flag's own 2D canvas at time t.
   */
  draw(flag: FlagWebGL, time: number): boolean {
    return drawFlag(this, flag, time)
  }

  /** Compiles the wave vertex/fragment shaders and resolves uniform locations. */

  _initProgram(gl: WebGLRenderingContext): boolean {
    return initFlagProgram(this, gl)
  }
}

/**
 * flags renderer.
 */
export const flagRenderer = new FlagRenderer()
