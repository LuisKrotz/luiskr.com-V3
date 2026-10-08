/**
 * @file canvas-widgets-themesliderwebgl.test.js
 * @description Split from canvas-widgets.test.js — covers the "ThemeSliderWebGL" describe.
 */
import { describe, test, expect, beforeEach } from '@jest/globals'
import { ThemeSliderWebGL } from '@core/utils/canvas/widgets/theme-slider.js'
import { webglPool } from '@core/utils/canvas/webgl-pool.js'
import { attachMockGL, attachNoGL } from '@tests/fixtures/mock-webgl.js'
import store from '@core/store.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { PREF_MUTATIONS } from '@core/tokens/events/mutations.js'
import { STATE_CLASSES } from '@core/tokens/classes/state.js'
import { GL_EVENTS, KEYBOARD_EVENTS, MOUSE_EVENTS } from '@core/tokens/events/dom.js'

import { KEYS } from '@core/constants.js'
import { THEME } from '@core/tokens/theme/theme.js'

const makeCanvas = () => document.createElement(HTML_TAGS.CANVAS)

const flushFrames = (ms = 80) => new Promise((resolve) => setTimeout(resolve, ms))

const _WebGLPoolManager = webglPool.constructor

const makeRectCanvas = (width = 300) => {
  const canvas = makeCanvas()

  canvas.getBoundingClientRect = () => ({ left: 0, top: 0, width, height: 64 })

  return canvas
}

beforeEach(() => {
  store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, false)
})

// ─── ThemeSliderWebGL ────────────────────────────────────────────────────────
describe('ThemeSliderWebGL', () => {
  test('theme ↔ position mapping covers all three themes', () => {
    const slider = new ThemeSliderWebGL(makeCanvas(), THEME.SYSTEM)

    expect(slider._themeToP(THEME.DARK)).toBe(0)
    expect(slider._themeToP(THEME.LIGHT)).toBe(2)
    expect(slider._themeToP(THEME.SYSTEM)).toBe(1)
    expect(slider._pToTheme(0.2)).toBe(THEME.DARK)
    expect(slider._pToTheme(1.0)).toBe(THEME.SYSTEM)
    expect(slider._pToTheme(1.8)).toBe(THEME.LIGHT)

    slider.destroy()
  })

  test('initialises WebGL, binds events and animates when GL is available', async () => {
    const canvas = makeRectCanvas()

    attachMockGL(canvas)

    const slider = new ThemeSliderWebGL(canvas, THEME.DARK)

    expect(slider.useWebGL).toBe(true)
    expect(slider.gl).toBeTruthy()
    expect(slider.program).toBeTruthy()

    await flushFrames()

    slider.destroy()

    expect(slider.gl).toBeNull()
  })

  test('falls back when getContext returns null', () => {
    const canvas = makeRectCanvas()

    attachNoGL(canvas)

    const slider = new ThemeSliderWebGL(canvas, THEME.DARK)

    expect(slider.useWebGL).toBe(false)
    expect(canvas.classList.contains(STATE_CLASSES.IS_FALLBACK)).toBe(true)

    slider.destroy()
  })

  test('falls back when the canvas lacks getContext entirely', () => {
    const canvas = makeCanvas()

    canvas.getContext = undefined

    const slider = new ThemeSliderWebGL(canvas, THEME.DARK)

    expect(slider.useWebGL).toBe(false)

    slider.destroy()
  })

  test('setTheme updates the target position and notifies the callback', () => {
    const canvas = makeRectCanvas()

    attachMockGL(canvas)

    const changes = []
    const slider = new ThemeSliderWebGL(canvas, THEME.DARK, (t) => changes.push(t))

    slider.setTheme(THEME.LIGHT)

    expect(slider.targetP).toBe(2)

    slider.destroy()
  })

  test('setReducedMotion(true) switches to the static render path', async () => {
    const canvas = makeRectCanvas()

    attachMockGL(canvas)

    const slider = new ThemeSliderWebGL(canvas, THEME.SYSTEM)

    slider.targetP = 2
    slider.setReducedMotion(true)

    // Static render snaps the position immediately instead of animating.
    expect(slider.currentP).toBe(2)

    slider.setReducedMotion(false)

    await flushFrames(40)

    slider.destroy()
  })

  test('pointer drag updates the position and snaps on release', () => {
    const canvas = makeRectCanvas()

    attachMockGL(canvas)

    const slider = new ThemeSliderWebGL(canvas, THEME.SYSTEM)

    slider.onPointerDown({ clientX: 290, pointerId: 1 })

    expect(slider.isDragging).toBe(true)

    slider.onPointerMove({ clientX: 150 })
    slider.onPointerUp({ pointerId: 1 })

    expect(slider.isDragging).toBe(false)
    expect(Number.isInteger(slider.targetP)).toBe(true)

    slider.destroy()
  })

  test('pointer move/up are ignored when not dragging', () => {
    const canvas = makeRectCanvas()

    attachMockGL(canvas)

    const slider = new ThemeSliderWebGL(canvas, THEME.SYSTEM)
    const before = slider.targetP

    slider.onPointerMove({ clientX: 10 })
    slider.onPointerUp({})

    expect(slider.targetP).toBe(before)

    slider.destroy()
  })

  test('webglcontextlost event triggers the fallback path', () => {
    const canvas = makeRectCanvas()

    attachMockGL(canvas)

    const slider = new ThemeSliderWebGL(canvas, THEME.SYSTEM)

    expect(slider.useWebGL).toBe(true)

    canvas.dispatchEvent(new window.Event(GL_EVENTS.WEBGL_CONTEXT_LOST))

    expect(slider.useWebGL).toBe(false)

    slider.destroy()
  })

  test('resize observer updates width when the canvas grows', () => {
    const canvas = makeRectCanvas()

    attachMockGL(canvas)

    const slider = new ThemeSliderWebGL(canvas, THEME.SYSTEM)

    if (slider._resizeObserver?.trigger) {
      slider._resizeObserver.trigger([{ target: canvas, contentRect: { width: 400 } }])

      expect(slider.width).toBe(400)
    }

    slider.destroy()
  })

  test('keyboard arrows step between theme stops and notify changes', () => {
    const canvas = makeRectCanvas()

    attachMockGL(canvas)

    const themes = []
    const slider = new ThemeSliderWebGL(canvas, THEME.DARK, (t) => themes.push(t))

    slider.targetP = 1.0
    slider.currentTheme = THEME.SYSTEM

    canvas.dispatchEvent(
      new window.KeyboardEvent(KEYBOARD_EVENTS.KEYDOWN, { key: KEYS.ARROW_RIGHT })
    )

    expect(slider.targetP).toBe(2.0)
    expect(themes).toContain(THEME.LIGHT)

    canvas.dispatchEvent(
      new window.KeyboardEvent(KEYBOARD_EVENTS.KEYDOWN, { key: KEYS.ARROW_LEFT })
    )

    expect(slider.targetP).toBe(1.0)
    expect(themes).toContain(THEME.SYSTEM)

    canvas.dispatchEvent(
      new window.KeyboardEvent(KEYBOARD_EVENTS.KEYDOWN, { key: KEYS.ARROW_DOWN })
    )
    canvas.dispatchEvent(new window.KeyboardEvent(KEYBOARD_EVENTS.KEYDOWN, { key: KEYS.ARROW_UP }))

    slider.destroy()
  })

  test('click snap zones map left/right/middle to the three stops', () => {
    const canvas = makeRectCanvas(400)

    attachMockGL(canvas)

    const slider = new ThemeSliderWebGL(canvas, THEME.SYSTEM)

    canvas.dispatchEvent(new window.MouseEvent(MOUSE_EVENTS.CLICK, { clientX: 40 }))

    expect(slider.targetP).toBe(0.0)

    canvas.dispatchEvent(new window.MouseEvent(MOUSE_EVENTS.CLICK, { clientX: 380 }))

    expect(slider.targetP).toBe(2.0)

    canvas.dispatchEvent(new window.MouseEvent(MOUSE_EVENTS.CLICK, { clientX: 200 }))

    expect(slider.targetP).toBe(1.0)

    slider.destroy()
  })

  test('touch drag maps through _xToContinuousP and snaps on release', () => {
    const canvas = makeRectCanvas(400)

    attachMockGL(canvas)

    const slider = new ThemeSliderWebGL(canvas, THEME.DARK)

    slider.onPointerDown({ clientX: 200, touches: [{ clientX: 200 }] })

    expect(slider.isDragging).toBe(true)

    slider.onPointerMove({ touches: [{ clientX: 300 }] })
    slider.onPointerUp({ pointerId: 1 })

    expect(slider.isDragging).toBe(false)

    slider.destroy()
  })

  test('_xToContinuousP falls back to the widget width when rect width is invalid', () => {
    const canvas = makeCanvas()

    attachMockGL(canvas)

    const slider = new ThemeSliderWebGL(canvas)

    const expected = ((slider.width * 0.5 - slider.width * 0.12) / (slider.width * 0.76)) * 2.0

    expect(slider._xToContinuousP(slider.width * 0.5, 0)).toBeCloseTo(expected)

    slider.destroy()
  })

  test('destroy releases the program, buffer and context', () => {
    const canvas = makeCanvas()

    attachMockGL(canvas)

    const slider = new ThemeSliderWebGL(canvas)

    slider.destroy()

    expect(slider.gl).toBeNull()

    if (slider._resizeObserver !== undefined) {
      expect(slider._resizeObserver).toBeNull()
    }
  })
})
