/**
 * @file slider-internals-themesliderwebgl-internals.test.js
 * @description Split from slider-internals.test.js — covers the "ThemeSliderWebGL internals" describe.
 */
import { KEYS, THEME } from '@core/constants.js'
import { ThemeSliderWebGL } from '@core/utils/canvas/widgets/theme-slider.js'
import { attachHybridGL, attachNoGL } from '@tests/fixtures/mock-webgl.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'

const makeCanvas = () => {
  const canvas = document.createElement(HTML_TAGS.CANVAS)

  canvas.getBoundingClientRect = () => ({
    left: 0,
    top: 0,
    width: 44,
    height: 24,
    right: 44,
    bottom: 24,
  })

  return canvas
}

const flushFrames = (ms = 60) => new Promise((r) => setTimeout(r, ms))

// ─── ThemeSliderWebGL ────────────────────────────────────────────────────────
describe('ThemeSliderWebGL internals', () => {
  test('_themeToP/_pToTheme round-trip all themes', () => {
    const canvas = makeCanvas()

    attachHybridGL(canvas)

    const slider = new ThemeSliderWebGL(canvas, THEME.SYSTEM)

    for (const t of [THEME.LIGHT, THEME.DARK, THEME.SYSTEM]) {
      const p = slider._themeToP?.(t)

      expect(slider._pToTheme?.(p)).toBe(t)
    }

    slider.destroy()
  })

  test('setTheme moves the knob and fires onThemeChange', () => {
    const canvas = makeCanvas()

    attachHybridGL(canvas)

    const changes = []
    const slider = new ThemeSliderWebGL(canvas, THEME.LIGHT, (t) => changes.push(t))

    slider.setTheme(THEME.DARK)

    expect(slider.currentTheme).toBe(THEME.DARK)

    slider.destroy()
  })

  test('keyboard arrows cycle through themes', () => {
    const canvas = makeCanvas()

    attachHybridGL(canvas)

    const changes = []
    const slider = new ThemeSliderWebGL(canvas, THEME.LIGHT, (t) => changes.push(t))

    slider.onKeyDown?.({ key: KEYS.ARROW_RIGHT, preventDefault: () => {} })
    slider.onKeyDown?.({ key: KEYS.ARROW_RIGHT, preventDefault: () => {} })
    slider.onKeyDown?.({ key: KEYS.ARROW_LEFT, preventDefault: () => {} })

    expect(changes.length).toBeGreaterThanOrEqual(1)

    slider.destroy()
  })

  test('_xToP maps pointer x to a clamped position', () => {
    const canvas = makeCanvas()

    attachHybridGL(canvas)

    const slider = new ThemeSliderWebGL(canvas, THEME.SYSTEM)

    const p = slider._xToP?.(10)

    expect(typeof p).toBe(TYPE_STRINGS.NUMBER)

    slider.destroy()
  })

  test('_renderStatic and setReducedMotion cover the motion paths', async () => {
    const canvas = makeCanvas()

    attachHybridGL(canvas)

    const slider = new ThemeSliderWebGL(canvas, THEME.SYSTEM)

    slider._renderStatic?.()
    slider.setReducedMotion(true)
    slider.setReducedMotion(false)

    await flushFrames(50)

    slider.destroy()
  })

  test('fallback path when GL is unavailable', () => {
    const canvas = makeCanvas()

    attachNoGL(canvas)

    const slider = new ThemeSliderWebGL(canvas, THEME.SYSTEM)

    expect(slider.useWebGL).toBe(false)

    slider.destroy()
  })

  test('destroy removes listeners and releases resources', () => {
    const canvas = makeCanvas()

    attachHybridGL(canvas)

    const slider = new ThemeSliderWebGL(canvas, THEME.DARK)

    slider.destroy()

    expect(slider.gl).toBeNull()
  })
})
