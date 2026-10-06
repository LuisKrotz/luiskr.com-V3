/**
 * @file switch-slider.js
 * @description WebGL toggle switch for preferences/stats contexts: a pill
 * track + sliding knob rendered as SDF shapes in a fragment shader with
 * spring-eased motion. Used for boolean preferences (video autoplay,
 * reduced motion, grid, stats). Canvas2D fallback mirrors the shader.
 */

import { MOUSE_EVENTS } from '@/core/tokens/events/dom.js'
import { STATE_CLASSES } from '@/core/tokens/classes/state.js'
import { CHAR_STRINGS } from '@/core/tokens/strings/chars.js'
import { WEBGL_STRINGS } from '@/core/tokens/strings/webgl.js'
import { SWITCH_TYPES } from '@/core/tokens/theme/switches.js'
import store from '@/core/store.js'
import { releaseQuadGL, watchContextLoss } from '../gl-lifecycle.js'
import { webglPool } from '../webgl-pool.js'
import { init, initWebGL, triggerFallback } from './switch-slider/init.js'
import { animate, renderCanvas2D, renderStatic, renderWebGL } from './switch-slider/render.js'

/**
 * Contextual WebGL Switch Slider for Developer Tools
 * Renders custom animated graphical draw elements referent to each toggle's context:
 * - 'stats': Live ECG oscilloscope waveform + pulsing chip matrix (Stats for Nerds)
 * - 'grid': Glowing blueprint column grid lines + scanning crosshairs (Show Grid)
 * - 'motion': Subtle ambient drift (OFF) vs calm still horizon datum (ON) (Reduced Motion)
 * All switches share an identical solid centered knob indicator dot.
 */
export class SwitchWebGL {
  canvas: HTMLCanvasElement
  contextType: string
  onToggle: ((_active: boolean) => void) | null
  isActive: boolean
  width: number
  height: number
  targetP: number
  currentP: number
  knobX: number
  useWebGL = false
  animId: number | null = null
  startTime: number
  dpr = 2
  gl: WebGLRenderingContext | null = null
  ctx: CanvasRenderingContext2D | null = null
  program: WebGLProgram | null = null
  quadBuffer: WebGLBuffer | null = null
  aPos = -1
  uContext: WebGLUniformLocation | null = null
  uKnobX: WebGLUniformLocation | null = null
  uProgress: WebGLUniformLocation | null = null
  uResolution: WebGLUniformLocation | null = null
  uTime: WebGLUniformLocation | null = null
  _onContextLost: EventListener | null = null
  _purged = false
  onClick: ((_e: MouseEvent) => void) | undefined

  constructor(
    canvas: HTMLCanvasElement,
    contextType: string = SWITCH_TYPES.STATS,
    initialActive = false,
    onToggle: ((_active: boolean) => void) | null = null
  ) {
    this.canvas = canvas

    this.contextType = contextType

    this.onToggle = onToggle

    this.isActive = Boolean(initialActive)

    // Fixed control geometry in CSS px — the shader works in these same
    // units (u_resolution = width/height), so all SDF distances below are
    // directly in pixels: track radius 14, knob radius 11.
    this.width = 54

    this.height = 28

    // Progress 0–1 drives knob X, track color mix, and animation amplitude
    // in the shader; currentP springs toward targetP at 0.18/frame.
    this.targetP = this.isActive ? 1.0 : 0.0

    this.currentP = this.targetP

    this.knobX = this._pToKnobX(this.currentP)

    this.useWebGL = false

    this.animId = null

    this.startTime = performance.now()

    this.init()
  }

  /**
   * Progress 0–1 → knob pixel X. The knob (radius 11) is inset 14px from
   * each end — exactly half the 28px track height — so it sits centered
   * inside the capsule's rounded caps at both extremes.
   * @param {number} p
   * @returns {number} CSS px
   */
  _pToKnobX(p: number): number {
    const minX = 14.0

    const maxX = this.width - 14.0

    return minX + (maxX - minX) * p
  }

  /**
   * Context → shader's u_context float id (0=stats, 1=grid/cyan/space,
   * 2=motion). The fragment shader branches on ranges (<0.5, <1.5, else)
   * so several visual aliases can share the grid animation.
   * @returns {number}
   */
  _contextCode(): number {
    if (
      this.contextType === SWITCH_TYPES.GRID ||
      this.contextType === SWITCH_TYPES.CYAN ||
      this.contextType === SWITCH_TYPES.SPACE
    )
      return 1.0

    if (this.contextType === SWITCH_TYPES.MOTION) return 2.0

    return 0.0 // stats
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

  /** Wires pointer/hover listeners that drive the widget's interactive state. */

  bindEvents(): void {
    this.onClick = (e: MouseEvent) => {
      e.stopPropagation()

      this.toggle()
    }

    this.canvas.addEventListener(MOUSE_EVENTS.CLICK, this.onClick)
  }

  /** Flips the switch and fires the onToggle callback. */

  toggle(): void {
    this.isActive = !this.isActive

    this.targetP = this.isActive ? 1.0 : 0.0

    this.onToggle?.(this.isActive)

    if (store.getters.getReducedMotion()) this._renderStatic()
  }

  /** Sets the knob position programmatically (animates the slide). */

  setActive(active: boolean): void {
    this.isActive = Boolean(active)

    this.targetP = this.isActive ? 1.0 : 0.0

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

  /** Per-frame Canvas2D fallback render — same visual language as the shader. */

  _renderCanvas2D(now: number): void {
    renderCanvas2D(this, now)
  }

  /**
   * webglPool hook — offscreen: stops the loop (GL or 2D) and force-loses
   * the GL context so offscreen widgets hold no context slots; restore()
   * rebuilds the GL program or re-acquires the 2D context on re-entry.
   */
  purge(): void {
    if (this._purged) return

    this._purged = true

    this.useWebGL = false

    this.ctx = null

    if (this.animId) {
      cancelAnimationFrame(this.animId)

      this.animId = null
    }

    releaseQuadGL(this.canvas, this, this._onContextLost)

    this._onContextLost = null
  }

  /** Recreates the GL context + program (or the 2D fallback) and resumes the loop after a purge. */
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
      this._onContextLost = watchContextLoss(this.canvas, () => this._triggerFallback())
    } else {
      try {
        this.ctx = this.canvas.getContext(WEBGL_STRINGS.CONTEXT_2D)
      } catch {
        this._triggerFallback()

        return
      }

      if (!this.ctx) {
        this._triggerFallback()

        return
      }
    }

    this.animate()
  }

  /** Releases the context, buffers, listeners and rAF handle so the canvas can be GC'd. */

  destroy(): void {
    webglPool.unregister(this.canvas)

    if (this.animId) cancelAnimationFrame(this.animId)

    if (this.onClick) this.canvas?.removeEventListener(MOUSE_EVENTS.CLICK, this.onClick)

    releaseQuadGL(this.canvas, this, this._onContextLost)

    this._onContextLost = null
  }
}
