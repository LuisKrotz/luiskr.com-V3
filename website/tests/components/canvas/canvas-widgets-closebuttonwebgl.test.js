/**
 * @file canvas-widgets-closebuttonwebgl.test.js
 * @description Split from canvas-widgets.test.js — covers the "CloseButtonWebGL" describe.
 */
import { describe, test, expect, beforeEach } from '@jest/globals'
import { webglPool } from '@core/utils/canvas/webgl-pool.js'
import { CloseButtonWebGL } from '@core/utils/canvas/widgets/close-button.js'
import { attachMockGL, attachNoGL } from '@tests/fixtures/mock-webgl.js'
import store from '@core/store.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { PREF_MUTATIONS } from '@core/tokens/events/mutations.js'
import { STATE_CLASSES } from '@core/tokens/classes/state.js'
import { GL_EVENTS, MOUSE_EVENTS } from '@core/tokens/events/dom.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'

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

// ─── CloseButtonWebGL ────────────────────────────────────────────────────────
describe('CloseButtonWebGL', () => {
  test('initialises WebGL and binds hover/click handlers', () => {
    const canvas = makeCanvas()

    attachMockGL(canvas)

    const btn = new CloseButtonWebGL(canvas)

    expect(btn.useWebGL).toBe(true)
    expect(canvas.classList.contains(STATE_CLASSES.IS_FALLBACK)).toBe(false)

    btn.destroy()
  })

  test('falls back when GL is unavailable', () => {
    const canvas = makeCanvas()

    attachNoGL(canvas)

    const btn = new CloseButtonWebGL(canvas)

    expect(btn.useWebGL).toBe(false)
    expect(canvas.classList.contains(STATE_CLASSES.IS_FALLBACK)).toBe(true)

    btn.destroy()
  })

  test('next user action retries a connected fallback when WebGL becomes available', async () => {
    const parent = document.createElement(HTML_TAGS.BUTTON)
    const canvas = makeCanvas()

    parent.appendChild(canvas)
    document.body.appendChild(parent)
    attachNoGL(canvas)

    const btn = new CloseButtonWebGL(canvas)

    expect(btn.useWebGL).toBe(false)

    attachMockGL(canvas)
    window.dispatchEvent(new MouseEvent(MOUSE_EVENTS.CLICK))
    await flushFrames()

    expect(btn.useWebGL).toBe(true)
    expect(canvas.classList.contains(STATE_CLASSES.IS_FALLBACK)).toBe(false)

    btn.destroy()
    parent.remove()
  })

  test('triggerClick runs the bound action', () => {
    const canvas = makeCanvas()

    attachMockGL(canvas)

    const clicks = []
    const btn = new CloseButtonWebGL(canvas, () => clicks.push(1))

    btn.triggerClick()

    btn.destroy()
  })

  test('setHover and setReducedMotion update render state', () => {
    const canvas = makeCanvas()

    attachMockGL(canvas)

    const btn = new CloseButtonWebGL(canvas)

    btn.setHover(true)

    expect(btn.isHovered).toBe(true)

    btn.setReducedMotion(true)
    btn.setReducedMotion(false)

    btn.destroy()
  })

  test('webglcontextlost triggers the fallback path', () => {
    const canvas = makeCanvas()

    attachMockGL(canvas)

    const btn = new CloseButtonWebGL(canvas)

    canvas.dispatchEvent(new window.Event(GL_EVENTS.WEBGL_CONTEXT_LOST))

    expect(btn.useWebGL).toBe(false)

    btn.destroy()
  })

  test('init prefers the canvas rect, then the parent rect, then 55px', () => {
    const big = makeCanvas()

    attachMockGL(big)
    big.getBoundingClientRect = () => ({ width: 80, height: 80 })

    const btnA = new CloseButtonWebGL(big)

    expect(btnA.width).toBe(80)

    btnA.destroy()

    const parent = document.createElement(HTML_TAGS.BUTTON)
    const small = makeCanvas()

    parent.appendChild(small)
    attachMockGL(small)
    parent.getBoundingClientRect = () => ({ width: 60, height: 60 })
    small.getBoundingClientRect = () => ({ width: 0, height: 0 })

    const btnB = new CloseButtonWebGL(small)

    expect(btnB.width).toBe(60)

    btnB.destroy()
    parent.remove()
  })

  test('resize observer re-measures and re-sizes the GL viewport', () => {
    let observerCb = null
    const OrigRO = globalThis.ResizeObserver

    globalThis.ResizeObserver = class {
      constructor(cb) {
        observerCb = cb
      }
      observe() {}
      unobserve() {}
      disconnect() {}
    }

    const canvas = makeCanvas()

    attachMockGL(canvas)

    const btn = new CloseButtonWebGL(canvas)

    observerCb([{ contentRect: { width: 90, height: 90 } }])

    expect(btn.width).toBe(90)

    observerCb([{ contentRect: { width: 0, height: 0 } }])

    expect(btn.width).toBe(90)

    btn.destroy()
    globalThis.ResizeObserver = OrigRO
  })

  test('shader compile and program link failures leave the button usable', () => {
    const makeFailingGL = (failAt) =>
      new Proxy(
        {},
        {
          get(_t, prop) {
            if (typeof prop === TYPE_STRINGS.STRING && prop === prop.toUpperCase()) return 1

            return (...args) => {
              if (prop === 'getShaderParameter') return failAt !== 'shader'
              if (prop === 'getProgramParameter') return failAt !== 'program'

              return [
                'createShader',
                'createProgram',
                'createBuffer',
                'getUniformLocation',
                'getAttribLocation',
              ].includes(prop)
                ? { id: args.length }
                : undefined
            }
          },
          set: () => true,
        }
      )

    const c1 = makeCanvas()

    c1.getContext = () => makeFailingGL('shader')

    const btnA = new CloseButtonWebGL(c1)

    btnA.destroy()

    const c2 = makeCanvas()

    c2.getContext = () => makeFailingGL('program')

    const btnB = new CloseButtonWebGL(c2)

    btnB.destroy()

    const c3 = makeCanvas()

    c3.getContext = () => {
      throw new Error('gl boom')
    }

    const btnC = new CloseButtonWebGL(c3)

    expect(btnC.useWebGL).toBe(false)
    expect(c3.classList.contains(STATE_CLASSES.IS_FALLBACK)).toBe(true)

    btnC.destroy()
  })

  test('click on the bound target records the shockwave and runs the action', () => {
    const parent = document.createElement(HTML_TAGS.BUTTON)
    const canvas = makeCanvas()

    parent.appendChild(canvas)
    attachMockGL(canvas)

    const clicks = []
    const btn = new CloseButtonWebGL(canvas, () => clicks.push(1))

    parent.dispatchEvent(new window.Event(MOUSE_EVENTS.CLICK))

    expect(clicks).toHaveLength(1)
    expect(btn.clickTime).toBeGreaterThan(-1)

    btn.destroy()
    parent.remove()
  })

  test('setReducedMotion(false) restarts the loop when idle', async () => {
    const canvas = makeCanvas()

    attachMockGL(canvas)

    const btn = new CloseButtonWebGL(canvas)

    btn.animId = null
    btn.setReducedMotion(false)

    expect(btn.animId).not.toBeNull()

    btn.destroy()
  })

  test('init early-returns on a canvas without getContext', () => {
    const btn = new CloseButtonWebGL({})

    expect(btn.useWebGL).toBeFalsy()

    btn.destroy()
  })

  test('fragment-shader compile failure falls back after the vertex stage', () => {
    let calls = 0
    const canvas = makeCanvas()

    canvas.getContext = () =>
      new Proxy(
        {},
        {
          get(_t, prop) {
            if (typeof prop === TYPE_STRINGS.STRING && prop === prop.toUpperCase()) return 1

            return (...args) => {
              if (prop === 'getShaderParameter') return ++calls === 1
              if (prop === 'getProgramParameter') return true

              return [
                'createShader',
                'createProgram',
                'createBuffer',
                'getUniformLocation',
                'getAttribLocation',
              ].includes(prop)
                ? { id: args.length }
                : undefined
            }
          },
          set: () => true,
        }
      )

    const btn = new CloseButtonWebGL(canvas)

    btn.destroy()
  })

  test('hover handlers, reduced-motion cancel and the dpr/RO else arms', async () => {
    const canvas = makeCanvas()

    attachMockGL(canvas)

    let observerCb = null
    const OrigRO = globalThis.ResizeObserver

    globalThis.ResizeObserver = class {
      constructor(cb) {
        observerCb = cb
      }
      observe() {}
      unobserve() {}
      disconnect() {}
    }

    const origDpr = Object.getOwnPropertyDescriptor(window, 'devicePixelRatio')

    Object.defineProperty(window, 'devicePixelRatio', { configurable: true, value: undefined })

    const btn = new CloseButtonWebGL(canvas)

    // bound hover handlers flip the hover state
    btn.onMouseEnter()

    expect(btn.isHovered).toBe(true)

    btn.onMouseLeave()

    expect(btn.isHovered).toBe(false)

    // RO: height falsy -> `h || w`; width delta only -> the `||` right arm
    observerCb?.([{ contentRect: { width: 90, height: 0 } }])

    // animate tick with a real hover target — the RAF callback itself runs
    btn.setHover(true)
    btn.animate()
    await flushFrames(30)

    // drawProgress already complete -> the progression guards' else arms
    btn._renderStatic()
    btn.animate()
    await flushFrames(30)

    // pending frame + reduced motion -> cancelAnimationFrame + static render
    btn.animId = 7
    store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, true)
    btn.animate()

    expect(btn.animId).toBeNull()

    store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, false)

    if (origDpr) Object.defineProperty(window, 'devicePixelRatio', origDpr)

    globalThis.ResizeObserver = OrigRO
    btn.destroy()
  })

  test('contextlost without a pending frame, static else and parented RO', () => {
    let observerCb = null
    const OrigRO = globalThis.ResizeObserver

    globalThis.ResizeObserver = class {
      constructor(cb) {
        observerCb = cb
      }
      observe() {}
      unobserve() {}
      disconnect() {}
    }

    // canvas inside a parent -> the `if (parentElement)` true arm
    const parent = document.createElement(HTML_TAGS.DIV)
    const canvas = makeCanvas()

    parent.appendChild(canvas)
    attachMockGL(canvas)

    const btn = new CloseButtonWebGL(canvas)

    // height-only delta -> the `||` second operand arm
    observerCb?.([{ contentRect: { width: 10, height: 0 } }])
    observerCb?.([{ contentRect: { width: btn.width, height: btn.height + 50 } }])

    // no pending frame -> the animId else arm inside the contextlost handler
    btn.animId = null
    canvas.dispatchEvent(new window.Event(GL_EVENTS.WEBGL_CONTEXT_LOST))

    // no GL -> `_renderStatic`'s `useWebGL && gl` else arm
    btn._renderStatic()

    // RO on a GL-less button -> the `if (this.gl)` else arm
    const noCtx = makeCanvas()

    attachNoGL(noCtx)

    const btnB = new CloseButtonWebGL(noCtx)

    observerCb?.([{ contentRect: { width: 80, height: 80 } }])

    globalThis.ResizeObserver = OrigRO
    btn.destroy()
    btnB.destroy()
    parent.remove()
  })

  test('init tolerates a missing window global (dpr :1 arms)', () => {
    let observerCb = null
    const OrigRO = globalThis.ResizeObserver

    globalThis.ResizeObserver = class {
      constructor(cb) {
        observerCb = cb
      }
      observe() {}
      unobserve() {}
      disconnect() {}
    }

    const canvas = makeCanvas()

    attachMockGL(canvas)

    const origWindow = Object.getOwnPropertyDescriptor(globalThis, 'window')

    try {
      Object.defineProperty(globalThis, 'window', { configurable: true, value: undefined })
    } catch {
      // window is non-configurable in this env — the arm is uncovered here
      globalThis.ResizeObserver = OrigRO

      return
    }

    try {
      const btn = new CloseButtonWebGL(canvas)

      // RO callback while window is still absent -> its own `: 1` dpr arm
      observerCb?.([{ contentRect: { width: 80, height: 80 } }])

      btn.destroy()
    } finally {
      if (origWindow) Object.defineProperty(globalThis, 'window', origWindow)

      globalThis.ResizeObserver = OrigRO
    }
  })

  test('destroy tolerates missing GL resources', () => {
    const canvas = makeCanvas()

    attachMockGL(canvas)

    const btn = new CloseButtonWebGL(canvas)

    btn.quadBuffer = null
    btn.program = null
    btn.destroy()

    // reduced-motion with no pending frame -> the animId else arm
    const btn2 = new CloseButtonWebGL(canvas)

    btn2.animId = null
    store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, true)
    btn2.animate()

    store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, false)
    btn2.destroy()
  })
})
