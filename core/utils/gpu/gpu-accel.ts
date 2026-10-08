/**
 * @file gpu-accel.ts
 * @description Hardware GPU acceleration singleton: a lazily-created
 * offscreen WebGL2 texture pipeline for media uploads (video frames,
 * Image elements, ImageBitmaps) plus compositor-layer promotion helpers.
 * The context is created on first use — never at module init — and is
 * skipped entirely on mobile where shader compile blocks the main thread.
 * On Safari every public method is neutered by safari-patch.js.
 */

// Hardware GPU & NPU Acceleration Engine (WebGL2 Hardware GPU Texture Context & WebNN Hints)
import { ATTR_VALUES } from '@core/tokens/attrs/values.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'
import { WEBGL_STRINGS } from '@core/tokens/strings/webgl.js'
import { glContextOptions } from './gpu-info.js'
import { GPU_ACCEL_FS, GPU_ACCEL_VS } from './gpu-accel-shaders.js'
import { bindQuad, createQuadProgram } from '@core/utils/canvas/gl-program.js'
import { webglContext } from '../canvas/webgl-mode.js'
import { UA_PATTERNS } from '@core/tokens/motion/gpu.js'
import { GENERIC_DIMENSIONS, VIDEO_DIMENSIONS } from '@core/tokens/media/dimensions.js'

/** Lazy GPU engine: context/program/texture are created on first use only. */
class GPUAccelerator {
  /** Offscreen <canvas> backing the GL context — 1×1 until an upload resizes it. */
  canvas: HTMLCanvasElement | null = null
  /** WebGL2 (WebGL1 fallback) context — null before first use or on failure. */
  gl: WebGL2RenderingContext | WebGLRenderingContext | null = null
  /** Fullscreen-quad passthrough shader program. */
  program: WebGLProgram | null = null
  /** Single reusable texture — all media uploads target it. */
  texture: WebGLTexture | null = null
  /** WebNN 'ml' in navigator — NPU inference available. */
  hasNPU = false
  /** Init attempted (success or fail — never retried per instance). */
  private _ready = false

  /**
   * Cold-starts the GL context on first use (lazy — avoids module-init
   * shader compile blocking page load). The latch prevents retry storms:
   * a failed init stays failed for this instance.
   */
  private _ensureReady(): void {
    if (this._ready) return

    this._ready = true

    this.initGPU()
  }

  /**
   * Creates a 1×1 offscreen WebGL2 (fallback WebGL1) context with a
   * fullscreen-quad passthrough program and one texture. Power preference
   * comes from glContextOptions() (dGPU detection). Mobile is skipped by
   * design; failures degrade silently to the CPU path.
   */
  initGPU(): void {
    if (typeof window === TYPE_STRINGS.UNDEFINED) return

    // Detect WebNN NPU capability
    this.hasNPU = typeof navigator !== TYPE_STRINGS.UNDEFINED && 'ml' in navigator

    // Skip WebGL context creation on mobile — the GPU context + shader
    // compilation blocks the main thread during module init on iOS/Android.
    // Mobile workloads fall back to the WASM/JS path which is faster for them.
    const isMobile =
      typeof navigator !== TYPE_STRINGS.UNDEFINED && UA_PATTERNS.MOBILE_UA.test(navigator.userAgent)

    if (isMobile) return

    try {
      this.canvas = document.createElement('canvas')
      this.canvas.width = 1
      this.canvas.height = 1

      // Route through webglContext (rule 18): the debug fallback param stays
      // authoritative and the WebGL2→WebGL1 downgrade happens in one place.
      // `desynchronized` lowers present latency; alpha:false keeps the
      // compositor on the fast opaque path.
      this.gl = webglContext(
        this.canvas,
        glContextOptions({
          desynchronized: true,
          alpha: false,
          failIfMajorPerformanceCaveat: false,
        }),
        true
      )

      const gl = this.gl

      if (gl) {
        const built = createQuadProgram(gl, GPU_ACCEL_VS, GPU_ACCEL_FS, 'GpuAccel', {
          warn: () => {},
        })

        if (built) {
          this.program = built.program

          const posLocation = gl.getAttribLocation(this.program, WEBGL_STRINGS.A_POSITION)

          bindQuad(gl, built.quadBuffer, posLocation)

          this.texture = gl.createTexture()
        }
      }
    } catch {
      // Graceful CPU fallback
    }
  }

  /**
   * Compiles a GLSL stage on the lazy context; deletes + returns null on
   * failure so a bad shader never leaks a shader object.
   * @param type gl.VERTEX_SHADER | gl.FRAGMENT_SHADER.
   * @param source GLSL source text.
   * @returns The compiled shader, or null.
   */
  compileShader(type: number, source: string): WebGLShader | null {
    if (!this.gl) return null

    const shader = this.gl.createShader(type)

    if (!shader) return null

    this.gl.shaderSource(shader, source)

    this.gl.compileShader(shader)

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      this.gl.deleteShader(shader)

      return null
    }

    return shader
  }

  /**
   * Promotes an element to its own GPU compositor layer (will-change +
   * translate3d + backface-visibility) for smooth transforms. Root/body get
   * scroll-position instead so scroll stays composited without a giant layer.
   * @param el Element to promote (no-op on null/styleless).
   */
  accelerateElementGPU(el: HTMLElement | null | undefined): void {
    if (!el || !el.style) return

    if (
      typeof document !== TYPE_STRINGS.UNDEFINED &&
      (el === document.documentElement || el === document.body)
    ) {
      el.style.willChange = 'scroll-position'

      return
    }

    el.style.willChange = 'transform, opacity'

    el.style.transform = 'translate3d(0, 0, 0)'

    el.style.backfaceVisibility = 'hidden'
  }

  /**
   * Reverses accelerateElementGPU — returns the element to normal
   * compositing. Transform/backface are only cleared off root/body (those
   * never got them, and clearing body transforms could clobber author styles).
   * @param el Element to release.
   */
  releaseElementGPU(el: HTMLElement | null | undefined): void {
    if (!el || !el.style) return

    el.style.willChange = 'auto'

    if (
      typeof document !== TYPE_STRINGS.UNDEFINED &&
      el !== document.documentElement &&
      el !== document.body
    ) {
      el.style.transform = ATTR_VALUES.EMPTY

      el.style.backfaceVisibility = ATTR_VALUES.EMPTY
    }
  }

  /**
   * Shared upload path: resize the offscreen canvas to the target,
   * upload the source into the bound texture (texImage2D accepts
   * Image/Video/ImageBitmap natively — the driver does the decode-to-VRAM
   * copy), LINEAR filtering + CLAMP_TO_EDGE for clean scaling, then draw
   * the 6-vertex fullscreen quad. The draw output itself is never read
   * back — the side effect (media resident in GPU memory, compositor
   * primed) is the point.
   */
  private _uploadTextureAndDraw(source: TexImageSource, targetW: number, targetH: number): void {
    const canvas = this.canvas
    const gl = this.gl

    if (!canvas || !gl) return

    canvas.width = targetW

    canvas.height = targetH

    gl.viewport(0, 0, targetW, targetH)

    gl.useProgram(this.program)

    gl.bindTexture(gl.TEXTURE_2D, this.texture)

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source)

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

    gl.drawArrays(gl.TRIANGLES, 0, 6)
  }

  // Upload HTML5 Video frames directly to WebGL GPU hardware texture
  /**
   * Uploads the current video frame to the GPU texture; needs readyState
   * ≥ 2 (HAVE_CURRENT_DATA) — earlier states have no frame to upload.
   * @param videoEl Source video element.
   * @param targetW Upload width hint (defaults to VIDEO_DIMENSIONS default).
   * @param targetH Upload height hint.
   * @returns true on upload, null when skipped, false on GL error.
   */
  processVideoGPU(
    videoEl: HTMLVideoElement | null,
    targetW: number = VIDEO_DIMENSIONS.VIDEO_DEFAULT_WIDTH,
    targetH: number = VIDEO_DIMENSIONS.VIDEO_DEFAULT_HEIGHT
  ): boolean | null {
    this._ensureReady()

    if (!this.gl || !videoEl || videoEl.readyState < 2) return null

    try {
      this._uploadTextureAndDraw(videoEl, targetW, targetH)

      return true
    } catch {
      return false
    }
  }

  // Upload HTML5 Image element directly to WebGL GPU hardware texture
  /**
   * Uploads an Image element to the GPU texture.
   * @param imageEl Source image element.
   * @param targetW Upload width hint.
   * @param targetH Upload height hint.
   * @returns true on upload, null when skipped, false on GL error.
   */
  processImageGPU(
    imageEl: HTMLImageElement | null,
    targetW: number = GENERIC_DIMENSIONS.DEFAULT_WIDTH,
    targetH: number = GENERIC_DIMENSIONS.DEFAULT_HEIGHT
  ): boolean | null {
    this._ensureReady()

    if (!this.gl || !imageEl) return null

    try {
      this._uploadTextureAndDraw(imageEl, targetW, targetH)

      return true
    } catch {
      return false
    }
  }

  /**
   * Back-compat alias of processImageGPU — kept so older call sites keep working.
   * @param imageEl Source image element.
   * @param targetW Optional width hint.
   * @param targetH Optional height hint.
   * @returns Same contract as processImageGPU.
   */
  processTextureGPU(
    imageEl: HTMLImageElement | null,
    targetW?: number,
    targetH?: number
  ): boolean | null {
    return this.processImageGPU(imageEl, targetW, targetH)
  }

  /**
   * Uploads a pre-decoded ImageBitmap (from the WASM decoder path) —
   * zero-copy into VRAM; the driver accepts ImageBitmap directly.
   * @param bitmap Decoded bitmap.
   * @param targetW Upload width hint.
   * @param targetH Upload height hint.
   * @returns true on upload, null when skipped, false on GL error.
   */
  processBitmapGPU(
    bitmap: ImageBitmap | null | undefined,
    targetW: number = GENERIC_DIMENSIONS.DEFAULT_WIDTH,
    targetH: number = GENERIC_DIMENSIONS.DEFAULT_HEIGHT
  ): boolean | null {
    this._ensureReady()

    if (!this.gl || !bitmap) return null

    try {
      this._uploadTextureAndDraw(bitmap, targetW, targetH)

      return true
    } catch {
      return false
    }
  }
}

/**
 * Shared GPU accelerator singleton — one offscreen context + texture
 * serves every media upload, so the page never holds duplicate pipelines.
 */
export const gpuAccel = new GPUAccelerator()
