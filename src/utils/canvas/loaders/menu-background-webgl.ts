/**
 * @file menu-background-webgl.js
 * @description Fullscreen WebGL background for the nav menu overlay: an
 * FBM-noise contour field (Iris-van-Herpen-inspired organic contour lines)
 * with theme-aware two-tone ink — deep→light water blues in light mode,
 * monochrome in dark. Samples --menu-* CSS tokens and re-renders on theme
 * change; CSS moiré fallback when WebGL is unavailable.
 *
 * Facade — behavior lives in ./menu-background-* modules:
 *   init    GL bootstrap + fallback trigger
 *   theme   --menu-ink / --menu-ink-2 sampling
 *   loop    reveal ease, rAF loop, resize sync, per-frame draw
 */

import { parseCssColor } from '../css-color.js'
import { releaseQuadGL } from '../gl-lifecycle.js'
import { webglPool } from '../webgl-pool.js'
import { initGL, triggerFallback } from './menu-background/init.js'
import { sampleTheme } from './menu-background/theme.js'
import {
  animateReveal,
  handleResize,
  loop,
  release,
  renderFrame,
  start,
  stop,
  tickReveal,
} from './menu-background/loop.js'

/**
 * WebGL animated background for the mobile burger menu — "Membrane" concept.
 * Renders fine organic monochrome contour lines (domain-warped fbm isolines)
 * that slowly breathe, inspired by Iris van Herpen's material studies.
 * The field materialises from the centre as `u_reveal` eases toward 1 and
 * dissolves back on release(). Line colour is sampled from --menu-ink /
 * --menu-ink-2 so it always matches the active theme — monochrome in dark,
 * water-blues in light; falls back to a CSS moiré layer when WebGL is
 * unavailable or the shader fails to compile/link.
 */
export class MenuBackgroundWebGL {
  /**
   * @param {HTMLCanvasElement} canvas - fullscreen canvas behind the menu
   *   overlay's content; owned by AppNav which calls start/release/stop
   *   with the menu's open/close lifecycle
   */
  canvas: HTMLCanvasElement
  gl: WebGLRenderingContext | null = null
  program: WebGLProgram | null = null
  quadBuffer: WebGLBuffer | null = null
  animId: number | null = null
  uTime: WebGLUniformLocation | null = null
  uResolution: WebGLUniformLocation | null = null
  uColor: WebGLUniformLocation | null = null
  uColor2: WebGLUniformLocation | null = null
  uReveal: WebGLUniformLocation | null = null
  uAlpha: WebGLUniformLocation | null = null
  width = 0
  height = 0
  isActive = false
  _ro: ResizeObserver | null = null
  useWebGL = false
  _reveal = 0
  _revealTarget = 0
  _revealFrom = 0
  _revealT0 = 0
  _revealDur = 0
  _lastFrame = 0
  _elapsed = 0
  _color: number[] = [1, 1, 1]
  _color2: number[] = [1, 1, 1]
  _darkAtStart = false
  _hasDeriv = false
  _onContextLost: EventListener | null = null
  _purged = false
  _wantsActive = false

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas

    // Ink colors sampled from --menu-ink / --menu-ink-2; defaults are
    // light-on-dark fallbacks before the first _sampleTheme().
    this._color = [1, 1, 1]
    this._color2 = [1, 1, 1]

    this._initGL()
  }

  /** Creates the WebGL context + shader program; falls back to the CSS/DOM path on failure. */

  _initGL() {
    initGL(this)
  }

  /** Switches to the non-WebGL path (CSS moiré layer) — used on context loss or init failure. */

  _triggerFallback() {
    triggerFallback(this)
  }

  /** Frees the quad program/buffer and force-loses the context (listener detached first). */

  _releaseGL() {
    releaseQuadGL(this.canvas, this, this._onContextLost)

    this._onContextLost = null
  }

  /**
   * Parses a CSS colour string (#rgb, #rrggbb, rgb(), rgba()) into a
   * normalized [r,g,b] float triple for the shader uniform.
   */
  _parseCssColor(str: string): number[] | null {
    return parseCssColor(str)
  }

  /** Samples --menu-ink / --menu-ink-2 into the shader ink colors. */

  _sampleTheme() {
    sampleTheme(this)
  }

  /** Begins the render loop on menu open (see menu-background-loop.ts). */

  start() {
    this._wantsActive = true

    webglPool.register(this.canvas, this)

    start(this)
  }

  /** Eases the reveal back to 0 so the field dissolves on menu close. */

  release() {
    this._wantsActive = false

    release(this)
  }

  /**
   * webglPool hook — canvas scrolled offscreen (or the browser trimmed
   * contexts): tears the GL resources down entirely instead of merely
   * pausing, freeing the context slot for other surfaces. restore()
   * recreates them on re-entry.
   */
  purge() {
    if (this._purged) return

    this._purged = true

    this.useWebGL = false

    this.stop()

    this._releaseGL()
  }

  /** Recreates the GL context + restarts the loop after an offscreen purge. */

  restore() {
    if (!this._purged) return

    // Only the open menu wants the field back — a purge during the close
    // dissolve must not resurrect it. _purged stays set while detached so
    // the pool's next restore() still retries the rebuild.
    if (!this._wantsActive || !this.canvas?.isConnected) return

    this._purged = false

    this._reveal = 0

    this._initGL()

    if (this.useWebGL) this.start()
  }

  /** Starts (or restarts mid-flight) a timed reveal ease. */

  _animateReveal(target: number, dur: number): void {
    animateReveal(this, target, dur)
  }

  /** Advances the reveal ease to the current timestamp. */

  _tickReveal(now: number): void {
    tickReveal(this, now)
  }

  /** Stops the rAF loop. */

  stop() {
    stop(this)
  }

  /** Syncs buffer size + u_res uniform with the viewport. */

  _handleResize() {
    handleResize(this)
  }

  /** rAF callback — draws the animated contour field each frame. */

  _loop() {
    loop(this)
  }

  /** Renders the noise field; a fixed staticTime renders one settled frame. */

  _renderFrame(staticTime?: number | null): void {
    renderFrame(this, staticTime)
  }

  /** Releases the context, buffers, listeners and rAF handle so the canvas can be GC'd. */

  destroy() {
    this._wantsActive = false

    this._purged = false

    webglPool.unregister(this.canvas)

    this.stop()

    this._releaseGL()
  }
}
