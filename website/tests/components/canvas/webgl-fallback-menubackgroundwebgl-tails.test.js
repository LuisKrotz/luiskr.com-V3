/**
 * @file webgl-fallback-menubackgroundwebgl-tails.test.js
 * @description Split from webgl-fallback.test.js — covers the "MenuBackgroundWebGL tails" describe.
 */
import { describe, test, expect } from '@jest/globals'
import { MenuBackgroundWebGL } from '@core/utils/canvas/loaders/menu-background-webgl.js'
import { attachMockGL, createMockGL } from '@tests/fixtures/mock-webgl.js'
import { TEST_COLORS } from '@tests/fixtures/test-constants.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { STATE_CLASSES } from '@core/tokens/classes/state.js'
import { GL_EVENTS } from '@core/tokens/events/dom.js'
import { CHAR_STRINGS } from '@core/tokens/strings/chars.js'

// ─── MenuBackgroundWebGL tails ───────────────────────────────────────────────
describe('MenuBackgroundWebGL tails', () => {
  const makeCanvas = (withParent = true) => {
    const c = document.createElement(HTML_TAGS.CANVAS)

    if (withParent) document.body.appendChild(c)

    return c
  }

  test('null canvas falls back during init', () => {
    const bg = new MenuBackgroundWebGL(null)

    expect(bg.useWebGL).toBe(false)
  })

  test('fragment shader compile failure triggers fallback', () => {
    const c = makeCanvas()
    const base = createMockGL()
    let calls = 0
    const gl = new Proxy(
      {},
      {
        get(_t, prop) {
          if (prop === 'getShaderParameter') return () => ++calls === 1

          return base[prop]
        },
        set() {
          return true
        },
      }
    )

    attachMockGL(c, gl)

    const bg = new MenuBackgroundWebGL(c)

    expect(bg.useWebGL).toBe(false)
    expect(c.classList.contains(STATE_CLASSES.IS_FALLBACK)).toBe(true)
  })

  test('throwing getContext lands in the catch fallback', () => {
    const c = makeCanvas()

    c.getContext = () => {
      throw new Error(CHAR_STRINGS.EMPTY)
    }

    const bg = new MenuBackgroundWebGL(c)

    expect(bg.useWebGL).toBe(false)
  })

  test('contextlost listener prevents default and falls back', () => {
    const c = makeCanvas()

    attachMockGL(c)

    const bg = new MenuBackgroundWebGL(c)

    c.dispatchEvent(new Event(GL_EVENTS.WEBGL_CONTEXT_LOST))

    expect(bg.useWebGL).toBe(false)
  })

  test('_triggerFallback cancels a pending anim frame', () => {
    const c = makeCanvas()

    attachMockGL(c)

    const bg = new MenuBackgroundWebGL(c)

    bg.animId = requestAnimationFrame(() => {})
    bg._triggerFallback()

    expect(bg.animId).toBeNull()

    bg.destroy()
  })

  test('_parseCssColor handles every input shape', () => {
    const c = makeCanvas()

    attachMockGL(c)

    const bg = new MenuBackgroundWebGL(c)

    expect(bg._parseCssColor(null)).toBeNull()
    expect(bg._parseCssColor(42)).toBeNull()
    expect(bg._parseCssColor('#abc')).toEqual([0xaa / 255, 0xbb / 255, 0xcc / 255])
    expect(bg._parseCssColor('#112233')).toEqual([0x11 / 255, 0x22 / 255, 0x33 / 255])
    expect(bg._parseCssColor('rgba(1, 2, 3, 0.5)')).toEqual([1 / 255, 2 / 255, 3 / 255])
    expect(bg._parseCssColor(TEST_COLORS.INVALID)).toBeNull()

    bg.destroy()
    c.remove()
  })

  test('_sampleTheme survives a throwing getComputedStyle', () => {
    const c = makeCanvas()

    attachMockGL(c)

    const bg = new MenuBackgroundWebGL(c)
    const origGCS = globalThis.getComputedStyle

    globalThis.getComputedStyle = () => {
      throw new Error(CHAR_STRINGS.EMPTY)
    }

    try {
      bg._sampleTheme()

      expect(bg._color2).toBe(bg._color)
    } finally {
      globalThis.getComputedStyle = origGCS
    }

    bg.destroy()
    c.remove()
  })

  test('start() renders the reduced-motion frame and observes resizes', async () => {
    const c = makeCanvas()

    attachMockGL(c)

    const bg = new MenuBackgroundWebGL(c)

    expect(bg.useWebGL).toBe(true)

    const ro = globalThis.ResizeObserver
    const captured = []

    globalThis.ResizeObserver = class {
      constructor(cb) {
        captured.push(cb)
      }
      observe() {}
      disconnect() {
        captured.push(null)
      }
    }

    document.documentElement.classList.add(STATE_CLASSES.REDUCED_MOTION)

    try {
      bg.start()
      bg.start()

      expect(bg.animId).toBeNull()
      expect(bg._ro).toBeTruthy()

      captured[0]?.()

      bg.stop()

      expect(bg._ro).toBeNull()

      bg.stop()
    } finally {
      document.documentElement.classList.remove(STATE_CLASSES.REDUCED_MOTION)
      globalThis.ResizeObserver = ro
    }

    bg.destroy()
    c.remove()
  })

  test('start() runs the loop and observes a detached parent fallback', async () => {
    const c = makeCanvas(false)

    attachMockGL(c)

    const bg = new MenuBackgroundWebGL(c)
    const ro = globalThis.ResizeObserver
    const observed = []

    globalThis.ResizeObserver = class {
      constructor(cb) {
        this.cb = cb
      }
      observe(el) {
        observed.push(el)
      }
      disconnect() {}
    }

    try {
      bg.start()

      expect(observed[0]).toBe(c)

      await new Promise((r) => setTimeout(r, 40))

      bg.isActive = false
      bg._loop()
    } finally {
      globalThis.ResizeObserver = ro
    }

    bg.destroy()
  })

  test('_tickReveal covers every ease arm', () => {
    const c = makeCanvas()

    attachMockGL(c)

    const bg = new MenuBackgroundWebGL(c)
    const now = performance.now()

    bg._revealDur = 0
    bg._revealTarget = 1
    bg._tickReveal(now)

    expect(bg._reveal).toBe(1)

    bg._revealFrom = 1
    bg._revealTarget = 0
    bg._revealT0 = now
    bg._revealDur = 100
    bg._tickReveal(now + 20)
    bg._tickReveal(now + 80)
    bg._tickReveal(now + 200)

    expect(bg._revealDur).toBe(0)

    // open direction: easeOutQuint arm (target 1, mid-flight progress)
    bg._revealFrom = 0
    bg._revealTarget = 1
    bg._revealT0 = now
    bg._revealDur = 100
    bg._tickReveal(now + 30)

    expect(bg._reveal).toBeGreaterThan(0)

    bg.destroy()
    c.remove()
  })

  test('_renderFrame resamples on a theme flip and uses dark alpha', () => {
    const c = makeCanvas()

    attachMockGL(c)

    const bg = new MenuBackgroundWebGL(c)

    bg._darkAtStart = false
    document.documentElement.classList.add(STATE_CLASSES.DARK_MODE)

    try {
      bg._renderFrame()

      expect(bg._darkAtStart).toBe(true)

      document.documentElement.classList.remove(STATE_CLASSES.DARK_MODE)

      bg._renderFrame()
      bg._renderFrame(0)
    } finally {
      document.documentElement.classList.remove(STATE_CLASSES.DARK_MODE)
    }

    bg.destroy()
    c.remove()
  })

  test('_handleResize tolerates missing dpr and null gl', () => {
    const c = makeCanvas(false)
    const bg = new MenuBackgroundWebGL(null)

    bg.canvas = c
    bg.gl = null

    const prevDpr = window.devicePixelRatio

    Object.defineProperty(window, 'devicePixelRatio', { value: 0, configurable: true })

    try {
      bg._handleResize()

      // zero-size parent → viewport fallback (never a degenerate 0×0 buffer)
      expect(bg.width).toBe(Math.min(Math.round(window.innerWidth * 2), 3072))

      // laid-out parent → rect × dpr arm
      c.getBoundingClientRect = () => ({ width: 40, height: 30 })

      bg._handleResize()

      expect(bg.width).toBe(Math.round(40 * 2))
      expect(bg.height).toBe(Math.round(30 * 2))
    } finally {
      Object.defineProperty(window, 'devicePixelRatio', { value: prevDpr, configurable: true })
    }

    c.remove()
  })

  test('destroy tolerates a missing gl', () => {
    const bg = new MenuBackgroundWebGL(null)

    bg.destroy()

    expect(bg.gl).toBeNull()
  })
})
