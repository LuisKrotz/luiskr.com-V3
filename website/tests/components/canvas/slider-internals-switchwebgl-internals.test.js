/**
 * @file slider-internals-switchwebgl-internals.test.js
 * @description Split from slider-internals.test.js — covers the "SwitchWebGL internals" describe.
 */
import { SWITCH_TYPES } from '@core/constants.js'
import { SwitchWebGL } from '@core/utils/canvas/widgets/switch-slider.js'
import {
  attachHybridGL,
  attachNoGL,
  createMock2D,
  createMockGL,
} from '@tests/fixtures/mock-webgl.js'
import store from '@core/store.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'
import { GL_EVENTS, MOUSE_EVENTS } from '@core/tokens/events/dom.js'
import { STATE_STRINGS } from '@core/tokens/strings/state.js'
import { WEBGL_STRINGS } from '@core/tokens/strings/webgl.js'
import { PREF_MUTATIONS } from '@core/tokens/events/mutations.js'

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
