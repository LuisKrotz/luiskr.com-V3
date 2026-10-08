/**
 * @file theme-slider-paint-2d.ts
 * @description Canvas2D fallback renderer for ThemeSliderWebGL, extracted
 * from theme-slider.ts. Dormant defensive path — the primary fallback is
 * the CSS class on the wrapper, but a caller that supplies a 2d context
 * still gets a sensible scene.
 */
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'

/** Everything the 2D paint pass needs from the slider instance. */
export interface ThemeSliderPaintState {
  width: number
  height: number
  currentP: number
  knobX: number
  startTime: number
}

/**
 * paints theme slider2 d.
 */
export function paintThemeSlider2D(
  ctx: CanvasRenderingContext2D | null | undefined,
  state: ThemeSliderPaintState
): void {
  if (!ctx) return

  const w = state.width

  const h = state.height

  const p = state.currentP

  const dpr = Math.min(
    (typeof window !== TYPE_STRINGS.UNDEFINED ? window.devicePixelRatio : 1) || 1,
    2
  )

  ctx.save()

  ctx.scale(dpr, dpr)

  ctx.clearRect(0, 0, w, h)

  ctx.beginPath()

  if (typeof ctx.roundRect === TYPE_STRINGS.FUNCTION) {
    ctx.roundRect(0, 0, w, h, 42)
  } else {
    ctx.arc(42, 42, 42, Math.PI * 0.5, Math.PI * 1.5)

    ctx.lineTo(w - 42, 0)

    ctx.arc(w - 42, 42, 42, Math.PI * 1.5, Math.PI * 0.5)

    ctx.closePath()
  }

  ctx.clip()

  // Sky gradient
  const skyGrad = ctx.createLinearGradient(0, 0, 0, h)

  if (p <= 1.0) {
    skyGrad.addColorStop(0, 'rgb(112, 92, 173)')

    skyGrad.addColorStop(1, 'rgb(153, 97, 133)')
  } else {
    skyGrad.addColorStop(0, 'rgb(184, 122, 158)')

    skyGrad.addColorStop(1, 'rgb(250, 163, 128)')
  }

  ctx.fillStyle = skyGrad

  ctx.fillRect(0, 0, w, h)

  const time = (performance.now() - state.startTime) * 0.001

  // Sun rings on left with rotating rays and breathing corona
  if (p > 0.4) {
    const sunAlpha = Math.min(1.0, (p - 0.4) / 0.8)
    const pulse = Math.sin(time * 2.8) * 2.5

    ctx.save()
    ctx.globalAlpha = sunAlpha

    // Rotating sun rays
    ctx.save()
    ctx.translate(68, 52)
    ctx.rotate(time * 0.4)
    ctx.fillStyle = 'rgba(252, 227, 186, 0.16)'
    for (let i = 0; i < 8; i++) {
      ctx.rotate(Math.PI / 4)
      ctx.beginPath()
      ctx.moveTo(-3, -42)
      ctx.lineTo(3, -42)
      ctx.lineTo(0, -20)
      ctx.closePath()
      ctx.fill()
    }
    ctx.restore()

    ctx.fillStyle = 'rgba(252, 227, 186, 0.25)'
    ctx.beginPath()
    ctx.arc(68, 52, 38 + pulse, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = 'rgba(252, 227, 186, 0.4)'
    ctx.beginPath()
    ctx.arc(68, 52, 24 + pulse * 0.5, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = 'rgb(252, 237, 201)'
    ctx.beginPath()
    ctx.arc(68, 52, 14, 0, Math.PI * 2)
    ctx.fill()

    ctx.restore()
  }

  // System mode twilight auroral wave
  const sysFactor = 1.0 - Math.min(1.0, Math.abs(p - 1.0) * 1.6)
  if (sysFactor > 0.01) {
    ctx.save()
    ctx.globalAlpha = sysFactor * 0.4
    const auroraGrad = ctx.createLinearGradient(0, 10, w, 40)
    auroraGrad.addColorStop(0, 'rgba(97, 199, 235, 0.35)')
    auroraGrad.addColorStop(0.5, 'rgba(217, 115, 204, 0.45)')
    auroraGrad.addColorStop(1, 'rgba(97, 199, 235, 0.35)')
    ctx.fillStyle = auroraGrad
    ctx.beginPath()
    ctx.moveTo(0, 20 + Math.sin(time * 1.5) * 6)
    ctx.bezierCurveTo(
      w * 0.33,
      10 + Math.sin(time * 1.8 + 1) * 8,
      w * 0.66,
      30 + Math.sin(time * 1.4 + 2) * 8,
      w,
      20 + Math.sin(time * 1.6) * 6
    )
    ctx.lineTo(w, 45)
    ctx.lineTo(0, 45)
    ctx.closePath()
    ctx.fill()
    ctx.restore()
  }

  // Canyon Mesas
  ctx.fillStyle = p <= 1.0 ? 'rgb(87, 41, 125)' : 'rgb(194, 76, 102)'

  ctx.beginPath()

  ctx.moveTo(0, h)

  ctx.lineTo(0, 48)

  ctx.lineTo(80, 52)

  ctx.lineTo(130, 36)

  ctx.lineTo(190, 42)

  ctx.lineTo(w, 48)

  ctx.lineTo(w, h)

  ctx.closePath()

  ctx.fill()

  // Front dunes
  ctx.fillStyle = p <= 1.0 ? 'rgb(107, 56, 148)' : 'rgb(217, 102, 122)'

  ctx.beginPath()

  ctx.moveTo(0, h)

  ctx.lineTo(0, 68)

  ctx.bezierCurveTo(70, 58, 140, 72, 200, 60)

  ctx.bezierCurveTo(240, 52, 260, 65, w, 62)

  ctx.lineTo(w, h)

  ctx.closePath()

  ctx.fill()

  // 3D Knob
  const kx = state.knobX

  ctx.save()

  ctx.shadowColor = 'rgba(0, 0, 0, 0.4)'

  ctx.shadowBlur = 10

  ctx.shadowOffsetX = 0

  ctx.shadowOffsetY = 4

  ctx.fillStyle =
    p < 0.5 ? 'rgb(245, 245, 252)' : p > 1.5 ? 'rgb(252, 227, 186)' : 'rgb(250, 240, 230)'

  ctx.beginPath()

  ctx.arc(kx, 42, 34, 0, Math.PI * 2)

  ctx.fill()

  ctx.restore()

  // Moon craters in dark mode
  if (p < 0.6) {
    ctx.fillStyle = 'rgba(215, 218, 230, 0.7)'

    ctx.beginPath()

    ctx.arc(kx - 11, 32, 6, 0, Math.PI * 2)

    ctx.arc(kx - 9, 51, 4.5, 0, Math.PI * 2)

    ctx.arc(kx + 10, 48, 3.5, 0, Math.PI * 2)

    ctx.arc(kx + 8, 33, 5, 0, Math.PI * 2)

    ctx.fill()
  }

  ctx.restore()
}
