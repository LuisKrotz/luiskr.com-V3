/**
 * @file webgl-pool.ts
 * @description Lifecycle pool for the shared WebGL contexts: registers
 * widget instances per element and uses an IntersectionObserver to purge
 * GL resources while a canvas is offscreen, restoring them on re-entry —
 * caps the number of live contexts (browsers allow ~16).
 */
import { TYPE_STRINGS } from '@/core/tokens/strings/types.js'
import { APP_EVENTS } from '@/core/tokens/events/app.js'
import { KEYBOARD_EVENTS, MOUSE_EVENTS, WINDOW_EVENTS } from '@/core/tokens/events/dom.js'
import store from '@/core/store.js'
import { webglAllowed } from './webgl-mode.js'

/** Widget contract the pool drives on visibility flips and recovery actions. */
export interface WebGLPoolable {
  useWebGL?: boolean
  purge?: () => void
  restore?: () => void
  retryWebGL?: () => boolean | void
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
  private retryScheduled = false
  private recoverySignalsReady = false
  private readonly onRecoveryAction = (): void => this.scheduleFallbackRetry()

  constructor() {
    this.initObserver()
    this.initRecoverySignals()
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

  /**
   * Registers global actions that can coincide with a healthier rendering
   * context: user clicks/keys, browser history changes, and app modal opens.
   * One listener set serves every widget; retries are deferred until the
   * triggering action finishes mounting/updating its UI.
   */
  initRecoverySignals(): void {
    if (this.recoverySignalsReady || typeof window === TYPE_STRINGS.UNDEFINED) return

    this.recoverySignalsReady = true

    window.addEventListener(MOUSE_EVENTS.CLICK, this.onRecoveryAction)
    window.addEventListener(KEYBOARD_EVENTS.KEYDOWN, this.onRecoveryAction)
    window.addEventListener(WINDOW_EVENTS.POPSTATE, this.onRecoveryAction)
    window.addEventListener(APP_EVENTS.OPEN_PREFERENCES_MODAL, this.onRecoveryAction)
    window.addEventListener(APP_EVENTS.OPEN_LANG_DIALOG, this.onRecoveryAction)
  }

  /** Coalesces all actions in one turn into a single fallback retry pass. */
  scheduleFallbackRetry(): void {
    if (this.retryScheduled || !this.hasRetryableFallbacks()) return

    this.retryScheduled = true

    setTimeout(() => {
      this.retryScheduled = false
      this.retryFallbacks()
    }, 0)
  }

  /** True when a visible registered widget is currently using its fallback. */
  private hasRetryableFallbacks(): boolean {
    for (const { instance, isActive } of this.entries.values()) {
      if (isActive && instance.useWebGL === false) return true
    }

    return false
  }

  /**
   * Retries visible fallback widgets when WebGL is preferred. Reduced motion
   * and the explicit debug fallback mode are authoritative and suppress all
   * recovery attempts.
   */
  retryFallbacks(): void {
    if (store.getters.getReducedMotion() || !webglAllowed()) return

    for (const { instance, isActive } of this.entries.values()) {
      if (!isActive || instance.useWebGL !== false) continue

      if (instance.retryWebGL) {
        instance.retryWebGL()
      } else {
        instance.purge?.()
        instance.restore?.()
      }
    }
  }

  /** Associates a widget instance with its canvas for purge/restore/retry. */
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

    if (typeof window !== TYPE_STRINGS.UNDEFINED) {
      window.removeEventListener(MOUSE_EVENTS.CLICK, this.onRecoveryAction)
      window.removeEventListener(KEYBOARD_EVENTS.KEYDOWN, this.onRecoveryAction)
      window.removeEventListener(WINDOW_EVENTS.POPSTATE, this.onRecoveryAction)
      window.removeEventListener(APP_EVENTS.OPEN_PREFERENCES_MODAL, this.onRecoveryAction)
      window.removeEventListener(APP_EVENTS.OPEN_LANG_DIALOG, this.onRecoveryAction)
    }

    this.recoverySignalsReady = false
    this.retryScheduled = false
    this.entries.clear()
  }
}

/**
 * The webglPool constant.
 */
export const webglPool = new WebGLPoolManager()
