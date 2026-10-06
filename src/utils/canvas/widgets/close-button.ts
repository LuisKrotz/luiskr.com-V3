/**
 * @file close-button.js
 * @description WebGL animated circular close (X) button used by the expand
 * modal and dialogs: the X's strokes draw in/out with a hover accent.
 * Canvas2D fallback path mirrors the shader's look for no-WebGL contexts.
 *
 * Facade — behavior lives in ./close-button-* modules:
 *   init     boot, sizing, GL setup, context-loss fallback
 *   render   rAF loop, eased channels, per-frame draw
 */

import { MOUSE_EVENTS } from '@/core/tokens/events/dom.js'
import { STATE_CLASSES } from '@/core/tokens/classes/state.js'
import { CHAR_STRINGS } from '@/core/tokens/strings/chars.js'
import { releaseQuadGL, watchContextLoss } from '../gl-lifecycle.js'
import { webglPool } from '../webgl-pool.js'
import { init, initWebGL, onContextLost } from './close-button/init.js'
import { animate, renderStatic, renderWebGL } from './close-button/render.js'

/**
 * WebGL Animated Close Button
 * Features:
 * - Liquid fills slower and procedural rising bubbles with specular highlights
 * - Rotating X during hover/liquid animation
 * - Razor-sharp vector anti-aliased X line strokes (zero blur)
 * - Kinetic shockwave ripple on click
 * - Resilient Canvas 2D fallback
 */
export class CloseButtonWebGL {
  canvas: HTMLCanvasElement
  onClickAction: (() => void) | null
  width: number
  height: number
  isHovered: boolean
  hoverLevel: number
  drawProgress: number
  rotation: number
  clickTime: number
  useWebGL: boolean
  animId: number | null
  startTime: number
  gl: WebGLRenderingContext | null = null
  program: WebGLProgram | null = null
  quadBuffer: WebGLBuffer | null = null
  uResolution: WebGLUniformLocation | null = null
  uTime: WebGLUniformLocation | null = null
  uLiquid: WebGLUniformLocation | null = null
  uDraw: WebGLUniformLocation | null = null
  uRot: WebGLUniformLocation | null = null
  uClickTime: WebGLUniformLocation | null = null
  aPos = 0
  _ro: ResizeObserver | null = null
  _onContextLost: EventListener | null = null
  _purged = false
  boundTarget: Element | null = null
  onMouseEnter = (): void => {
    this.setHover(true)
  }
  onMouseLeave = (): void => {
    this.setHover(false)
  }
  onClick = (): void => {
    this.triggerClick()

    this.onClickAction?.()
  }

  /**
   * @param canvas - overlay canvas inside the host
   *   <button>; pointer events are bound to the parent button, not the canvas
   * @param onClickAction - forwarded after each click (the
   *   shockwave always fires; the host's close handler runs alongside)
   */
  constructor(canvas: HTMLCanvasElement, onClickAction: (() => void) | null = null) {
    this.canvas = canvas

    this.onClickAction = onClickAction

    this.width = 36

    this.height = 36

    this.isHovered = false

    // Three independent animation channels, each eased at its own rate in
    // animate(): hoverLevel drives the liquid fill (slow, 0.016/frame),
    // rotation drives the X spin (0.04/frame, targets hoverLevel·π = a
    // half-turn), drawProgress is the one-time stroke draw-in (0.02/frame,
    // ~50 frames ≈ 830ms on first mount).
    this.hoverLevel = 0.0

    this.drawProgress = 0.0

    this.rotation = 0.0

    // -10s backdates the click timestamp so the shader's 0.4s shockwave
    // window is already closed until the first real click.
    this.clickTime = -10.0

    this.useWebGL = false

    this.animId = null

    this.startTime = performance.now()

    this.init()
  }

  /** Boot sequence: GL init → event binding → render start; fully degrades to the fallback path. */

  init(): void {
    init(this)
  }

  /** Creates the WebGL context, compiles the shader program and sets up uniforms/buffers; falls back on any failure. */

  initWebGL(): void {
    initWebGL(this)
  }

  /**
   * Wires hover + click on the parent button (not the canvas) — the canvas
   * is a decorative overlay so interaction belongs to the semantic button.
   * boundTarget is remembered for destroy().
   */
  bindEvents(): void {
    const target = this.canvas.parentElement || this.canvas

    this.boundTarget = target

    target.addEventListener(MOUSE_EVENTS.MOUSEENTER, this.onMouseEnter)

    target.addEventListener(MOUSE_EVENTS.MOUSELEAVE, this.onMouseLeave)

    target.addEventListener(MOUSE_EVENTS.CLICK, this.onClick)
  }

  /** Updates hover state — the shader renders the hover accent when true. */

  setHover(hovered: boolean): void {
    this.isHovered = Boolean(hovered)
  }

  /**
   * Records the click timestamp — the shader reads u_click_time to expand
   * the shockwave ring over its 0.4s window. The onClickAction callback is
   * invoked separately by the click handler, not here.
   */
  triggerClick(): void {
    this.clickTime = (performance.now() - this.startTime) * 0.001
  }

  /**
   * Applies prefers-reduced-motion: swaps the animation loop for one
   * static frame render, or restarts the loop when motion is re-allowed.
   */
  setReducedMotion(isReduced: boolean): void {
    if (isReduced) {
      this._renderStatic()
    } else if (!this.animId) {
      this.animate()
    }
  }

  /**
   * Draws one settled frame with the X fully drawn — used under reduced
   * motion or when the loop is stopped.
   */
  _renderStatic(): void {
    renderStatic(this)
  }

  /** Starts the requestAnimationFrame render loop (skipped under reduced motion). */

  animate(): void {
    animate(this)
  }

  /** Per-frame WebGL render: updates time/hover uniforms and draws the quad. */

  _renderWebGL(now: number): void {
    renderWebGL(this, now)
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

    this.initWebGL()

    if (this.useWebGL) {
      this._onContextLost = watchContextLoss(this.canvas, () => onContextLost(this))

      this.animate()
    }
  }

  /** Releases the context, buffers, listeners and rAF handle so the canvas can be GC'd. */

  destroy(): void {
    webglPool.unregister(this.canvas)

    if (this.animId) cancelAnimationFrame(this.animId)

    this.boundTarget?.removeEventListener(MOUSE_EVENTS.MOUSEENTER, this.onMouseEnter)

    this.boundTarget?.removeEventListener(MOUSE_EVENTS.MOUSELEAVE, this.onMouseLeave)

    this.boundTarget?.removeEventListener(MOUSE_EVENTS.CLICK, this.onClick)

    if (this._ro) {
      this._ro.disconnect()

      this._ro = null
    }

    releaseQuadGL(this.canvas, this, this._onContextLost)

    this._onContextLost = null
  }
}
