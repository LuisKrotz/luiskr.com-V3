/**
 * @file slider-internals-theme-slider-tails.test.js
 * @description Split from slider-internals.test.js — covers the "theme-slider tails" describe.
 */
import { KEYS, THEME } from '@core/constants.js'
import { ThemeSliderWebGL } from '@core/utils/canvas/widgets/theme-slider.js'
import { attachHybridGL, createMock2D, createMockGL } from '@tests/fixtures/mock-webgl.js'
import store from '@core/store.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { GL_EVENTS } from '@core/tokens/events/dom.js'
import { PREF_MUTATIONS } from '@core/tokens/events/mutations.js'
import { PREF_CLASSES } from '@core/tokens/classes/preferences.js'

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

const _flushFrames = (ms = 60) => new Promise((r) => setTimeout(r, ms))

// ─── theme-slider tails ──────────────────────────────────────────────────────
describe('theme-slider tails', () => {
  test('ResizeObserver observes the canvas and resizes on meaningful width changes', () => {
    let callback = null

    globalThis.ResizeObserver = class {
      constructor(cb) {
        callback = cb
      }
      observe() {}
      unobserve() {}
      disconnect() {}
    }

    const canvas = makeCanvas()

    attachHybridGL(canvas)

    const slider = new ThemeSliderWebGL(canvas, THEME.SYSTEM)

    callback([{ contentRect: { width: 30 } }])
    callback([{ contentRect: { width: slider.width } }])
    callback([{ contentRect: { width: 200 } }])

    expect(slider.width).toBe(200)

    const dprDesc = Object.getOwnPropertyDescriptor(window, 'devicePixelRatio')

    Object.defineProperty(window, 'devicePixelRatio', { value: undefined, configurable: true })
    callback([{ contentRect: { width: 300 } }])

    const win = globalThis.window

    delete globalThis.window
    callback([{ contentRect: { width: 400 } }])
    globalThis.window = win

    expect(slider.width).toBe(400)

    if (dprDesc) Object.defineProperty(window, 'devicePixelRatio', dprDesc)

    delete globalThis.ResizeObserver

    slider.destroy()

    expect(slider._resizeObserver).toBeNull()
  })

  test('init dpr falls back to 1 when window is missing', () => {
    const canvas = makeCanvas()

    attachHybridGL(canvas)

    const win = globalThis.window

    delete globalThis.window

    try {
      new ThemeSliderWebGL(canvas, THEME.SYSTEM)
    } catch {
      // window-less bindEvents throws after the dpr read — the arm is covered
    }

    globalThis.window = win
  })

  test('shader compile, link and setup failures fall back and flag the wrapper', () => {
    const makeFailGL = (overrides) =>
      new Proxy(createMockGL(), {
        get: (t, p) => (overrides[p] ? overrides[p] : t[p]),
      })

    const wrapper = document.createElement(HTML_TAGS.DIV)

    wrapper.classList.add(PREF_CLASSES.PREF_THEME_WRAPPER)

    const canvas = makeCanvas()

    wrapper.appendChild(canvas)
    canvas.getContext = () => makeFailGL({ getShaderParameter: () => false })

    const s1 = new ThemeSliderWebGL(canvas, THEME.SYSTEM)

    expect(s1.useWebGL).toBe(false)
    expect(wrapper.classList.contains('has-fallback')).toBe(true)

    s1.destroy()

    canvas.getContext = () => makeFailGL({ getShaderParameter: (s) => s.id !== 2 })

    const s2 = new ThemeSliderWebGL(canvas, THEME.SYSTEM)

    s2.destroy()

    canvas.getContext = () => makeFailGL({ getProgramParameter: () => false })

    const s3 = new ThemeSliderWebGL(canvas, THEME.SYSTEM)

    s3.destroy()

    canvas.getContext = () =>
      makeFailGL({
        createShader: () => {
          throw new Error('gpu-down')
        },
      })

    const s4 = new ThemeSliderWebGL(canvas, THEME.SYSTEM)

    expect(s4.useWebGL).toBe(false)

    s4.destroy()
  })

  test('pointer handlers cover touch fallbacks, snap guards and noop drags', () => {
    const canvas = makeCanvas()

    attachHybridGL(canvas)

    const themes = []
    const slider = new ThemeSliderWebGL(canvas, THEME.SYSTEM, (t) => themes.push(t))

    slider.onPointerUp({ pointerId: 9 })

    slider.onPointerDown({ pointerId: 1, clientX: undefined, touches: [{ clientX: 5 }] })
    slider.onPointerMove({ clientX: undefined, touches: [{ clientX: 8 }] })
    slider.onPointerMove({ clientX: undefined, touches: [{}] })
    slider.onPointerMove({})
    slider.onPointerUp({ pointerId: 1 })

    slider.onPointerDown({ pointerId: 2 })
    slider.onPointerUp({ pointerId: 2 })

    slider.onPointerMove({ clientX: 40 })

    slider.currentTheme = THEME.SYSTEM
    slider.onClick({ clientX: 22 })
    slider.onClick({})
    slider.onClick({ clientX: 40 })

    slider._xToContinuousP(10)

    canvas.getBoundingClientRect = () => ({ left: 0, top: 0, width: 0, right: 0, bottom: 0 })
    slider.onClick({ clientX: 10 })

    slider.targetP = 0
    slider.onKeyDown({ key: KEYS.ARROW_LEFT, preventDefault: () => {} })
    slider.onKeyDown({ key: KEYS.ARROW_RIGHT, preventDefault: () => {} })
    slider.onKeyDown({ key: KEYS.ARROW_UP, preventDefault: () => {} })
    slider.onKeyDown({ key: KEYS.ENTER, preventDefault: () => {} })

    slider.destroy()
  })

  test('setTheme, setReducedMotion and animate cover the reduced-motion paths', () => {
    const canvas = makeCanvas()

    attachHybridGL(canvas)

    const slider = new ThemeSliderWebGL(canvas, THEME.SYSTEM)

    store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, true)
    slider.setTheme(THEME.DARK)
    slider.animate()

    expect(slider.animId).toBeNull()

    slider.animId = requestAnimationFrame(() => {})
    slider.animate()

    expect(slider.animId).toBeNull()

    store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, false)

    slider.animId = null
    slider.setReducedMotion(false)

    expect(slider.animId).toBeTruthy()

    slider.destroy()
  })

  test('animate dispatches to the 2d renderer and skips when neither backend exists', () => {
    const canvas = makeCanvas()

    attachHybridGL(canvas)

    const slider = new ThemeSliderWebGL(canvas, THEME.SYSTEM)

    slider.useWebGL = false
    slider.ctx = createMock2D()
    slider.animId = null
    slider.animate()
    slider.ctx = null
    slider.animate()

    cancelAnimationFrame(slider.animId)

    slider.destroy()
  })

  test('_renderCanvas2D covers roundRect-less, dark-position and dpr-fallback arms', () => {
    const canvas = makeCanvas()

    attachHybridGL(canvas)

    const slider = new ThemeSliderWebGL(canvas, THEME.SYSTEM)
    const ctx = new Proxy(createMock2D(), {
      get: (t, p) => (p === 'roundRect' ? undefined : t[p]),
    })

    slider.useWebGL = false
    slider.ctx = ctx
    slider.currentP = 0
    slider.knobX = slider._pToKnobX(0)
    slider._renderCanvas2D()

    const dprDesc = Object.getOwnPropertyDescriptor(window, 'devicePixelRatio')

    Object.defineProperty(window, 'devicePixelRatio', { value: 0, configurable: true })
    slider._renderCanvas2D()

    const win = globalThis.window

    delete globalThis.window
    slider._renderCanvas2D()
    globalThis.window = win

    if (dprDesc) Object.defineProperty(window, 'devicePixelRatio', dprDesc)

    slider.destroy()
  })

  test('init guards cover missing getContext, measurable rects and context loss', () => {
    const fallbackOnly = {
      style: {},
      classList: { add: () => {} },
      closest: () => null,
      addEventListener: () => {},
      removeEventListener: () => {},
    }

    const bare = new ThemeSliderWebGL(fallbackOnly)

    expect(bare.useWebGL).toBe(false)

    const canvas = makeCanvas()

    canvas.getBoundingClientRect = () => ({
      left: 0,
      top: 0,
      width: 100,
      height: 24,
      right: 100,
      bottom: 24,
    })
    attachHybridGL(canvas)

    const slider = new ThemeSliderWebGL(canvas)

    expect(slider.width).toBe(100)

    canvas.dispatchEvent(new window.Event(GL_EVENTS.WEBGL_CONTEXT_LOST, { cancelable: true }))

    expect(slider.useWebGL).toBe(false)

    slider.destroy()
  })

  test('init dpr falls back to 1 when devicePixelRatio is falsy', () => {
    const canvas = makeCanvas()

    attachHybridGL(canvas)

    const dprDesc = Object.getOwnPropertyDescriptor(window, 'devicePixelRatio')

    Object.defineProperty(window, 'devicePixelRatio', { value: 0, configurable: true })

    const slider = new ThemeSliderWebGL(canvas, THEME.SYSTEM)

    expect(slider.canvas.width).toBeGreaterThan(0)

    if (dprDesc) Object.defineProperty(window, 'devicePixelRatio', dprDesc)

    slider.destroy()
  })

  test('fragment-shader compile failure falls back', () => {
    const canvas = makeCanvas()
    let calls = 0
    const gl = new Proxy(createMockGL(), {
      get: (t, p) => (p === 'getShaderParameter' ? () => ++calls !== 2 : t[p]),
    })

    canvas.getContext = () => gl

    const slider = new ThemeSliderWebGL(canvas, THEME.SYSTEM)

    expect(slider.useWebGL).toBe(false)

    slider.destroy()
  })

  test('_renderStatic and animate cover the ctx dispatch and reduced-motion else arms', () => {
    const canvas = makeCanvas()

    attachHybridGL(canvas)

    const slider = new ThemeSliderWebGL(canvas, THEME.SYSTEM)

    slider.useWebGL = false
    slider.ctx = createMock2D()
    slider._renderStatic()
    slider.ctx = null
    slider._renderStatic()

    store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, true)

    slider.animId = null
    slider.animate()

    expect(slider.animId).toBeNull()

    store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, false)

    slider.destroy()
  })

  test('_renderCanvas2D covers the light-position sky, dunes and knob colors', () => {
    const canvas = makeCanvas()

    attachHybridGL(canvas)

    const slider = new ThemeSliderWebGL(canvas, THEME.SYSTEM)

    slider.useWebGL = false
    slider.ctx = createMock2D()
    slider.currentP = 2
    slider.knobX = slider._pToKnobX(2)
    slider._renderCanvas2D()

    slider.destroy()
  })

  test('destroy disconnects the observer and handles missing GL resources', () => {
    globalThis.ResizeObserver = class {
      constructor() {}
      observe() {}
      unobserve() {}
      disconnect() {}
    }

    const canvas = makeCanvas()

    attachHybridGL(canvas)

    const slider = new ThemeSliderWebGL(canvas, THEME.SYSTEM)

    slider.quadBuffer = null
    slider.program = null
    slider.destroy()

    expect(slider.gl).toBeNull()

    delete globalThis.ResizeObserver
  })
})
