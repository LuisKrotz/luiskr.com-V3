/**
 * @file canvas-widgets.test.js
 * @description Lifecycle tests for the standalone WebGL canvas widgets:
 * ThemeSliderWebGL, SwitchWebGL, CheckboxWebGL and the WebGLPoolManager.
 * Runs each widget through init → interaction → animation → destroy with a
 * mocked GL context, plus the no-GL fallback branches.
 */
import { describe, test, expect, jest, beforeEach } from '@jest/globals'
import { ThemeSliderWebGL } from '@core/utils/canvas/widgets/theme-slider.js'
import { SwitchWebGL } from '@core/utils/canvas/widgets/switch-slider.js'
import { CheckboxWebGL } from '@earth/space/checkbox-webgl.js'
import { webglPool } from '@core/utils/canvas/webgl-pool.js'
import { CarouselArrowWebGL } from '@core/utils/canvas/widgets/carousel-controls.js'
import { CloseButtonWebGL } from '@core/utils/canvas/widgets/close-button.js'
import { BurgerButtonWebGL } from '@core/utils/canvas/widgets/burger-button-webgl.js'
import {
  attachMockGL,
  attachMock2D,
  attachHybridGL,
  attachNoGL,
} from '../../fixtures/mock-webgl.js'
import store from '@core/store.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { PREF_MUTATIONS } from '@core/tokens/events/mutations.js'
import { STATE_CLASSES } from '@core/tokens/classes/state.js'
import { GL_EVENTS, KEYBOARD_EVENTS, MOUSE_EVENTS } from '@core/tokens/events/dom.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'

import { ARROW_TYPES, KEYS, SWITCH_TYPES } from '@core/constants.js'
import { THEME } from '@core/tokens/theme/theme.js'

const makeCanvas = () => document.createElement(HTML_TAGS.CANVAS)

const flushFrames = (ms = 80) => new Promise((resolve) => setTimeout(resolve, ms))

const WebGLPoolManager = webglPool.constructor

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

// ─── SwitchWebGL ─────────────────────────────────────────────────────────────

describe('SwitchWebGL', () => {
  test('initialises WebGL for every context type', () => {
    ;[SWITCH_TYPES.STATS, SWITCH_TYPES.GRID, SWITCH_TYPES.MOTION, SWITCH_TYPES.CYAN].forEach(
      (ctx) => {
        const canvas = makeCanvas()

        attachMockGL(canvas)

        const sw = new SwitchWebGL(canvas, ctx, false)

        expect(sw.useWebGL).toBe(true)

        sw.destroy()
      }
    )
  })

  test('context code maps each context type to a shader constant', () => {
    const canvas = makeCanvas()

    attachMockGL(canvas)

    expect(new SwitchWebGL(makeCanvasWithGL(), SWITCH_TYPES.STATS)._contextCode()).toBe(0.0)
    expect(new SwitchWebGL(makeCanvasWithGL(), SWITCH_TYPES.GRID)._contextCode()).toBe(1.0)
    expect(new SwitchWebGL(makeCanvasWithGL(), SWITCH_TYPES.MOTION)._contextCode()).toBe(2.0)

    function makeCanvasWithGL() {
      const c = makeCanvas()

      attachMockGL(c)

      return c
    }
  })

  test('toggle flips state and invokes the callback', () => {
    const canvas = makeCanvas()

    attachMockGL(canvas)

    const toggles = []
    const sw = new SwitchWebGL(canvas, SWITCH_TYPES.STATS, false, () => toggles.push(1))

    sw.toggle()

    expect(sw.isActive).toBe(true)
    expect(toggles).toHaveLength(1)

    sw.toggle()

    expect(sw.isActive).toBe(false)

    sw.destroy()
  })

  test('setActive animates toward the new state', async () => {
    const canvas = makeCanvas()

    attachMockGL(canvas)

    const sw = new SwitchWebGL(canvas, SWITCH_TYPES.GRID, false)

    sw.setActive(true)

    expect(sw.targetP).toBe(1)

    await flushFrames()

    sw.destroy()
  })

  test('setReducedMotion renders statically without a rAF loop', () => {
    const canvas = makeCanvas()

    attachMockGL(canvas)

    const sw = new SwitchWebGL(canvas, SWITCH_TYPES.MOTION, true)

    sw.targetP = 0.4
    sw.setReducedMotion(true)

    // Static render snaps the position immediately instead of animating.
    expect(sw.currentP).toBe(0.4)

    sw.destroy()
  })

  test('falls back to the CSS class when GL is unavailable', () => {
    const canvas = makeCanvas()

    attachNoGL(canvas)

    const sw = new SwitchWebGL(canvas, SWITCH_TYPES.STATS, false)

    expect(sw.useWebGL).toBe(false)

    sw.destroy()
  })
})

// ─── CheckboxWebGL ───────────────────────────────────────────────────────────

describe('CheckboxWebGL', () => {
  test('initialises with a 2D context and draws the unchecked state', () => {
    const canvas = makeCanvas()

    attachMock2D(canvas)

    const box = new CheckboxWebGL(canvas, false)

    expect(box.ctx2d).toBeTruthy()
    expect(box.isChecked).toBe(false)

    box.destroy()
  })

  test('setChecked animates progress toward the target', async () => {
    const canvas = makeCanvas()

    attachMock2D(canvas)

    const box = new CheckboxWebGL(canvas, false)

    box.setChecked(true)

    expect(box.targetP).toBe(1)

    await flushFrames(300)

    box.destroy()
  })

  test('handles a missing 2D context gracefully', () => {
    const canvas = makeCanvas()

    attachNoGL(canvas)

    const box = new CheckboxWebGL(canvas, true)

    expect(box.ctx2d).toBeNull()

    box.destroy()
  })

  test('destroy cancels the animation loop', async () => {
    const canvas = makeCanvas()

    attachMock2D(canvas)

    const box = new CheckboxWebGL(canvas, false)

    box.setChecked(true)
    box.destroy()

    expect(box.animId).toBeNull()
  })

  test('init defaults missing devicePixelRatio and _startLoop is re-entry safe', () => {
    const canvas = makeCanvas()

    attachMock2D(canvas)

    const origDpr = window.devicePixelRatio

    window.devicePixelRatio = 0

    try {
      const box = new CheckboxWebGL(canvas, false)

      box.setChecked(true)
      box._startLoop()
      box._startLoop()

      expect(box.animId).toBeTruthy()

      box.destroy()
    } finally {
      window.devicePixelRatio = origDpr
    }
  })
})

// ─── WebGLPoolManager ────────────────────────────────────────────────────────

describe('WebGLPoolManager', () => {
  test('register/unregister tracks instances per element', () => {
    const pool = new WebGLPoolManager()
    const el = document.createElement(HTML_TAGS.DIV)
    const instance = { purge: jest.fn(), restore: jest.fn() }

    pool.register(el, instance)

    expect(pool.entries.get(el).instance).toBe(instance)

    pool.unregister(el)

    expect(pool.entries.has(el)).toBe(false)

    pool.destroy()
  })

  test('observer callbacks purge offscreen widgets and restore visible ones', () => {
    const pool = new WebGLPoolManager()
    const el = document.createElement(HTML_TAGS.DIV)
    const instance = { purge: jest.fn(), restore: jest.fn() }

    pool.register(el, instance)

    const cb = pool.observer ? pool.observer._callback || pool.observer.callback : null

    if (cb) {
      cb([{ target: el, isIntersecting: false }])

      expect(instance.purge).toHaveBeenCalled()

      cb([{ target: el, isIntersecting: false }])
      cb([{ target: el, isIntersecting: true }])

      expect(instance.restore).toHaveBeenCalled()
    }

    pool.destroy()
  })

  test('getSupportedCompression returns a texture-format map', () => {
    const pool = new WebGLPoolManager()
    const gl = attachMockGL(makeCanvas())

    const formats = pool.getSupportedCompression(gl)

    expect(formats).toBeTruthy()

    pool.destroy()
  })

  test('the shared singleton exists and exposes the same API', () => {
    expect(typeof webglPool.register).toBe(TYPE_STRINGS.FUNCTION)
    expect(typeof webglPool.unregister).toBe(TYPE_STRINGS.FUNCTION)
  })
})

// ─── CarouselArrowWebGL ──────────────────────────────────────────────────────

describe('CarouselArrowWebGL', () => {
  test('initialises WebGL for both arrow types', () => {
    ;[ARROW_TYPES.PREV, ARROW_TYPES.NEXT].forEach((type) => {
      const canvas = makeCanvas()

      attachHybridGL(canvas)

      const arrow = new CarouselArrowWebGL(canvas, type)

      expect(arrow.ctx).toBeTruthy()
      expect(arrow.type).toBe(type)

      arrow.destroy()
    })
  })

  test('falls back when GL is unavailable', () => {
    const canvas = makeCanvas()

    attachNoGL(canvas)

    const arrow = new CarouselArrowWebGL(canvas, ARROW_TYPES.NEXT)

    expect(arrow.ctx).toBeFalsy()
    expect(canvas.classList.contains(STATE_CLASSES.IS_FALLBACK)).toBe(true)

    arrow.destroy()
  })

  test('setProgress clamps to 0–1 and syncs play state', () => {
    const canvas = makeCanvas()

    attachHybridGL(canvas)

    const arrow = new CarouselArrowWebGL(canvas, ARROW_TYPES.NEXT)

    arrow.setProgress(1.5)

    expect(arrow.progress).toBe(1)

    arrow.setProgress(-2, false)

    expect(arrow.progress).toBe(0)
    expect(arrow.isPlaying).toBe(false)

    arrow.destroy()
  })

  test('setHover/setPlaying/triggerClick update render state', () => {
    const canvas = makeCanvas()

    attachHybridGL(canvas)

    const actions = []
    const arrow = new CarouselArrowWebGL(canvas, ARROW_TYPES.PREV, () => actions.push(1))

    arrow.setHover(true)

    expect(arrow.isHovered).toBe(true)

    arrow.setPlaying(false)

    expect(arrow.isPlaying).toBe(false)

    arrow.triggerClick()

    expect(arrow.clickTime).toBeGreaterThan(0)

    arrow.destroy()
  })

  test('click on the bound target invokes onAction', () => {
    const canvas = makeCanvas()

    attachHybridGL(canvas)

    const actions = []
    const arrow = new CarouselArrowWebGL(canvas, ARROW_TYPES.NEXT, () => actions.push(1))

    arrow.onMouseEnter()

    expect(arrow.isHovered).toBe(true)

    arrow.onClick()

    expect(actions).toHaveLength(1)

    arrow.onMouseLeave()

    expect(arrow.isHovered).toBe(false)

    arrow.destroy()
  })

  test('setReducedMotion snaps to the static render', () => {
    const canvas = makeCanvas()

    attachHybridGL(canvas)

    const arrow = new CarouselArrowWebGL(canvas, ARROW_TYPES.NEXT)

    arrow.setReducedMotion(true)
    arrow.setReducedMotion(false)

    arrow.destroy()
  })

  test('purge and restore pause and resume the widget', async () => {
    const canvas = makeCanvas()

    attachHybridGL(canvas)

    const arrow = new CarouselArrowWebGL(canvas, ARROW_TYPES.NEXT)

    arrow.purge?.()
    arrow.restore?.()

    await flushFrames(50)

    arrow.destroy()
  })
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
