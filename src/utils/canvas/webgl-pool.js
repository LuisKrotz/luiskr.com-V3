import { STRINGS } from '../../core/constants.js'

/**
 * WebGL VRAM Lifecycle & Texture Pool Manager
 *
 * Automatically monitors registered WebGL canvases with an IntersectionObserver.
 * - Purges GPU textures & buffers and halts render loops when off-screen.
 * - Seamlessly restores textures & buffers and resumes render loops when visible.
 * - Provides compressed texture format detection for VRAM footprint reduction.
 */
class WebGLPoolManager {
  constructor() {
    this.entries = new Map()

    this.observer = null

    this.initObserver()
  }

  initObserver() {
    if (typeof window === STRINGS.UNDEFINED || typeof IntersectionObserver === STRINGS.UNDEFINED) return

    this.observer = new IntersectionObserver((entries) => {
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
    }, {
      rootMargin: '100px 0px 100px 0px',
      threshold: 0.01,
    })
  }

  register(element, instance) {
    if (!element || !instance) return

    this.entries.set(element, {
      instance,
      isActive: true,
    })

    this.observer?.observe(element)
  }

  unregister(element) {
    if (!element) return

    this.observer?.unobserve(element)

    this.entries.delete(element)
  }

  getSupportedCompression(gl) {
    if (!gl) return null

    return {
      s3tc: gl.getExtension('WEBGL_compressed_texture_s3tc') || gl.getExtension('MOZ_WEBGL_compressed_texture_s3tc') || gl.getExtension('WEBKIT_WEBGL_compressed_texture_s3tc'),
      etc: gl.getExtension('WEBGL_compressed_texture_etc') || gl.getExtension('WEBGL_compressed_texture_etc1'),
      astc: gl.getExtension('WEBGL_compressed_texture_astc'),
      bptc: gl.getExtension('EXT_texture_compression_bptc'),
    }
  }

  destroy() {
    this.observer?.disconnect()

    this.entries.clear()
  }
}

export const webglPool = new WebGLPoolManager()
