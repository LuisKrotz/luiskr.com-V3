/**
 * @file burger-button-webgl.js
 * @description WebGL hamburger icon for the nav burger button: three
 * rounded bars with a subtle traveling wave, theme-aware ink color, and a
 * CSS fallback button when WebGL is unavailable or lost.
 */

import { MEDIA_QUERIES } from '@/core/tokens/primitives.js'
import { NAV_CLASSES } from '@/core/tokens/classes/nav.js'
import { STATE_CLASSES } from '@/core/tokens/classes/state.js'
import { KEYBOARD_EVENTS, MOUSE_EVENTS, WINDOW_EVENTS } from '@/core/tokens/events/dom.js'
import { KEYS } from '@/core/tokens/primitives.js'
import { CHAR_STRINGS } from '@/core/tokens/strings/chars.js'
import { INPUT_STRINGS } from '@/core/tokens/strings/input.js'
import { STATE_STRINGS } from '@/core/tokens/strings/state.js'
import { WEBGL_STRINGS } from '@/core/tokens/strings/webgl.js'
import { QUAD_STRIP } from '@/core/tokens/motion/gpu.js'
import { bindQuad, createQuadProgram, getUniforms } from '../gl-program.js'
import { releaseQuadGL, watchContextLoss } from '../gl-lifecycle.js'
import { webglPool } from '../webgl-pool.js'
import { BURGER_VS, burgerFsSource } from './burger-button/shaders.js'
import { glContextOptions } from '@/utils/gpu/gpu-info.js'
import { webglContext } from '../webgl-mode.js'

/**
 * WebGL animated hamburger icon for the mobile burger button.
 * Renders three sleek horizontal lines with rounded pill caps and subtle wave animation.
 * Adapts to the current theme: dark icon in light mode, bright icon in dark mode.
 */
export class BurgerButtonWebGL {
  /**
   * @param {HTMLCanvasElement} canvas - icon canvas inside the nav burger button
   * @param {Function} onClick - optional click handler (the canvas becomes
   *   interactive — cursor:pointer + click listener); pass null when the
   *   parent button already handles clicks
   */
  canvas: HTMLCanvasElement
  gl: WebGLRenderingContext | null = null
  program: WebGLProgram | null = null
  quadBuffer: WebGLBuffer | null = null
  animId: number | null = null
  startTime = performance.now()
  uTime: WebGLUniformLocation | null = null
  uResolution: WebGLUniformLocation | null = null
  uDark: WebGLUniformLocation | null = null
  _onClick: EventListener | null
  _onKeyDown: ((e: Event) => void) | null = null
  _onContextLost: EventListener | null = null
  _onResize: () => void
  _purged = false
  _hasDeriv = false
  useWebGL = false

  constructor(canvas: HTMLCanvasElement, onClick?: EventListener | null) {
    this.canvas = canvas

    this._onClick = onClick || null

    this._initGL()

    if (onClick) {
      canvas.style.cursor = INPUT_STRINGS.POINTER

      canvas.addEventListener(MOUSE_EVENTS.CLICK, onClick)

      // The canvas is the focusable control when WebGL renders (the CSS
      // fallback <button> is display:none) — Enter/Space must activate it.
      this._onKeyDown = (e: Event) => {
        const key = (e as KeyboardEvent).key

        if (key === KEYS.ENTER || key === KEYS.SPACE) {
          e.preventDefault()

          onClick(e)
        }
      }

      canvas.addEventListener(KEYBOARD_EVENTS.KEYDOWN, this._onKeyDown)
    }

    // A lost context (GPU reset, driver crash) is recoverable UX-wise —
    // the CSS icon takes over. No preventDefault: a prevented loss asks
    // the browser to restore the context, and our deliberate
    // loseContext() in destroy() would resurrect a zombie.
    this._onContextLost = watchContextLoss(this.canvas, () => this._triggerFallback())

    this._onResize = () => this._checkResize()

    window.addEventListener(WINDOW_EVENTS.RESIZE, this._onResize, { passive: true })

    // Offscreen burger canvases release their GL entirely; restore()
    // recreates the context when the canvas comes back into view.
    webglPool.register(this.canvas, this)

    this._start()
  }

  /** Creates the WebGL context + shader program; falls back to the CSS/DOM path on failure. */

  _initGL() {
    if (!this.canvas) {
      this._triggerFallback()
      return
    }

    // Re-init after a purge/restore: clear the fallback marks a previous
    // failure left on this (persistent, reused) canvas element.
    this.canvas.style.display = CHAR_STRINGS.EMPTY

    this.canvas.classList.remove(STATE_CLASSES.IS_FALLBACK)

    const gl = webglContext(
      this.canvas,
      glContextOptions({ alpha: true, antialias: true, preserveDrawingBuffer: false })
    ) as WebGLRenderingContext | null

    if (!gl) {
      this._triggerFallback()
      return
    }

    this.gl = gl
    this.useWebGL = true

    // fwidth() needs OES_standard_derivatives in WebGL1 — it gives the bars
    // pixel-constant analytic AA on top of the supersampled buffer.
    this._hasDeriv = !!gl.getExtension(WEBGL_STRINGS.OES_STANDARD_DERIVATIVES)

    const built = createQuadProgram(gl, BURGER_VS, burgerFsSource(this._hasDeriv), 'BurgerButton', {
      verts: new Float32Array(QUAD_STRIP.VERTS),
      premultiplied: false,
    })

    if (!built) {
      this._triggerFallback()

      return
    }

    this.program = built.program

    this.quadBuffer = built.quadBuffer

    gl.useProgram(this.program)

    const aPos = gl.getAttribLocation(this.program, WEBGL_STRINGS.A_POS)

    bindQuad(gl, this.quadBuffer, aPos)

    const u = getUniforms(gl, this.program, {
      u_time: 'u_time',
      u_res: 'u_res',
      u_dark: 'u_dark',
    })

    this.uTime = u.u_time

    this.uResolution = u.u_res

    this.uDark = u.u_dark
  }

  /** Switches to the non-WebGL path (CSS class on the host / Canvas2D) — used on context loss or init failure. */

  _triggerFallback() {
    this.useWebGL = false

    if (this.animId) {
      cancelAnimationFrame(this.animId)

      this.animId = null
    }

    releaseQuadGL(this.canvas, this, this._onContextLost)

    this._onContextLost = null

    if (this.canvas) {
      this.canvas.style.display = STATE_STRINGS.NONE

      this.canvas.classList.add(STATE_CLASSES.IS_FALLBACK)
    }
  }

  /**
   * Re-syncs the drawing buffer to the canvas's CSS box × devicePixelRatio
   * (capped at 2). Only reallocates when the rounded size actually changed,
   * and repaints one frame immediately when the RAF loop isn't running —
   * in reduced-motion static mode a resize would otherwise leave the
   * cleared buffer blank until the next state change.
   */
  _checkResize() {
    if (!this.canvas || !this.gl) return

    // Supersample ×4 past DPR: a 34px icon renders at ~136–272px and the
    // CSS downsample smooths the hairline edges on top of the shader's
    // analytic AA — a tiny canvas makes this essentially free.
    const dpr = Math.min(window.devicePixelRatio || 1, 2) * 4

    const rect = this.canvas.getBoundingClientRect()

    const w = Math.round((rect.width || 34) * dpr)

    const h = Math.round((rect.height || 34) * dpr)

    if (w > 0 && h > 0 && (this.canvas.width !== w || this.canvas.height !== h)) {
      this.canvas.width = w

      this.canvas.height = h

      this.gl.viewport(0, 0, w, h)

      // Static mode (reduced motion) has no loop to repaint the cleared buffer
      if (this.animId === null) {
        this._drawFrame(0)
      }
    }
  }

  /** Chooses reduced-motion static render vs the rAF loop. */

  _start() {
    if (!this.useWebGL) return

    this._checkResize()

    // Layout may not be settled on the very first frame (fonts, shadow DOM
    // adoption); re-measure once more before the loop settles.
    requestAnimationFrame(() => this._checkResize())

    const reduced =
      document.documentElement.classList.contains(STATE_CLASSES.REDUCED_MOTION) ||
      (window.matchMedia && window.matchMedia(MEDIA_QUERIES.PREFERS_REDUCED_MOTION).matches)

    if (reduced) {
      this._drawFrame(0)

      return
    }

    this._loop()
  }

  /**
   * Renders one frame at time t (seconds) — shared by the RAF loop and the
   * static reduced-motion path. u_dark is re-evaluated per frame from the
   * live DOM classes (dark theme OR nav-on-dark over the contact band) so
   * the icon recolors instantly on theme/scroll changes with no listener.
   * @param {number} t - seconds since construction
   */
  _drawFrame(t: number): void {
    if (this.canvas.width === 0 || this.canvas.height === 0) return

    const gl = this.gl

    if (!gl) return

    const isDark =
      document.documentElement.classList.contains(STATE_CLASSES.DARK_MODE) ||
      this.canvas.classList.contains(NAV_CLASSES.NAV_ON_DARK)
        ? 1
        : 0

    gl.clearColor(0, 0, 0, 0)

    gl.clear(gl.COLOR_BUFFER_BIT)

    gl.useProgram(this.program)

    gl.uniform1f(this.uTime, t)

    gl.uniform2f(this.uResolution, this.canvas.width, this.canvas.height)

    gl.uniform1f(this.uDark, isDark)

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, QUAD_STRIP.VERTEX_COUNT)
  }

  /** rAF callback — repaints each frame while running. */

  _loop() {
    if (!this.gl || !this.useWebGL) return

    this.animId = requestAnimationFrame(() => this._loop())

    this._drawFrame((performance.now() - this.startTime) / 1000)
  }

  /**
   * webglPool hook — offscreen: stops the loop and releases the GL
   * context entirely; restore() rebuilds it on re-entry so offscreen
   * widgets never hold context slots.
   */
  purge() {
    if (this._purged) return

    this._purged = true

    if (this.animId) {
      cancelAnimationFrame(this.animId)

      this.animId = null
    }

    releaseQuadGL(this.canvas, this, this._onContextLost)

    this._onContextLost = null
  }

  /** Recreates the GL context and resumes the loop after an offscreen purge. */
  restore() {
    if (!this._purged) return

    // Keep _purged while detached — the pool retries restore() on the
    // next intersection, and only then is the context rebuilt.
    if (!this.canvas?.isConnected) return

    this._purged = false

    this._initGL()

    if (this.useWebGL) {
      this._onContextLost = watchContextLoss(this.canvas, () => this._triggerFallback())

      this._start()
    }
  }

  /** Releases the context, buffers, listeners and rAF handle so the canvas can be GC'd. */

  destroy() {
    webglPool.unregister(this.canvas)

    if (this.animId) {
      cancelAnimationFrame(this.animId)

      this.animId = null
    }

    if (this._onClick && this.canvas) {
      this.canvas.removeEventListener(MOUSE_EVENTS.CLICK, this._onClick)
    }

    if (this._onKeyDown && this.canvas) {
      this.canvas.removeEventListener(KEYBOARD_EVENTS.KEYDOWN, this._onKeyDown)

      this._onKeyDown = null
    }

    window.removeEventListener(WINDOW_EVENTS.RESIZE, this._onResize)

    releaseQuadGL(this.canvas, this, this._onContextLost)

    this._onContextLost = null
  }
}
