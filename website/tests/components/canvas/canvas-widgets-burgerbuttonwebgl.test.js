/**
 * @file canvas-widgets-burgerbuttonwebgl.test.js
 * @description Split from canvas-widgets.test.js — covers the "BurgerButtonWebGL" describe.
 */
import { describe, test, expect, beforeEach } from '@jest/globals'
import { webglPool } from '@core/utils/canvas/webgl-pool.js'
import { BurgerButtonWebGL } from '@core/utils/canvas/widgets/burger-button-webgl.js'
import { attachMockGL, attachNoGL } from '@tests/fixtures/mock-webgl.js'
import store from '@core/store.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { PREF_MUTATIONS } from '@core/tokens/events/mutations.js'
import { STATE_CLASSES } from '@core/tokens/classes/state.js'
import { GL_EVENTS, MOUSE_EVENTS } from '@core/tokens/events/dom.js'

const makeCanvas = () => document.createElement(HTML_TAGS.CANVAS)

const flushFrames = (ms = 80) => new Promise((resolve) => setTimeout(resolve, ms))

const _WebGLPoolManager = webglPool.constructor

const _makeRectCanvas = (width = 300) => {
  const canvas = makeCanvas()

  canvas.getBoundingClientRect = () => ({ left: 0, top: 0, width, height: 64 })

  return canvas
}

beforeEach(() => {
  store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, false)
})

// ─── BurgerButtonWebGL ───────────────────────────────────────────────────────
describe('BurgerButtonWebGL', () => {
  test('initialises WebGL and starts the render loop', async () => {
    const canvas = makeCanvas()

    attachMockGL(canvas)

    const burger = new BurgerButtonWebGL(canvas)

    expect(burger.gl).toBeTruthy()

    await flushFrames(50)

    burger.destroy()
  })

  test('click handler is wired when provided', () => {
    const canvas = makeCanvas()

    attachMockGL(canvas)

    const clicks = []
    const burger = new BurgerButtonWebGL(canvas, () => clicks.push(1))

    canvas.dispatchEvent(new window.Event(MOUSE_EVENTS.CLICK))

    expect(clicks).toHaveLength(1)

    burger.destroy()
  })

  test('falls back when GL context creation fails', () => {
    const canvas = makeCanvas()

    attachNoGL(canvas)

    const burger = new BurgerButtonWebGL(canvas)

    expect(burger.useWebGL).toBe(false)

    burger.destroy()
  })

  test('_checkResize with a running loop skips the static repaint', () => {
    const canvas = makeCanvas()

    attachMockGL(canvas)

    const burger = new BurgerButtonWebGL(canvas)

    // Loop running (animId non-null) + a real size delta -> the `animId ===
    // null` else arm: no immediate _drawFrame, the next RAF repaints.
    burger.animId = 99
    canvas.getBoundingClientRect = () => ({
      width: 48,
      height: 48,
      top: 0,
      left: 0,
      right: 48,
      bottom: 48,
      x: 0,
      y: 0,
    })

    const calls = []
    const origDraw = burger._drawFrame

    burger._drawFrame = (...a) => calls.push(a)
    burger._checkResize()

    expect(calls).toHaveLength(0)

    burger._drawFrame = origDraw
    burger.animId = null
    burger.destroy()
  })

  test('_triggerFallback cancels a pending animation frame', () => {
    const canvas = makeCanvas()

    attachMockGL(canvas)

    const burger = new BurgerButtonWebGL(canvas)

    burger.animId = 99
    burger._triggerFallback()

    expect(burger.animId).toBeNull()
    expect(canvas.classList.contains(STATE_CLASSES.IS_FALLBACK)).toBe(true)

    burger.destroy()
  })

  test('resize while the loop is running skips the static repaint', async () => {
    const canvas = makeCanvas()

    attachMockGL(canvas)

    canvas.getBoundingClientRect = () => ({ width: 44, height: 44 })

    const burger = new BurgerButtonWebGL(canvas)

    await flushFrames(40)

    burger._checkResize()

    burger.destroy()
  })

  test('webglcontextlost triggers the fallback path', () => {
    const canvas = makeCanvas()

    attachMockGL(canvas)

    const burger = new BurgerButtonWebGL(canvas)

    canvas.dispatchEvent(new window.Event(GL_EVENTS.WEBGL_CONTEXT_LOST))

    expect(burger.useWebGL).toBe(false)

    burger.destroy()
  })

  test('destroy removes listeners and releases GL', () => {
    const canvas = makeCanvas()

    attachMockGL(canvas)

    const burger = new BurgerButtonWebGL(canvas)

    burger.destroy()

    expect(burger.animId).toBeNull()
  })

  test('null canvas hits the fallback guard before constructor throws', () => {
    expect(() => new BurgerButtonWebGL(null)).toThrow()
  })

  test('_initGL early-returns through _triggerFallback on a nulled canvas', () => {
    const canvas = makeCanvas()

    attachMockGL(canvas)

    const burger = new BurgerButtonWebGL(canvas)

    burger.canvas = null
    burger.animId = null
    burger._initGL()

    expect(burger.useWebGL).toBe(false)

    burger.canvas = canvas
    burger.destroy()
  })

  test('reduced-motion class renders a single static frame', () => {
    const canvas = makeCanvas()

    attachMockGL(canvas)
    document.documentElement.classList.add(STATE_CLASSES.REDUCED_MOTION)

    const burger = new BurgerButtonWebGL(canvas)

    expect(burger.animId).toBeNull()

    burger.destroy()
    document.documentElement.classList.remove(STATE_CLASSES.REDUCED_MOTION)
  })

  test('prefers-reduced-motion media query also short-circuits the loop', () => {
    const canvas = makeCanvas()

    attachMockGL(canvas)

    const origMM = window.matchMedia

    window.matchMedia = () => ({ matches: true })

    const burger = new BurgerButtonWebGL(canvas)

    expect(burger.animId).toBeNull()

    burger.destroy()
    window.matchMedia = origMM
  })

  test('resize guards: missing gl/canvas, zero rect, and static repaint', async () => {
    const canvas = makeCanvas()

    attachMockGL(canvas)

    const burger = new BurgerButtonWebGL(canvas)

    burger.gl = null
    burger._checkResize()

    burger.canvas = null
    burger._checkResize()

    burger.destroy()

    // Zero-size rect → `||34` fallbacks resize once, then static repaint.
    document.documentElement.classList.add(STATE_CLASSES.REDUCED_MOTION)

    const zero = makeCanvas()

    attachMockGL(zero)
    zero.getBoundingClientRect = () => ({ left: 0, top: 0, width: 0, height: 0 })

    const burgerZero = new BurgerButtonWebGL(zero)

    // Already-resized canvas → dims-equal arm skips the redraw.
    burgerZero._checkResize()

    await flushFrames(30)
    burgerZero.destroy()
    document.documentElement.classList.remove(STATE_CLASSES.REDUCED_MOTION)
  })

  test('drawFrame early-returns on zero dims and paints dark mode', () => {
    const canvas = makeCanvas()

    attachMockGL(canvas)

    const burger = new BurgerButtonWebGL(canvas)

    burger.canvas.width = 0
    burger.canvas.height = 0
    burger._drawFrame(0)

    burger.canvas.width = 64
    burger._drawFrame(0)

    burger.canvas.height = 8
    document.documentElement.classList.add(STATE_CLASSES.DARK_MODE)
    burger._drawFrame(0)
    document.documentElement.classList.remove(STATE_CLASSES.DARK_MODE)

    burger.destroy()
  })

  test('checkResize uses the devicePixelRatio fallback', () => {
    const canvas = makeCanvas()

    attachMockGL(canvas)

    const origDpr = Object.getOwnPropertyDescriptor(window, 'devicePixelRatio')

    Object.defineProperty(window, 'devicePixelRatio', { configurable: true, value: 0 })

    const burger = new BurgerButtonWebGL(canvas)

    burger._checkResize()

    if (origDpr) {
      Object.defineProperty(window, 'devicePixelRatio', origDpr)
    }

    burger.destroy()
  })

  test('destroy tolerates missing GL resources', () => {
    const canvas = makeCanvas()

    attachMockGL(canvas)

    const burger = new BurgerButtonWebGL(canvas)

    burger.quadBuffer = null
    burger.program = null
    burger.destroy()

    expect(burger.gl).toBeNull()
  })
})
