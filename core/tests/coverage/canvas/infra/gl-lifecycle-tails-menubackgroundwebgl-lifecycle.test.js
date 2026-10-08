/**
 * @file gl-lifecycle-tails-menubackgroundwebgl-lifecycle.test.js
 * @description Split from gl-lifecycle-tails.test.js — covers the "MenuBackgroundWebGL lifecycle" describe.
 */
import { describe, test, expect, beforeEach, afterEach } from '@jest/globals'
import { MenuBackgroundWebGL } from '@core/utils/canvas/loaders/menu-background-webgl.js'
import { createMockGL, createMock2D } from '@tests/fixtures/mock-webgl.js'
import { WEBGL_STRINGS } from '@core/tokens/strings/webgl.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'
import { GL_EVENTS } from '@core/tokens/events/dom.js'
import { NAV_MENU_CLASSES } from '@core/tokens/classes/nav.js'
import { STATE_CLASSES } from '@core/tokens/classes/state.js'
import { STATE_STRINGS } from '@core/tokens/strings/state.js'

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

// ─── MenuBackgroundWebGL purge/restore ───────────────────────────────────────
describe('MenuBackgroundWebGL lifecycle', () => {
  const makeMenu = () => {
    const canvas = makeCanvas(NAV_MENU_CLASSES.NAV_MENU_MODAL_CANVAS)

    return { canvas, menu: new MenuBackgroundWebGL(canvas) }
  }

  test('purge stops the loop and releases the context; restore rebuilds it', () => {
    const { menu } = makeMenu()

    expect(menu.useWebGL).toBe(true)

    menu.start()
    menu.purge()

    expect(menu._purged).toBe(true)
    expect(menu.useWebGL).toBe(false)
    expect(menu.gl).toBeNull()
    expect(menu.animId).toBeNull()

    menu.restore()

    expect(menu._purged).toBe(false)
    expect(menu.useWebGL).toBe(true)
    expect(menu.gl).toBeTruthy()

    menu.destroy()
  })

  test('purge and restore are idempotent on an unstarted instance', () => {
    const { menu } = makeMenu()

    menu.purge()
    menu.purge()

    expect(menu._purged).toBe(true)

    menu.restore()

    // Never started → _wantsActive is false → restore stops early and
    // keeps _purged so a later restore() can still rebuild.
    expect(menu.gl).toBeNull()
    expect(menu.useWebGL).toBe(false)
    expect(menu._purged).toBe(true)

    menu.restore()

    expect(menu._purged).toBe(true)

    menu.destroy()
  })

  test('restore does not resurrect a purged canvas that left the DOM', () => {
    const { canvas, menu } = makeMenu()

    menu.start()
    menu.purge()
    canvas.remove()
    menu.restore()

    expect(menu.gl).toBeNull()
    expect(menu.useWebGL).toBe(false)

    document.body.appendChild(canvas)
    menu.destroy()
  })

  test('restore tolerates a null canvas', () => {
    const { menu } = makeMenu()

    menu.start()
    menu.purge()
    menu.canvas = null
    menu.restore()

    expect(menu.gl).toBeNull()
  })

  test('context loss falls back permanently and frees the context', () => {
    const { canvas, menu } = makeMenu()

    menu.start()
    canvas.dispatchEvent(new window.Event(GL_EVENTS.WEBGL_CONTEXT_LOST))

    expect(menu.useWebGL).toBe(false)
    expect(menu.gl).toBeNull()
    expect(canvas.classList.contains(STATE_CLASSES.IS_FALLBACK)).toBe(true)
    expect(canvas.style.display).toBe(STATE_STRINGS.NONE)

    menu.destroy()
  })

  test('triggerFallback releases a partially-initialised context', () => {
    const { canvas, menu } = makeMenu()

    menu._triggerFallback()

    expect(menu.gl).toBeNull()
    expect(menu.useWebGL).toBe(false)
    expect(canvas.style.display).toBe(STATE_STRINGS.NONE)

    menu.destroy()
  })

  test('initGL on a null canvas drops to the fallback', () => {
    const { menu } = makeMenu()

    menu.canvas = null
    menu._initGL()

    expect(menu.useWebGL).toBe(false)
  })

  test('shader failure releases the acquired context instead of leaking it', () => {
    const proto = window.HTMLCanvasElement?.prototype || HTMLCanvasElement.prototype
    const lostCanvas = document.createElement(HTML_TAGS.CANVAS)
    let loseContextCalled = false
    const failingGL = new Proxy(
      {},
      {
        get(_t, prop) {
          if (typeof prop === TYPE_STRINGS.STRING && prop === prop.toUpperCase()) return 1

          if (prop === 'getExtension') {
            return (name) =>
              /lose_context/i.test(String(name))
                ? {
                    loseContext: () => {
                      loseContextCalled = true
                    },
                  }
                : {}
          }

          return (...args) => {
            if (prop === 'getShaderParameter') return false
            if (prop === 'getShaderInfoLog' || prop === 'getProgramInfoLog') return 'compile failed'

            return prop === 'createShader' || prop === 'createProgram' || prop === 'createBuffer'
              ? { id: args.length }
              : undefined
          }
        },
        set: () => true,
      }
    )

    proto.getContext = function patched(type) {
      if (String(type) === WEBGL_STRINGS.CONTEXT_2D) return mock2D

      if (/webgl/i.test(String(type))) {
        // The GPU probe canvas still reports real hardware; only the menu
        // canvas itself hands back the shader-failing context.
        return this === lostCanvas ? failingGL : mockGL
      }

      return null
    }

    lostCanvas.className = NAV_MENU_CLASSES.NAV_MENU_MODAL_CANVAS
    document.body.appendChild(lostCanvas)

    const menu = new MenuBackgroundWebGL(lostCanvas)

    expect(menu.useWebGL).toBe(false)
    expect(menu.gl).toBeNull()
    expect(lostCanvas.classList.contains(STATE_CLASSES.IS_FALLBACK)).toBe(true)
    expect(loseContextCalled).toBe(true)

    menu.destroy()
  })

  test('restore clears stale fallback marks inside the modal wrapper', () => {
    const modal = document.createElement(HTML_TAGS.DIV)

    modal.className = NAV_MENU_CLASSES.NAV_MENU_MODAL

    const canvas = makeCanvas(NAV_MENU_CLASSES.NAV_MENU_MODAL_CANVAS, modal)

    document.body.appendChild(modal)

    canvas.classList.add(STATE_CLASSES.IS_FALLBACK)
    modal.classList.add(NAV_MENU_CLASSES.NAV_MENU_MODAL_GL_FALLBACK)

    const menu = new MenuBackgroundWebGL(canvas)

    expect(menu.useWebGL).toBe(true)
    expect(canvas.classList.contains(STATE_CLASSES.IS_FALLBACK)).toBe(false)
    expect(modal.classList.contains(NAV_MENU_CLASSES.NAV_MENU_MODAL_GL_FALLBACK)).toBe(false)

    menu.destroy()
  })
})
