/**
 * @file checkbox-webgl.js
 * @description Canvas checkbox widget for the playground controls panel.
 * Despite the name it renders via Canvas 2D (not WebGL) — cheap enough for
 * a 20px control. Checked state draws accent corner ticks + a pulsing radial
 * "scan" glow; checking animates in with a spring-lerp fade, and the rAF
 * loop self-terminates once the animation settles (no idle GPU/CPU burn).
 * Ink is sampled from --color-accent-contrast (falling back to
 * --text-primary) so the tick reads on both dark and light themes.
 */

import { THEME_CSS_PROPS } from '@/core/tokens/css/theme.js'
import { parseCssColor } from '@/utils/canvas/css-color.js'

/** Canvas-2D checkbox widget — see file header for the render/loop design. */
export class CheckboxWebGL {
  canvas: HTMLCanvasElement | null
  isChecked: boolean
  onToggle: ((_checked: boolean) => void) | null
  animId: number | null // rAF handle — null means the loop is stopped
  progress: number // eased value (0=unchecked → 1=checked)
  targetP: number // lerp destination; setChecked flips this
  startTime: number
  pulseTime = 0 // phase accumulator for the glow's sin() breathing
  ctx2d: CanvasRenderingContext2D | null = null
  _ink: string | null = null // "r, g, b" channels of the sampled accent ink

  constructor(
    canvas: HTMLCanvasElement,
    initialChecked = false,
    onToggle: ((_checked: boolean) => void) | null = null
  ) {
    this.canvas = canvas

    this.isChecked = Boolean(initialChecked)

    this.onToggle = onToggle

    this.animId = null

    this.progress = this.isChecked ? 1.0 : 0.0

    this.targetP = this.progress

    this.startTime = performance.now()

    this.init()
  }

  /** Sets the checked state (animates the transition). */

  setChecked(val: boolean): void {
    this.isChecked = Boolean(val)

    this.targetP = this.isChecked ? 1.0 : 0.0

    this._sampleInk()

    if (!this.animId) {
      this._startLoop()
    }
  }

  /**
   * Reads the accent ink once per state change. --color-accent-contrast is
   * the theme-aware control accent (bright cyan on dark, deep teal on
   * light); --text-primary is the last-resort ink so a missing theme never
   * leaves the tick invisible. Stored as channel text for rgba() strings.
   */
  private _sampleInk(): void {
    if (!this.canvas) return

    const cs = getComputedStyle(this.canvas)

    const parsed =
      parseCssColor(cs.getPropertyValue(THEME_CSS_PROPS.COLOR_ACCENT_CONTRAST)) ||
      parseCssColor(cs.getPropertyValue(THEME_CSS_PROPS.TEXT_PRIMARY))

    this._ink = parsed
      ? `${Math.round(parsed[0] * 255)}, ${Math.round(parsed[1] * 255)}, ${Math.round(parsed[2] * 255)}`
      : null
  }

  /**
   * Sizes the backing store to 20 CSS px × devicePixelRatio (capped at 2× —
   * beyond that the extra pixels are invisible on a 20px control) and
   * acquires the 2D context. A failed context just leaves the box empty;
   * the label still communicates state.
   */
  init(): void {
    if (!this.canvas) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const size = 20

    this.canvas.width = Math.round(size * dpr)

    this.canvas.height = Math.round(size * dpr)

    try {
      this.ctx2d = this.canvas.getContext('2d')
    } catch {
      this.ctx2d = null
    }

    this._sampleInk()

    this._draw()
  }

  /**
   * Animation loop with exponential-approach easing: each frame closes 22%
   * of the gap to the target (fast start, asymptotic landing — a cheap
   * spring feel without a physics solver). Settles within 0.005 → snaps to
   * target, draws once, and the loop exits — zero frames burned while idle.
   * pulseTime advances 0.04/frame ≈ one full sin() cycle every ~157 frames
   * (~2.6s at 60fps) for the glow breathing.
   */
  private _startLoop(): void {
    if (this.animId) return

    this.animId = requestAnimationFrame(() => this._renderTick())
  }

  /** One animation frame: ease progress toward target, settle or re-arm. */
  private _renderTick(): void {
    this.progress += (this.targetP - this.progress) * 0.22

    if (Math.abs(this.targetP - this.progress) < 0.005) {
      this.progress = this.targetP

      this._draw()

      this.animId = null

      return
    }

    this.pulseTime += 0.04

    this._draw()

    this.animId = requestAnimationFrame(() => this._renderTick())
  }

  /** Renders one frame of the checkbox HUD animation. */

  private _draw(): void {
    if (!this.ctx2d || !this.canvas) return

    const ctx = this.ctx2d

    const w = this.canvas.width

    const h = this.canvas.height

    ctx.clearRect(0, 0, w, h)

    if (this.progress <= 0.01 || !this._ink) return // unchecked → empty box (border comes from CSS)

    const alpha = this.progress

    // Glow breathes 0.70–1.00 — a subtle HUD throb, not a strobe
    const pulse = 0.85 + 0.15 * Math.sin(this.pulseTime)

    ctx.save()

    ctx.strokeStyle = `rgba(${this._ink}, ${0.75 * alpha * pulse})`

    ctx.lineWidth = 1.5

    const tick = w * 0.25

    // Top-left tick
    ctx.beginPath()

    ctx.moveTo(2, 2 + tick)

    ctx.lineTo(2, 2)

    ctx.lineTo(2 + tick, 2)

    ctx.stroke()

    // Bottom-right tick
    ctx.beginPath()

    ctx.moveTo(w - 2, h - 2 - tick)

    ctx.lineTo(w - 2, h - 2)

    ctx.lineTo(w - 2 - tick, h - 2)

    ctx.stroke()

    // Glowing core scan when active
    const gradient = ctx.createRadialGradient(w * 0.5, h * 0.5, 0, w * 0.5, h * 0.5, w * 0.45)

    gradient.addColorStop(0, `rgba(${this._ink}, ${0.28 * alpha * pulse})`)

    gradient.addColorStop(1, `rgba(${this._ink}, 0)`)

    ctx.fillStyle = gradient

    ctx.fillRect(0, 0, w, h)

    ctx.restore()
  }

  /** Stops the loop and releases the canvas resources. */

  destroy(): void {
    if (this.animId) {
      cancelAnimationFrame(this.animId)

      this.animId = null
    }

    this.canvas = null

    this.ctx2d = null
  }
}
