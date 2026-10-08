/**
 * @file switch-slider-paint-2d.ts
 * @description Canvas2D renderer for SwitchSliderWebGL, extracted from
 * switch-slider.ts — same scene as the WebGL shader, painted with 2D calls
 * when a GL context is unavailable or fails.
 */
import { SWITCH_TYPES } from '@core/tokens/theme/switches.js'

/** Everything the 2D paint pass needs from the slider instance. */
export interface SwitchSliderPaintState {
  dpr: number
  width: number
  height: number
  currentP: number
  startTime: number
  knobX: number
  contextType: string
  canvasWidth: number
  canvasHeight: number
}

/**
 * paints switch slider2 d.
 */
export function paintSwitchSlider2D(
  ctx: CanvasRenderingContext2D | null | undefined,
  state: SwitchSliderPaintState,
  now: number
): void {
  if (!ctx) return

  const dpr = state.dpr || 2

  const w = state.width

  const h = state.height

  const p = state.currentP

  const t = (now - state.startTime) * 0.001

  ctx.save()

  ctx.clearRect(0, 0, state.canvasWidth, state.canvasHeight)

  ctx.scale(dpr, dpr)

  ctx.imageSmoothingEnabled = true

  ctx.imageSmoothingQuality = 'high'

  // Capsule pill track clip
  ctx.beginPath()

  ctx.arc(14, 14, 14, Math.PI * 0.5, Math.PI * 1.5)

  ctx.lineTo(w - 14, 0)

  ctx.arc(w - 14, 14, 14, Math.PI * 1.5, Math.PI * 0.5)

  ctx.closePath()

  ctx.clip()

  // ── Track Background Color ──
  const offColor = [16, 19, 26]

  let onColor = [16, 185, 129] // Emerald (Stats)

  if (state.contextType === SWITCH_TYPES.GRID) onColor = [0, 220, 255] // Electric Cyan (Grid)

  if (state.contextType === SWITCH_TYPES.MOTION) onColor = [168, 85, 247] // Electric Violet (Motion)

  const rCol = Math.round(offColor[0] + (onColor[0] - offColor[0]) * p)

  const gCol = Math.round(offColor[1] + (onColor[1] - offColor[1]) * p)

  const bCol = Math.round(offColor[2] + (onColor[2] - offColor[2]) * p)

  ctx.fillStyle = `rgb(${rCol}, ${gCol}, ${bCol})`

  ctx.fillRect(0, 0, w, h)

  // ── Contextual Animations ──
  if (state.contextType === SWITCH_TYPES.STATS) {
    // Live ECG heartbeat pulse wave with high contrast
    ctx.save()

    ctx.beginPath()

    for (let x = 4; x <= w - 4; x += 1.5) {
      const waveX = x + t * 24.0

      let pulse = Math.sin(waveX * 0.35) * 2.2

      const spikePhase = waveX % 36.0

      if (spikePhase > 12.0 && spikePhase < 18.0) {
        pulse += (spikePhase - 15.0) * -2.8
      }

      const waveY = 14.0 + pulse * (0.3 + 0.7 * p)

      if (x === 4) ctx.moveTo(x, waveY)
      else ctx.lineTo(x, waveY)
    }

    ctx.strokeStyle = p > 0.5 ? '#ffffff' : 'rgba(102, 252, 241, 0.95)'

    ctx.lineWidth = 1.6

    ctx.stroke()

    ctx.restore()
  } else if (state.contextType === SWITCH_TYPES.GRID) {
    // Blueprint grid columns & crosshairs with high contrast
    ctx.save()

    ctx.strokeStyle = p > 0.5 ? '#ffffff' : 'rgba(0, 229, 255, 0.9)'

    ctx.lineWidth = 1.3

    const gridOffset = (t * 5.0) % 8.0

    for (let gx = 6 + gridOffset; gx < w - 6; gx += 8.0) {
      ctx.beginPath()

      ctx.moveTo(gx, 4)

      ctx.lineTo(gx, h - 4)

      ctx.stroke()
    }

    ctx.beginPath()

    ctx.moveTo(6, 14)

    ctx.lineTo(w - 6, 14)

    ctx.stroke()

    ctx.restore()
  } else {
    // Reduced motion: subtle drift (off) vs calm still horizon (on) with high contrast
    ctx.save()

    if (p < 0.5) {
      const streamX = (t * 12.0) % 24.0

      ctx.strokeStyle = 'rgba(216, 180, 254, 0.95)'

      ctx.lineWidth = 1.5

      ctx.beginPath()

      ctx.moveTo(6 + streamX, 10)

      ctx.lineTo(16 + streamX, 10)

      ctx.moveTo(22 - streamX, 18)

      ctx.lineTo(32 - streamX, 18)

      ctx.stroke()
    } else {
      ctx.strokeStyle = '#ffffff'

      ctx.lineWidth = 1.6

      ctx.beginPath()

      ctx.moveTo(8, 14)

      ctx.lineTo(w - 8, 14)

      ctx.stroke()
    }

    ctx.restore()
  }

  // Inset track bezel shadow
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)'

  ctx.lineWidth = 1.5

  ctx.stroke()

  // ── 3D Sliding Knob ──
  const kx = state.knobX

  // Drop shadow
  ctx.save()

  ctx.beginPath()

  ctx.arc(kx, 14.5, 11, 0, Math.PI * 2)

  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)'

  ctx.fill()

  // Knob sphere
  ctx.beginPath()

  ctx.arc(kx, 14, 11, 0, Math.PI * 2)

  const knobGrad = ctx.createRadialGradient(kx - 3, 11, 1, kx, 14, 11)

  knobGrad.addColorStop(0, '#ffffff')

  knobGrad.addColorStop(1, '#e2e8f0')

  ctx.fillStyle = knobGrad

  ctx.fill()

  // Unified solid center dot with bright accent
  let dotColor = 'rgb(16, 185, 129)'

  if (state.contextType === SWITCH_TYPES.GRID) dotColor = 'rgb(0, 220, 255)'

  if (state.contextType === SWITCH_TYPES.MOTION) dotColor = 'rgb(168, 85, 247)'

  ctx.beginPath()

  ctx.arc(kx, 14, 2.8, 0, Math.PI * 2)

  ctx.fillStyle = p > 0.5 ? dotColor : 'rgb(102, 252, 241)'

  ctx.fill()

  ctx.restore()

  // High contrast crisp outer border
  ctx.beginPath()

  ctx.arc(14, 14, 13.5, Math.PI * 0.5, Math.PI * 1.5)

  ctx.lineTo(w - 14, 0.5)

  ctx.arc(w - 14, 14, 13.5, Math.PI * 1.5, Math.PI * 0.5)

  ctx.closePath()

  ctx.strokeStyle =
    p > 0.5 ? `rgba(${onColor[0]}, ${onColor[1]}, ${onColor[2]}, 0.9)` : 'rgba(255, 255, 255, 0.32)'

  ctx.lineWidth = 1.2

  ctx.stroke()

  ctx.restore()
}
