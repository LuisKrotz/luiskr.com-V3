/**
 * @file gl-lifecycle-tails-quad-widget-purge-restore.test.js
 * @description Split from gl-lifecycle-tails.test.js — covers the "quad-widget purge/restore" describe.
 */
import { describe, test, expect, beforeEach, afterEach } from '@jest/globals'
import { BurgerButtonWebGL } from '@core/utils/canvas/widgets/burger-button-webgl.js'
import { CloseButtonWebGL } from '@core/utils/canvas/widgets/close-button.js'
import { ThemeSliderWebGL } from '@core/utils/canvas/widgets/theme-slider.js'
import { SwitchWebGL } from '@core/utils/canvas/widgets/switch-slider.js'
import { createMockGL, createMock2D } from '@tests/fixtures/mock-webgl.js'
import { WEBGL_STRINGS } from '@core/tokens/strings/webgl.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'
import { NAV_BURGER_CLASSES } from '@core/tokens/classes/nav.js'
import { STATE_CLASSES } from '@core/tokens/classes/state.js'

import { PREF_CLASSES, SWITCH_TYPES } from '@core/constants.js'
import { THEME } from '@core/tokens/theme/theme.js'

const _flush = (ms = 80) => new Promise((r) => setTimeout(r, ms))

let mockGL
let mock2D
let origGetContext

beforeEach(() => {
  mockGL = createMockGL()
  mock2D = createMock2D()

  const proto = window.HTMLCanvasElement?.prototype || HTMLCanvasElement.prototype

  origGetContext = proto.getContext

  proto.getContext = function patchedGetContext(type) {
    if (String(type) === WEBGL_STRINGS.CONTEXT_2D) return mock2D
    if (/webgl/i.test(String(type))) return mockGL

    return null
  }
})

afterEach(() => {
  const proto = window.HTMLCanvasElement?.prototype || HTMLCanvasElement.prototype

  proto.getContext = origGetContext

  document.body.innerHTML = ''
})

const makeCanvas = (cls = null, parent = document.body) => {
  const canvas = document.createElement(HTML_TAGS.CANVAS)

  if (cls) canvas.className = cls

  parent.appendChild(canvas)

  return canvas
}

// A WebGL stub whose shader/program status checks always fail — drives
// every widget down the `!built` path in its init (and now its release).
const _makeFailingGL = () =>
  new Proxy(
    {},
    {
      get(_t, prop) {
        if (typeof prop === TYPE_STRINGS.STRING && prop === prop.toUpperCase()) return 1

        return (...args) => {
          if (prop === 'getExtension') return { loseContext: () => {} }
          if (prop === 'getShaderParameter' || prop === 'getProgramParameter') return false
          if (prop === 'getShaderInfoLog' || prop === 'getProgramInfoLog') return 'fail'
          if (prop === 'getParameter') return 'mock'

          return ['createShader', 'createProgram', 'createBuffer', 'getUniformLocation'].includes(
            prop
          )
            ? { id: args.length }
            : undefined
        }
      },
      set: () => true,
    }
  )

// ─── Quad-widget purge/restore roundtrips ────────────────────────────────────
describe('quad-widget purge/restore', () => {
  test('BurgerButtonWebGL releases GL offscreen and rebuilds on re-entry', () => {
    const canvas = makeCanvas(NAV_BURGER_CLASSES.NAV_BURGER_CANVAS)
    const burger = new BurgerButtonWebGL(canvas, () => {})

    expect(burger.useWebGL).toBe(true)

    burger.restore()

    burger.purge()
    burger.purge()

    expect(burger.gl).toBeNull()
    expect(burger.animId).toBeNull()

    burger.restore()

    expect(burger.useWebGL).toBe(true)
    expect(burger.gl).toBeTruthy()

    burger.destroy()
  })

  test('BurgerButtonWebGL restore stops on a detached or null canvas', () => {
    const canvas = makeCanvas(NAV_BURGER_CLASSES.NAV_BURGER_CANVAS)
    const burger = new BurgerButtonWebGL(canvas, () => {})

    burger.purge()
    canvas.remove()
    burger.restore()

    expect(burger.gl).toBeNull()

    document.body.appendChild(canvas)
    burger.restore()

    expect(burger.gl).toBeTruthy()

    burger.purge()
    burger.canvas = null
    burger.restore()

    expect(burger.gl).toBeNull()
  })

  test('BurgerButtonWebGL destroy while purged is a no-op for GL', () => {
    const canvas = makeCanvas(NAV_BURGER_CLASSES.NAV_BURGER_CANVAS)
    const burger = new BurgerButtonWebGL(canvas, () => {})

    burger.purge()
    burger.destroy()

    expect(burger.gl).toBeNull()
  })

  test('CloseButtonWebGL releases GL offscreen and rebuilds on re-entry', () => {
    const canvas = makeCanvas()
    const btn = new CloseButtonWebGL(canvas)

    expect(btn.useWebGL).toBe(true)

    btn.restore()
    btn.purge()

    expect(btn.gl).toBeNull()
    expect(btn.useWebGL).toBe(false)

    btn.restore()

    expect(btn.useWebGL).toBe(true)
    expect(btn.gl).toBeTruthy()

    btn.purge()
    btn.canvas = null
    btn.restore()

    expect(btn.gl).toBeNull()
  })

  test('ThemeSliderWebGL releases GL offscreen and rebuilds on re-entry', () => {
    const wrapper = document.createElement(HTML_TAGS.DIV)

    wrapper.className = PREF_CLASSES.PREF_THEME_WRAPPER

    const canvas = makeCanvas(null, wrapper)

    document.body.appendChild(wrapper)

    const slider = new ThemeSliderWebGL(canvas, THEME.SYSTEM)

    expect(slider.useWebGL).toBe(true)

    slider.restore()
    slider.purge()

    expect(slider.gl).toBeNull()
    expect(slider.useWebGL).toBe(false)

    slider.restore()

    expect(slider.useWebGL).toBe(true)
    expect(slider.gl).toBeTruthy()

    slider.destroy()
  })

  test('ThemeSliderWebGL restore stops on a null canvas', () => {
    const slider = new ThemeSliderWebGL(makeCanvas(), THEME.SYSTEM)

    slider.purge()
    slider.canvas = null
    slider.restore()

    expect(slider.gl).toBeNull()
  })

  test('SwitchWebGL releases GL offscreen and rebuilds on re-entry', () => {
    const canvas = makeCanvas()
    const sw = new SwitchWebGL(canvas, SWITCH_TYPES.STATS)

    expect(sw.useWebGL).toBe(true)

    sw.restore()
    sw.purge()

    expect(sw.gl).toBeNull()
    expect(sw.useWebGL).toBe(false)

    sw.restore()

    expect(sw.useWebGL).toBe(true)
    expect(sw.gl).toBeTruthy()

    sw.destroy()
  })

  test('SwitchWebGL restore re-acquires the 2D path when GL is gone', () => {
    const proto = window.HTMLCanvasElement?.prototype || HTMLCanvasElement.prototype
    const canvas = makeCanvas()
    const sw = new SwitchWebGL(canvas, SWITCH_TYPES.STATS)

    sw.purge()

    proto.getContext = function patched(type) {
      return String(type) === WEBGL_STRINGS.CONTEXT_2D ? mock2D : null
    }

    sw.restore()

    expect(sw.useWebGL).toBe(false)
    expect(sw.ctx).toBeTruthy()

    sw.destroy()
  })

  test('SwitchWebGL restore falls back when no context of any kind is available', () => {
    const proto = window.HTMLCanvasElement?.prototype || HTMLCanvasElement.prototype
    const canvas = makeCanvas()
    const sw = new SwitchWebGL(canvas, SWITCH_TYPES.STATS)

    sw.purge()

    proto.getContext = () => null

    sw.restore()

    expect(sw.useWebGL).toBe(false)
    expect(sw.ctx).toBeNull()
    expect(canvas.classList.contains(STATE_CLASSES.IS_FALLBACK)).toBe(true)

    sw.destroy()
  })

  test('SwitchWebGL restore falls back when the 2D context throws', () => {
    const proto = window.HTMLCanvasElement?.prototype || HTMLCanvasElement.prototype
    const canvas = makeCanvas()
    const sw = new SwitchWebGL(canvas, SWITCH_TYPES.STATS)

    sw.purge()

    proto.getContext = function patched(type) {
      if (String(type) === WEBGL_STRINGS.CONTEXT_2D) throw new Error('ctx')

      return null
    }

    sw.restore()

    expect(sw.ctx).toBeNull()
    expect(canvas.classList.contains(STATE_CLASSES.IS_FALLBACK)).toBe(true)

    sw.destroy()
  })
})
