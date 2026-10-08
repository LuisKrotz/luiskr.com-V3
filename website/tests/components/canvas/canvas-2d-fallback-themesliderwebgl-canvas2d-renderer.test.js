/**
 * @file canvas-2d-fallback-themesliderwebgl-canvas2d-renderer.test.js
 * @description Split from canvas-2d-fallback.test.js — covers the "ThemeSliderWebGL — Canvas2D renderer" describe.
 */
import { describe, test, expect, beforeEach } from '@jest/globals'
import { ThemeSliderWebGL } from '@core/utils/canvas/widgets/theme-slider.js'
import { attachMockGL, createMock2D } from '@tests/fixtures/mock-webgl.js'
import store from '@core/store.js'
import { THEME } from '@core/constants.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { PREF_MUTATIONS } from '@core/tokens/events/mutations.js'

const makeCanvas = () => document.createElement(HTML_TAGS.CANVAS)
const _flushFrames = (ms = 80) => new Promise((resolve) => setTimeout(resolve, ms))

beforeEach(() => {
  store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, false)
})

// ─── ThemeSliderWebGL 2D path ────────────────────────────────────────────────
describe('ThemeSliderWebGL — Canvas2D renderer', () => {
  test('_renderCanvas2D draws via an assigned 2D context', () => {
    const canvas = makeCanvas()

    attachMockGL(canvas)

    const slider = new ThemeSliderWebGL(canvas, THEME.SYSTEM)

    slider.ctx = createMock2D()

    expect(() => slider._renderCanvas2D()).not.toThrow()

    slider.destroy()
  })

  test('_renderStatic prefers the 2D context when WebGL is off', () => {
    const canvas = makeCanvas()

    attachMockGL(canvas)

    const slider = new ThemeSliderWebGL(canvas, THEME.DARK)

    slider.useWebGL = false
    slider.ctx = createMock2D()
    slider.targetP = 2
    slider._renderStatic()

    expect(slider.currentP).toBe(2)

    slider.destroy()
  })
})
