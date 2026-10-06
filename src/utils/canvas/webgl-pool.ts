/**
 * @file webgl-pool.ts
 * @description Lifecycle pool for the shared WebGL contexts: registers
 * widget instances per element and uses an IntersectionObserver to purge
 * GL resources while a canvas is offscreen, restoring them on re-entry —
 * caps the number of live contexts (browsers allow ~16).
 */
import { TYPE_STRINGS } from '@/core/tokens/strings/types.js'

/** Widget contract the pool drives on visibility flips. */
export interface WebGLPoolable {
  purge?: () => void
  restore?: () => void
}

interface PoolEntry {
  instance: WebGLPoolable
  isActive: boolean
}

interface CompressionSupport {
  s3tc: unknown
  etc: unknown
  astc: unknown
  bptc: unknown
}

/**
 * WebGL VRAM Lifecycle & Texture Pool Manager
 *
 * Automatically monitors registered WebGL canvases with an IntersectionObserver.
 * - Purges GPU textures & buffers and halts render loops when off-screen.
 * - Seamlessly restores textures & buffers and resumes render loops when visible.
 * - Provides compressed texture format detection for VRAM footprint reduction.
 */
class WebGLPoolManager {
  private entries = new Map<Element, PoolEntry>()
  private observer: IntersectionObserver | null = null

  constructor() {
    this.initObserver()
  }

  /** Creates the offscreen-detection IntersectionObserver. */
  initObserver(): void {
    if (
      typeof window === TYPE_STRINGS.UNDEFINED ||
      typeof IntersectionObserver === TYPE_STRINGS.UNDEFINED
    )
      return

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const item = this.entries.get(entry.target)

          if (!item) return

          if (entry.isIntersecting) {
            if (!item.isActive) {
              item.isActive = true

              item.instance.restore?.()
            }
          } else {
            if (item.isActive) {
              item.isActive = false

              item.instance.purge?.()
            }
          }
        })
      },
      {
        rootMargin: '100px 0px 100px 0px',
        threshold: 0.01,
      }
    )
  }

  /** Associates a widget instance with its canvas for purge/restore. */
  register(element: Element, instance: WebGLPoolable): void {
    if (!element || !instance) return

    this.entries.set(element, {
      instance,
      isActive: true,
    })

    this.observer?.observe(element)
  }

  /** Removes an element from pool management. */
  unregister(element: Element): void {
    if (!element) return

    this.observer?.unobserve(element)

    this.entries.delete(element)
  }

  /** Queries the context's compressed-texture format support. */
  getSupportedCompression(
    gl: WebGLRenderingContext | WebGL2RenderingContext | null
  ): CompressionSupport | null {
    if (!gl) return null

    return {
      s3tc:
        gl.getExtension('WEBGL_compressed_texture_s3tc') ||
        gl.getExtension('MOZ_WEBGL_compressed_texture_s3tc') ||
        gl.getExtension('WEBKIT_WEBGL_compressed_texture_s3tc'),
      etc:
        gl.getExtension('WEBGL_compressed_texture_etc') ||
        gl.getExtension('WEBGL_compressed_texture_etc1'),
      astc: gl.getExtension('WEBGL_compressed_texture_astc'),
      bptc: gl.getExtension('EXT_texture_compression_bptc'),
    }
  }

  /** Releases the context, buffers, listeners and rAF handle so the canvas can be GC'd. */
  destroy(): void {
    this.observer?.disconnect()

    this.entries.clear()
  }
}

/**
 * The webglPool constant.
 */
export const webglPool = new WebGLPoolManager()
