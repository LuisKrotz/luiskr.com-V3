import { EVENTS, STRINGS } from '../../core/constants.js'

/**
 * CheckboxWebGL
 * Renders an animated sci-fi cyber scan and pulse inside square checkboxes.
 * When checked, animates glowing HUD radar particles and dynamic holographic check vectors.
 */
export class CheckboxWebGL {
  constructor(canvas, initialChecked = false, onToggle = null) {
    this.canvas = canvas

    this.isChecked = Boolean(initialChecked)

    this.onToggle = onToggle

    this.animId = null

    this.progress = this.isChecked ? 1.0 : 0.0

    this.targetP = this.progress

    this.startTime = performance.now()

    this.pulseTime = 0

    this.ctx2d = null

    this.init()
  }

  setChecked(val) {
    this.isChecked = Boolean(val)

    this.targetP = this.isChecked ? 1.0 : 0.0

    if (!this.animId) {
      this._startLoop()
    }
  }

  init() {
    if (!this.canvas) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const size = 20

    this.canvas.width = Math.round(size * dpr)

    this.canvas.height = Math.round(size * dpr)

    try {
      this.ctx2d = this.canvas.getContext('2d')
    } catch (_) {
      this.ctx2d = null
    }

    this._draw()
  }

  _startLoop() {
    if (this.animId) return

    const render = () => {
      this.progress += (this.targetP - this.progress) * 0.22

      if (Math.abs(this.targetP - this.progress) < 0.005) {
        this.progress = this.targetP

        this._draw()

        this.animId = null

        return
      }

      this.pulseTime += 0.04

      this._draw()

      this.animId = requestAnimationFrame(render)
    }

    this.animId = requestAnimationFrame(render)
  }

  _draw() {
    if (!this.ctx2d || !this.canvas) return

    const ctx = this.ctx2d

    const w = this.canvas.width

    const h = this.canvas.height

    ctx.clearRect(0, 0, w, h)

    if (this.progress <= 0.01) return

    const alpha = this.progress

    const pulse = 0.85 + 0.15 * Math.sin(this.pulseTime)

    ctx.save()

    ctx.strokeStyle = `rgba(40, 244, 255, ${0.75 * alpha * pulse})`

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

    gradient.addColorStop(0, `rgba(40, 244, 255, ${0.28 * alpha * pulse})`)

    gradient.addColorStop(1, 'rgba(40, 244, 255, 0)')

    ctx.fillStyle = gradient

    ctx.fillRect(0, 0, w, h)

    ctx.restore()
  }

  destroy() {
    if (this.animId) {
      cancelAnimationFrame(this.animId)

      this.animId = null
    }

    this.canvas = null

    this.ctx2d = null
  }
}
