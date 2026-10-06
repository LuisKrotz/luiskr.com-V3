/**
 * @file theme-slider.js
 * @description WebGL three-position theme slider (light / system / dark)
 * for the preferences modal: sun→monitor→moon iconography morphs along the
 * track; drag + tap interaction with spring physics. Canvas2D fallback.
 */

import { PREF_CLASSES } from '@/core/tokens/classes/preferences.js'
import { STATE_CLASSES } from '@/core/tokens/classes/state.js'
import { POINTER_EVENTS } from '@/core/tokens/events/dom.js'
import { CHAR_STRINGS } from '@/core/tokens/strings/chars.js'
import { THEME } from '@/core/tokens/theme/theme.js'
import store from '@/core/store.js'
import { releaseQuadGL, watchContextLoss } from '../gl-lifecycle.js'
import { webglPool } from '../webgl-pool.js'
import { bindThemeSliderEvents } from './theme-slider/events.js'
import { init, initWebGL, triggerFallback } from './theme-slider/init.js'
import { pToKnobX, pToTheme, themeToP, xToContinuousP, xToP } from './theme-slider/math.js'
import { animate, renderCanvas2D, renderStatic, renderWebGL } from './theme-slider/render.js'

/**
 * Full Animated Day/Night/System Theme Slider
 * Powered by WebGL with robust Canvas 2D fallback.
 * Uses normalized aspect coordinates (range 0.0 to 3.33) to prevent GPU float overflow on all platforms.
 * Position 0: Dark (Night - Lunar moon with craters, twinkling stars, starry canyon mesas)
 * Position 1: System (Twilight - Balanced orb, sun rings rising on left, crescent on right)
 * Position 2: Light (Day - Sun knob on right, peach/coral sky, radiant sun on left)
 */
export class ThemeSliderWebGL {
  canvas: HTMLCanvasElement
  onThemeChange: ((_theme: string) => void) | null
  currentTheme: string
  width: number
  height: number
  targetP: number
  currentP: number
  knobX: number
  isDragging = false
  startX = 0
  useWebGL = false
  animId: number | null = null
  startTime: number
  rippleTime: number
  ripplePos: number
  gl: WebGLRenderingContext | null = null
  ctx: CanvasRenderingContext2D | null = null
  program: WebGLProgram | null = null
  quadBuffer: WebGLBuffer | null = null
  uResolution: WebGLUniformLocation | null = null
  uTime: WebGLUniformLocation | null = null
  uProgress: WebGLUniformLocation | null = null
  uKnobX: WebGLUniformLocation | null = null
  uRippleTime: WebGLUniformLocation | null = null
  uRipplePos: WebGLUniformLocation | null = null
  aPos = -1
  _resizeObserver: ResizeObserver | null = null
  _onContextLost: EventListener | null = null
  _purged = false
  onPointerDown: ((_e: PointerEvent) => void) | undefined
  onPointerMove: ((_e: PointerEvent) => void) | undefined
  onPointerUp: ((_e: PointerEvent) => void) | undefined
  onClick: ((_e: MouseEvent) => void) | undefined
  onKeyDown: ((_e: KeyboardEvent) => void) | undefined

  constructor(
    canvas: HTMLCanvasElement,
    initialTheme: string = THEME.SYSTEM,
    onThemeChange: ((_theme: string) => void) | null = null
  ) {
    this.canvas = canvas

    this.onThemeChange = onThemeChange

    this.currentTheme = initialTheme

    // CSS-pixel geometry — init() re-measures from getBoundingClientRect.
    this.width = 280

    this.height = 64

    // Track position is normalized 0.0–2.0: 0=dark, 1=system, 2=light.
    // currentP chases targetP with a 0.14 lerp each frame (see animate()).
    this.targetP = this._themeToP(initialTheme)

    this.currentP = this.targetP

    this.knobX = this._pToKnobX(this.currentP)

    this.isDragging = false

    this.startX = 0

    this.useWebGL = false

    this.animId = null

    this.startTime = performance.now()

    // Ripple state: -10s backdates the ripple so the "age" check in the
    // shader (elapsed < 0.6s) is false until the first tap.
    this.rippleTime = -10.0

    this.ripplePos = 32.0

    this.init()
  }

  /**
   * THEME → normalized track position. Positions are the integer stops
   * 0/1/2 — fractional values only exist mid-animation.
   */
  _themeToP(theme: string): number {
    return themeToP(theme)
  }

  /** Maps a normalized track position back to the nearest THEME value. */

  _pToTheme(p: number): string {
    return pToTheme(p)
  }

  /**
   * Normalized position → knob pixel X inside the track — see
   * theme-slider-math.ts for the inset geometry.
   */
  _pToKnobX(p: number): number {
    return pToKnobX(this, p)
  }

  /** Boot sequence: GL init → event binding → render start; fully degrades to the fallback path. */

  init(): void {
    init(this)
  }

  /** Switches to the non-WebGL path (CSS class on the host / Canvas2D) — used on context loss or init failure. */

  _triggerFallback(): void {
    triggerFallback(this)
  }

  /** Creates the WebGL context, compiles the shader program and sets up uniforms/buffers; falls back on any failure. */

  initWebGL(): void {
    initWebGL(this)
  }

  /** Wires pointer drag + tap-to-snap; supports keyboard arrows for a11y. */

  bindEvents(): void {
    bindThemeSliderEvents(this)
  }

  /**
   * Pointer pixel X → continuous (unclamped-drag) normalized position —
   * see theme-slider-math.ts for the 12%–88% active band.
   */
  _xToContinuousP(x: number, rectWidth: number | null = null): number {
    return xToContinuousP(this, x, rectWidth)
  }

  /**
   * Pointer pixel X → normalized position using the fixed 32px insets
   * (same span as _pToKnobX). Retained for non-drag hit paths.
   */
  _xToP(x: number): number {
    return xToP(this, x)
  }

  /** Moves the knob to the given theme's stop (spring-animated). */

  setTheme(theme: string): void {
    this.currentTheme = theme

    this.targetP = this._themeToP(theme)

    this.rippleTime = (performance.now() - this.startTime) * 0.001

    this.ripplePos = this._pToKnobX(this.targetP)

    if (store.getters.getReducedMotion()) this._renderStatic()
  }

  /**
   * Applies prefers-reduced-motion: swaps the animation loop for one
   * static frame render, or restarts the loop when motion is re-allowed.
   * @param {boolean} isReduced
   */
  setReducedMotion(isReduced: boolean): void {
    if (isReduced) {
      this._renderStatic()
    } else if (!this.animId) {
      this.animate()
    }
  }

  /**
   * Snap state to target and draw a single settled frame — used under
   * reduced motion or when the loop is stopped.
   */
  _renderStatic(): void {
    renderStatic(this)
  }

  /** Starts the requestAnimationFrame render loop (skipped under reduced motion). */

  animate(): void {
    animate(this)
  }

  /** Per-frame WebGL render: updates time/knob uniforms and draws the quad. */

  _renderWebGL(now: number): void {
    renderWebGL(this, now)
  }

  /**
   * Canvas2D fallback renderer — dormant defensive code; the real
   * fallback hides the canvas and activates the CSS/DOM fallback
   * (see theme-slider-init.ts triggerFallback).
   */
  _renderCanvas2D(): void {
    renderCanvas2D(this)
  }

  /**
   * webglPool hook — offscreen: stops the loop and force-loses the GL
   * context so offscreen widgets hold no context slots; restore()
   * rebuilds the program on re-entry.
   */
  purge(): void {
    if (this._purged) return

    this._purged = true

    this.useWebGL = false

    if (this.animId) {
      cancelAnimationFrame(this.animId)

      this.animId = null
    }

    releaseQuadGL(this.canvas, this, this._onContextLost)

    this._onContextLost = null
  }

  /** Recreates the GL context + program and resumes the loop after a purge. */
  restore(): void {
    if (!this._purged) return

    // Keep _purged while detached — the pool retries restore() on the
    // next intersection, and only then is the context rebuilt.
    if (!this.canvas?.isConnected) return

    this._purged = false

    this.canvas.style.display = CHAR_STRINGS.EMPTY

    this.canvas.classList.remove(STATE_CLASSES.IS_FALLBACK)

    this.canvas
      .closest(`.${PREF_CLASSES.PREF_THEME_WRAPPER}`)
      ?.classList.remove(STATE_CLASSES.HAS_FALLBACK)

    this.initWebGL()

    if (this.useWebGL) {
      this._onContextLost = watchContextLoss(this.canvas, () => this._triggerFallback())

      this.animate()
    }
  }

  /** Releases the context, buffers, listeners and rAF handle so the canvas can be GC'd. */

  destroy(): void {
    webglPool.unregister(this.canvas)

    if (this._resizeObserver) {
      this._resizeObserver.disconnect()

      this._resizeObserver = null
    }

    if (this.animId) cancelAnimationFrame(this.animId)

    if (this.onPointerDown)
      this.canvas.removeEventListener(POINTER_EVENTS.POINTERDOWN, this.onPointerDown)

    if (this.onPointerMove)
      window.removeEventListener(POINTER_EVENTS.POINTERMOVE, this.onPointerMove)

    if (this.onPointerUp) window.removeEventListener(POINTER_EVENTS.POINTERUP, this.onPointerUp)

    releaseQuadGL(this.canvas, this, this._onContextLost)

    this._onContextLost = null
  }
}
