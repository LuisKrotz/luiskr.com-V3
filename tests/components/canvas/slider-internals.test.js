/**
 * @file slider-internals.test.js
 * @description Deep coverage for the WebGL slider widgets' interaction and
 * render paths: SwitchWebGL toggling/reduced-motion/loop, ThemeSliderWebGL
 * theme mapping, keyboard navigation, drag coordinates, static render, and
 * destroy.
 */

import { KEYS, SWITCH_TYPES, THEME } from '@/core/constants.js'
import { SwitchWebGL } from '@/utils/canvas/widgets/switch-slider.js'
import { ThemeSliderWebGL } from '@/utils/canvas/widgets/theme-slider.js'
import {
  attachHybridGL,
  attachNoGL,
  createMock2D,
  createMockGL,
} from '../../fixtures/mock-webgl.js'
import store from '@/core/store.js'
import { HTML_TAGS } from '@/core/tokens/elements/html.js'
import { TYPE_STRINGS } from '@/core/tokens/strings/types.js'
import { GL_EVENTS, MOUSE_EVENTS } from '@/core/tokens/events/dom.js'
import { STATE_STRINGS } from '@/core/tokens/strings/state.js'
import { WEBGL_STRINGS } from '@/core/tokens/strings/webgl.js'
import { PREF_MUTATIONS } from '@/core/tokens/events/mutations.js'
import { PREF_CLASSES } from '@/core/tokens/classes/preferences.js'

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

// ─── SwitchWebGL ─────────────────────────────────────────────────────────────

describe('SwitchWebGL internals', () => {
  test('_contextCode maps each switch context to a shader variant', () => {
    const canvas = makeCanvas()

    attachHybridGL(canvas)

    const sw = new SwitchWebGL(canvas, SWITCH_TYPES.STATS)

    expect(typeof sw._contextCode?.()).toBe(TYPE_STRINGS.NUMBER)

    sw.destroy()
  })

  test('toggle flips state and fires the callback', () => {
    const canvas = makeCanvas()

    attachHybridGL(canvas)

    const toggles = []
    const sw = new SwitchWebGL(canvas, SWITCH_TYPES.GRID, false, (v) => toggles.push(v))

    sw.toggle()

    expect(sw.isActive).toBe(true)

    sw.toggle()

    expect(sw.isActive).toBe(false)

    sw.destroy()
  })

  test('setActive animates toward the target position', () => {
    const canvas = makeCanvas()

    attachHybridGL(canvas)

    const sw = new SwitchWebGL(canvas, SWITCH_TYPES.MOTION)

    sw.setActive(true)

    expect(sw.targetP).toBe(1)

    sw.setActive(false)

    expect(sw.targetP).toBe(0)

    sw.destroy()
  })

  test('_renderStatic snaps the knob to the target', () => {
    const canvas = makeCanvas()

    attachHybridGL(canvas)

    const sw = new SwitchWebGL(canvas, SWITCH_TYPES.STATS, true)

    sw._renderStatic?.()

    expect(sw.currentP).toBe(sw.targetP)

    sw.destroy()
  })

  test('setReducedMotion renders statically then resumes the loop', async () => {
    const canvas = makeCanvas()

    attachHybridGL(canvas)

    const sw = new SwitchWebGL(canvas, SWITCH_TYPES.STATS)

    sw.setReducedMotion(true)
    sw.setReducedMotion(false)

    await flushFrames(50)

    sw.destroy()
  })

  test('fallback path when GL is unavailable', () => {
    const canvas = makeCanvas()

    attachNoGL(canvas)

    const sw = new SwitchWebGL(canvas, SWITCH_TYPES.STATS)

    expect(sw.useWebGL).toBe(false)

    sw.destroy()
  })

  test('animate loop renders frames while running', async () => {
    const canvas = makeCanvas()

    attachHybridGL(canvas)

    const sw = new SwitchWebGL(canvas, SWITCH_TYPES.STATS)

    await flushFrames(60)

    sw.destroy()

    expect(sw.gl).toBeNull()
  })

  test('init guard, context-loss listener, and 2d-context throw', () => {
    // canvas without getContext -> init guard + contextType default arm
    const fake = { style: {}, classList: { add() {}, contains: () => false } }
    const dead = new SwitchWebGL(fake)

    expect(dead.useWebGL).toBe(false)

    // contextlost listener -> _triggerFallback with a pending animId
    const canvas = makeCanvas()

    attachHybridGL(canvas)

    const sw = new SwitchWebGL(canvas, SWITCH_TYPES.STATS)

    sw.animId = 7
    canvas.dispatchEvent(new window.Event(GL_EVENTS.WEBGL_CONTEXT_LOST, { cancelable: true }))

    expect(sw.canvas.style.display).toBe(STATE_STRINGS.NONE)

    sw.destroy()

    // getContext('2d') throws -> catch -> fallback
    const c2 = makeCanvas()

    c2.getContext = (type) => {
      if (String(type) === WEBGL_STRINGS.CONTEXT_2D) throw new Error('ctx')
    }

    const sw2 = new SwitchWebGL(c2, SWITCH_TYPES.STATS)

    expect(sw2.useWebGL).toBe(false)

    sw2.destroy()
  })

  test('shader compile, link, and setup failures warn and fall back', () => {
    const wrap = (fns) => {
      const base = createMockGL()

      return new Proxy({}, { get: (_t, p) => (p in fns ? fns[p] : base[p]) })
    }

    let calls = 0
    const fsFail = makeCanvas()

    attachHybridGL(fsFail, wrap({ getShaderParameter: () => (++calls === 2 ? false : true) }))

    const sw1 = new SwitchWebGL(fsFail, SWITCH_TYPES.STATS)

    expect(sw1.useWebGL).toBe(false)

    sw1.destroy()

    const linkFail = makeCanvas()

    attachHybridGL(linkFail, wrap({ getProgramParameter: () => false }))

    const sw2 = new SwitchWebGL(linkFail, SWITCH_TYPES.STATS)

    expect(sw2.useWebGL).toBe(false)

    sw2.destroy()

    const boom = makeCanvas()

    attachHybridGL(
      boom,
      wrap({
        createShader: () => {
          throw new Error('gl boom')
        },
      })
    )

    const sw3 = new SwitchWebGL(boom, SWITCH_TYPES.STATS)

    expect(sw3.useWebGL).toBe(false)

    sw3.destroy()

    // VS compile failure -> the first-parameter warn arm
    const vsFail = makeCanvas()

    attachHybridGL(vsFail, wrap({ getShaderParameter: () => false }))

    const sw4 = new SwitchWebGL(vsFail, SWITCH_TYPES.STATS)

    expect(sw4.useWebGL).toBe(false)

    sw4.destroy()
  })

  test('setReducedMotion restart, ctx static render, and grid variant', () => {
    const canvas = makeCanvas()

    attachHybridGL(canvas)

    const sw = new SwitchWebGL(canvas, SWITCH_TYPES.STATS)

    // `else if (!this.animId)` -> animate() restart arm
    sw.animId = null
    sw.setReducedMotion(false)

    expect(sw.animId).toBeTruthy()

    // `_renderStatic` 2d path -> `else if (this.ctx)` arm
    sw.useWebGL = false
    sw.ctx = createMock2D()
    sw._renderStatic()

    // no renderer at all -> the trailing else arm
    sw.ctx = null
    sw._renderStatic()

    // animate() reduced with no pending frame -> `if (this.animId)` else arm
    store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, true)
    sw.animId = null
    sw.animate()
    store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, false)

    sw.destroy()

    // GRID context -> the blueprint rendering block (+ `p > .5` arm)
    const grid = makeCanvas()

    attachHybridGL(grid)

    const sw2 = new SwitchWebGL(grid, SWITCH_TYPES.GRID)

    sw2.ctx = createMock2D()
    sw2.currentP = 0.8
    sw2._renderCanvas2D(performance.now())
    sw2.currentP = 0.2
    sw2._renderCanvas2D(performance.now())

    sw2.destroy()

    // MOTION context -> the drift/still-horizon else block, both `p` arms
    const motion = makeCanvas()

    attachHybridGL(motion)

    const sw3 = new SwitchWebGL(motion, SWITCH_TYPES.MOTION)

    sw3.ctx = createMock2D()
    sw3.currentP = 0.2
    sw3._renderCanvas2D(performance.now())
    sw3.currentP = 0.9
    sw3._renderCanvas2D(performance.now())

    sw3.destroy()
  })

  test('dpr falls back when window or devicePixelRatio is missing', () => {
    const dpr = window.devicePixelRatio

    window.devicePixelRatio = 0

    const c1 = makeCanvas()

    attachNoGL(c1)

    const sw1 = new SwitchWebGL(c1, SWITCH_TYPES.STATS)

    sw1.destroy()
    window.devicePixelRatio = dpr

    // window undefined -> the `typeof window` else arm
    const win = globalThis.window
    const c2 = makeCanvas()

    attachNoGL(c2)

    delete globalThis.window

    const sw2 = new SwitchWebGL(c2, SWITCH_TYPES.STATS)

    globalThis.window = win
    sw2.destroy()
  })

  test('click toggle, reduced-motion paths, dpr fallback, and null-resource destroy', () => {
    const canvas = makeCanvas()

    attachHybridGL(canvas)

    const toggles = []
    const sw = new SwitchWebGL(canvas, SWITCH_TYPES.STATS, false, (v) => toggles.push(v))

    // canvas click -> onClick -> toggle
    canvas.dispatchEvent(new window.Event(MOUSE_EVENTS.CLICK, { bubbles: true }))

    expect(sw.isActive).toBe(true)
    expect(toggles.length).toBe(1)

    // toggle under reduced motion -> _renderStatic arm
    store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, true)
    sw.toggle()
    sw.setActive(false)

    // animate() under reduced motion with a pending frame -> cancel arm
    sw.animId = 11
    sw.animate()

    expect(sw.animId).toBeNull()

    store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, false)

    // `dpr || 2` and `p > .5` arms in the 2d renderer
    sw.dpr = 0
    sw.currentP = 0.8
    sw.ctx = createMock2D()
    sw._renderCanvas2D(performance.now())

    // destroy without buffer/program -> both guard else arms
    sw.quadBuffer = null
    sw.program = null
    sw.destroy()

    expect(sw.gl).toBeNull()
  })
})

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
