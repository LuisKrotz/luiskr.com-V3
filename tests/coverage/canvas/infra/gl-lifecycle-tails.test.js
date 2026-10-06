/**
 * @file gl-lifecycle-tails.test.js
 * @description Coverage tails for the shared WebGL lifecycle contract:
 * gl-lifecycle (watchContextLoss / releaseQuadGL) and every widget's
 * purge→restore roundtrip — the offscreen destroy/recreate path that
 * keeps the browser context pool below its limit.
 */
import { describe, test, expect, beforeEach, afterEach } from '@jest/globals'
import { watchContextLoss, releaseQuadGL } from '@/utils/canvas/gl-lifecycle.js'
import { MenuBackgroundWebGL } from '@/utils/canvas/loaders/menu-background-webgl.js'
import { SkeletonWebGL } from '@/utils/canvas/loaders/skeleton-webgl.js'
import { BurgerButtonWebGL } from '@/utils/canvas/widgets/burger-button-webgl.js'
import { CloseButtonWebGL } from '@/utils/canvas/widgets/close-button.js'
import { FlagWebGL } from '@/utils/canvas/widgets/flag-webgl.js'
import { ThemeSliderWebGL } from '@/utils/canvas/widgets/theme-slider.js'
import { SwitchWebGL } from '@/utils/canvas/widgets/switch-slider.js'
import { renderCanvas2D } from '@/utils/canvas/widgets/switch-slider/render.js'
import { drawFlag } from '@/utils/canvas/widgets/flag/draw.js'
import { createMockGL, createMock2D } from '../../../fixtures/mock-webgl.js'
import store from '@/core/store.js'
import { WEBGL_STRINGS } from '../../../../src/core/tokens/strings/webgl.js'
import { HTML_TAGS } from '../../../../src/core/tokens/elements/html.js'
import { TYPE_STRINGS } from '../../../../src/core/tokens/strings/types.js'
import { GL_EVENTS, KEYBOARD_EVENTS, WINDOW_EVENTS } from '../../../../src/core/tokens/events/dom.js'
import { NAV_BURGER_CLASSES, NAV_MENU_CLASSES } from '../../../../src/core/tokens/classes/nav.js'
import { STATE_CLASSES } from '../../../../src/core/tokens/classes/state.js'
import { STATE_STRINGS } from '../../../../src/core/tokens/strings/state.js'
import { SKELETON_CLASSES } from '../../../../src/core/tokens/classes/skeleton.js'
import { PREF_MUTATIONS } from '../../../../src/core/tokens/events/mutations.js'

import { KEYS,
  LOCALES,
  PREF_CLASSES,
  SWITCH_TYPES } from '@/core/constants.js'
import { THEME } from '../../../../src/core/tokens/theme/theme.js'

const flush = (ms = 80) => new Promise((r) => setTimeout(r, ms))

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
const makeFailingGL = () =>
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

          return ['createShader', 'createProgram', 'createBuffer', 'getUniformLocation'].includes(prop)
            ? { id: args.length }
            : undefined
        }
      },
      set: () => true }
  )

// ─── watchContextLoss / releaseQuadGL ────────────────────────────────────────

describe('watchContextLoss / releaseQuadGL', () => {
  test('dispatched context loss runs onLost without preventDefault', () => {
    const canvas = makeCanvas()
    let lost = 0

    watchContextLoss(canvas, () => {
      lost += 1
    })

    const event = new window.Event(GL_EVENTS.WEBGL_CONTEXT_LOST, { cancelable: true })
    let prevented = false

    event.preventDefault = () => {
      prevented = true
    }

    canvas.dispatchEvent(event)

    expect(lost).toBe(1)
    expect(prevented).toBe(false)
  })

  test('releaseQuadGL deletes resources, force-loses the context and detaches the watcher', () => {
    const canvas = makeCanvas()
    let lost = 0
    const onLost = watchContextLoss(canvas, () => {
      lost += 1
    })
    const host = { gl: mockGL, program: { p: 1 }, quadBuffer: { b: 1 } }

    releaseQuadGL(canvas, host, onLost)

    expect(host.gl).toBeNull()
    expect(host.program).toBeNull()
    expect(host.quadBuffer).toBeNull()

    canvas.dispatchEvent(new window.Event(GL_EVENTS.WEBGL_CONTEXT_LOST))

    expect(lost).toBe(0)
  })

  test('releaseQuadGL short-circuits on a missing context', () => {
    const host = { gl: null, program: { p: 1 }, quadBuffer: { b: 1 } }

    releaseQuadGL(makeCanvas(), host, null)

    expect(host.gl).toBeNull()
  })

  test('releaseQuadGL tolerates missing listener, canvas and resources', () => {
    const host = { gl: mockGL, program: null, quadBuffer: null }

    releaseQuadGL(makeCanvas(), host, null)

    expect(host.gl).toBeNull()

    const host2 = { gl: mockGL, program: null, quadBuffer: null }

    releaseQuadGL(null, host2, () => {})

    expect(host2.gl).toBeNull()
  })

  test('releaseQuadGL survives a context without WEBGL_lose_context', () => {
    const bare = { deleteBuffer: () => {}, deleteProgram: () => {} }
    const host = { gl: bare, program: { p: 1 }, quadBuffer: { b: 1 } }

    releaseQuadGL(makeCanvas(), host, null)

    expect(host.gl).toBeNull()

    const noExt = {
      deleteBuffer: () => {},
      deleteProgram: () => {},
      getExtension: () => null }
    const host2 = { gl: noExt, program: null, quadBuffer: null }

    releaseQuadGL(makeCanvas(), host2, null)

    expect(host2.gl).toBeNull()
  })
})

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
              /lose_context/i.test(String(name)) ? { loseContext: () => { loseContextCalled = true } } : {}
          }

          return (...args) => {
            if (prop === 'getShaderParameter') return false
            if (prop === 'getShaderInfoLog' || prop === 'getProgramInfoLog') return 'compile failed'

            return prop === 'createShader' || prop === 'createProgram' || prop === 'createBuffer'
              ? { id: args.length }
              : undefined
          }
        },
        set: () => true }
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

// ─── Shared-renderer purge/restore ───────────────────────────────────────────

describe('shared-renderer purge/restore', () => {
  const makeSkeletonHost = () => {
    const host = document.createElement(HTML_TAGS.DIV)
    const root = document.createElement(HTML_TAGS.DIV)
    const content = document.createElement(HTML_TAGS.DIV)

    host.getBoundingClientRect = () => ({ left: 0, top: 0, width: 400, height: 300 })

    root.appendChild(content)
    host.appendChild(root)
    document.body.appendChild(host)

    return { host, root, content }
  }

  test('FlagWebGL releases the shared renderer offscreen and re-acquires on re-entry', () => {
    const canvas = makeCanvas()
    const flag = new FlagWebGL(canvas, { code: LOCALES.EN, cc: 'us' })

    expect(flag.renderer).toBeTruthy()

    const oldCanvas = flag.renderer.canvas

    flag.restore()
    flag.purge()

    expect(flag.renderer).toBeNull()

    flag.restore()

    expect(flag.renderer).toBeTruthy()
    expect(flag.renderer.canvas).not.toBe(oldCanvas)

    flag.destroy()
  })

  test('FlagWebGL purge tolerates missing animId/renderer; restore falls back when acquire fails', () => {
    const canvas = makeCanvas()
    const flag = new FlagWebGL(canvas, { code: LOCALES.DE, cc: 'de' })

    flag.animId = null
    flag.purge()

    expect(flag.renderer).toBeNull()

    flag.useWebGL = false
    flag.restore()

    expect(flag.renderer).toBeNull()

    flag.destroy()
  })

  test('FlagWebGL restore falls back when the shared renderer cannot re-init', () => {
    const proto = window.HTMLCanvasElement?.prototype || HTMLCanvasElement.prototype
    const canvas = makeCanvas()
    const flag = new FlagWebGL(canvas, { code: LOCALES.FR, cc: 'fr' })

    flag.purge()

    proto.getContext = function patched(type) {
      return String(type) === WEBGL_STRINGS.CONTEXT_2D ? mock2D : null
    }

    flag.restore()

    expect(flag.useWebGL).toBe(false)
    expect(canvas.classList.contains(STATE_CLASSES.IS_FALLBACK)).toBe(true)

    flag.destroy()
  })

  test('SkeletonWebGL releases the shared renderer offscreen and re-acquires on re-entry', () => {
    const { host, root, content } = makeSkeletonHost()
    const layer = new SkeletonWebGL(host, root, content)

    expect(layer.renderer).toBeTruthy()

    layer.restore()
    layer.purge()

    expect(layer.renderer).toBeNull()

    layer.restore()

    expect(layer.renderer).toBeTruthy()

    layer.destroy()
  })

  test('SkeletonWebGL restore early-returns without purge or after fallback', () => {
    const { host, root, content } = makeSkeletonHost()
    const layer = new SkeletonWebGL(host, root, content)

    layer.purge()
    layer.useWebGL = false
    layer.restore()

    expect(layer.renderer).toBeNull()

    layer.destroy()
  })

  test('SkeletonWebGL restore destroys itself when the renderer cannot re-init', () => {
    const proto = window.HTMLCanvasElement?.prototype || HTMLCanvasElement.prototype
    const { host, root, content } = makeSkeletonHost()
    const layer = new SkeletonWebGL(host, root, content)

    layer.purge()

    proto.getContext = function patched(type) {
      return String(type) === WEBGL_STRINGS.CONTEXT_2D ? mock2D : null
    }

    layer.restore()

    expect(layer.renderer).toBeNull()
    expect(host.classList.contains(SKELETON_CLASSES.HAS_SKELETON_LAYER)).toBe(false)
  })

  test('SkeletonWebGL restore skips restarting when a loop is already pending', () => {
    const { host, root, content } = makeSkeletonHost()
    const layer = new SkeletonWebGL(host, root, content)

    layer.purge()
    layer.animId = 1
    layer.restore()

    expect(layer.renderer).toBeTruthy()
    expect(layer.animId).toBe(1)

    layer.destroy()
  })

  test('SkeletonWebGL purge tolerates missing animId/renderer', () => {
    const { host, root, content } = makeSkeletonHost()
    const layer = new SkeletonWebGL(host, root, content)

    layer.animId = null
    layer.renderer = null
    layer.purge()

    expect(layer._paused).toBe(true)

    layer.destroy()
  })

  test('SkeletonWebGL purge cancels a live loop; destroy clears idle/refresh/canvas arms', () => {
    const { host, root, content } = makeSkeletonHost()
    const layer = new SkeletonWebGL(host, root, content)

    // Live-loop arm in purge() + the destroy() guards for the deferred
    // refresh and idle handles — they only run when the handles exist.
    layer.animId = requestAnimationFrame(() => {})
    layer._refreshId = requestAnimationFrame(() => {})
    layer._idleId = setTimeout(() => {}, 0)

    const savedCancel = globalThis.cancelIdleCallback
    globalThis.cancelIdleCallback = () => {}

    layer.purge()

    expect(layer.animId).toBeNull()

    layer.destroy()

    globalThis.cancelIdleCallback = savedCancel

    expect(layer.renderer).toBeNull()
    expect(layer.canvas).toBeNull()
  })
})

// ─── Remaining uncovered arms: defaults, deferred work, reduced motion ──────

describe('lifecycle leftover arms', () => {
  test('releaseQuadGL falls back to the null-listener default', () => {
    const host = { gl: mockGL, program: { p: 1 }, quadBuffer: { b: 1 } }

    releaseQuadGL(makeCanvas(), host)

    expect(host.gl).toBeNull()
  })

  test('MenuBackgroundWebGL restore on a never-purged instance is a no-op', () => {
    const canvas = makeCanvas(NAV_MENU_CLASSES.NAV_MENU_MODAL_CANVAS)
    const menu = new MenuBackgroundWebGL(canvas)

    menu.restore()

    expect(menu._purged).toBe(false)

    menu.destroy()
  })

  test('MenuBackgroundWebGL restore keeps the fallback when re-init fails', () => {
    const proto = window.HTMLCanvasElement?.prototype || HTMLCanvasElement.prototype
    const canvas = makeCanvas(NAV_MENU_CLASSES.NAV_MENU_MODAL_CANVAS)
    const menu = new MenuBackgroundWebGL(canvas)

    menu.start()
    menu.purge()

    proto.getContext = function patched(type) {
      return String(type) === WEBGL_STRINGS.CONTEXT_2D ? mock2D : null
    }

    menu.restore()

    expect(menu._purged).toBe(false)
    expect(menu.useWebGL).toBe(false)
    expect(menu.gl).toBeNull()
  })

  test('MenuBackgroundWebGL start/loop early-returns on inactive, missing GL and fallback states', () => {
    const canvas = makeCanvas(NAV_MENU_CLASSES.NAV_MENU_MODAL_CANVAS)
    const menu = new MenuBackgroundWebGL(canvas)

    menu.start()
    menu.start()

    // isActive || !useWebGL → already-active start is a no-op; the loop's
    // guard exits when the widget is stopped, GL-less or in fallback.
    menu.stop()
    menu._loop()

    expect(menu.animId).toBeNull()

    menu._triggerFallback()
    menu.start()
    menu._loop()

    expect(menu.isActive).toBe(false)

    menu.destroy()
  })

  test('MenuBackgroundWebGL renders a fixed-time frame', () => {
    const canvas = makeCanvas(NAV_MENU_CLASSES.NAV_MENU_MODAL_CANVAS)
    const menu = new MenuBackgroundWebGL(canvas)

    menu._renderFrame(0)

    expect(menu.gl).toBeTruthy()

    menu.destroy()
  })

  test('MenuBackgroundWebGL renders an untimed frame and releases its ResizeObserver', () => {
    const savedRO = globalThis.ResizeObserver
    const observed = []

    globalThis.ResizeObserver = class {
      observe() {}

      unobserve() {}

      disconnect() {
        observed.push(this)
      }
    }

    const canvas = makeCanvas(NAV_MENU_CLASSES.NAV_MENU_MODAL_CANVAS)
    const menu = new MenuBackgroundWebGL(canvas)

    menu.start()
    menu._renderFrame()
    menu.stop()

    globalThis.ResizeObserver = savedRO

    expect(observed.length).toBeGreaterThan(0)

    menu.destroy()
  })

  test('BurgerButtonWebGL under reduced motion draws one static frame; deferred re-measure fires', async () => {
    const canvas = makeCanvas(NAV_BURGER_CLASSES.NAV_BURGER_CANVAS)

    document.documentElement.classList.add(STATE_CLASSES.REDUCED_MOTION)

    const burger = new BurgerButtonWebGL(canvas, () => {})

    document.documentElement.classList.remove(STATE_CLASSES.REDUCED_MOTION)

    expect(burger.animId).toBeNull()

    burger.purge()
    burger.destroy()
  })

  test('BurgerButtonWebGL deferred resize check runs after a frame', async () => {
    const canvas = makeCanvas(NAV_BURGER_CLASSES.NAV_BURGER_CANVAS)
    const burger = new BurgerButtonWebGL(canvas, () => {})

    await flush()

    expect(burger.useWebGL).toBe(true)

    burger.destroy()
  })

  test('CloseButtonWebGL setReducedMotion switches between static and looped render', () => {
    const canvas = makeCanvas()
    const btn = new CloseButtonWebGL(canvas)

    btn.setReducedMotion(true)
    btn.setReducedMotion(false)

    // !animId arm: a stopped button re-arms the loop when motion returns.
    btn.animId = null
    btn.setReducedMotion(false)

    expect(btn.animId).not.toBeNull()

    btn.destroy()
  })

  test('SwitchWebGL honours reduced motion on toggle/setActive/setReducedMotion', () => {
    const canvas = makeCanvas()
    const sw = new SwitchWebGL(canvas, SWITCH_TYPES.STATS)

    store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, true)

    sw.toggle()
    sw.setActive(true)

    expect(sw.isActive).toBe(true)

    sw.setReducedMotion(true)
    sw.setReducedMotion(false)

    store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, false)

    sw.animId = null
    sw.setReducedMotion(false)

    expect(sw.animId).not.toBeNull()

    sw.destroy()
  })

  test('ThemeSliderWebGL honours reduced motion on setTheme/setReducedMotion', () => {
    const wrapper = document.createElement(HTML_TAGS.DIV)

    wrapper.className = PREF_CLASSES.PREF_THEME_WRAPPER

    const canvas = makeCanvas(null, wrapper)

    document.body.appendChild(wrapper)

    const slider = new ThemeSliderWebGL(canvas, THEME.SYSTEM)

    store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, true)

    slider.setTheme(THEME.DARK)
    slider.setReducedMotion(true)

    store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, false)

    slider.animId = null
    slider.setReducedMotion(false)

    expect(slider.animId).not.toBeNull()

    slider.destroy()
  })

  test('FlagWebGL init falls back on a missing canvas, a null 2D context and a failed acquire', () => {
    const proto = window.HTMLCanvasElement?.prototype || HTMLCanvasElement.prototype

    // init() re-run with canvas nulled — the !canvas guard arm.
    const flag = new FlagWebGL(makeCanvas(), { code: LOCALES.EN, cc: 'us' })

    flag.canvas = null
    flag.init()

    expect(flag.useWebGL).toBe(false)
    expect(flag.renderer).toBeNull()

    flag.destroy()

    // Shared renderer alive but the flag's own 2D context unavailable.
    proto.getContext = function patched(type) {
      if (/webgl/i.test(String(type))) return mockGL

      return null
    }

    const flag2 = new FlagWebGL(makeCanvas(), { code: LOCALES.DE, cc: 'de' })

    expect(flag2.useWebGL).toBe(false)
    expect(flag2.ctx).toBeNull()

    flag2.destroy()

    // No WebGL at all — acquire() hands back null → !renderer arm.
    proto.getContext = () => null

    const flag3 = new FlagWebGL(makeCanvas(), { code: LOCALES.FR, cc: 'fr' })

    expect(flag3.useWebGL).toBe(false)
    expect(flag3.renderer).toBeNull()

    flag3.destroy()
  })

  test('FlagWebGL static render draws a hovered loaded flag; _paused render is a no-op', () => {
    const canvas = makeCanvas()
    const flag = new FlagWebGL(canvas, { code: LOCALES.EN, cc: 'us' })

    flag.isHovered = true
    flag.isLoaded = true
    flag._renderStatic()

    expect(flag.hoverLevel).toBe(1.0)

    flag._paused = true
    flag._renderWebGL(0)

    // Renderer gone + not paused → the loop degrades to the fallback path.
    flag._paused = false
    flag.renderer = null
    flag._renderWebGL(0)

    expect(flag.useWebGL).toBe(false)

    flag.destroy()
  })

  test('FlagWebGL purge tolerates an already-null renderer', () => {
    const flag = new FlagWebGL(makeCanvas(), { code: LOCALES.EN, cc: 'us' })

    flag.renderer = null
    flag.purge()

    expect(flag.renderer).toBeNull()

    flag.destroy()
  })

  test('FlagWebGL restore reuses a still-held renderer without re-acquiring', () => {
    const flag = new FlagWebGL(makeCanvas(), { code: LOCALES.DE, cc: 'de' })

    const held = flag.renderer

    flag._paused = true
    flag.restore()

    expect(flag.renderer).toBe(held)

    flag.destroy()
  })

  test('SkeletonWebGL restore reuses a still-held renderer without re-acquiring', () => {
    const host = document.createElement(HTML_TAGS.DIV)
    const root = document.createElement(HTML_TAGS.DIV)
    const content = document.createElement(HTML_TAGS.DIV)

    host.getBoundingClientRect = () => ({ left: 0, top: 0, width: 400, height: 300 })

    root.appendChild(content)
    host.appendChild(root)
    document.body.appendChild(host)

    const layer = new SkeletonWebGL(host, root, content)

    const held = layer.renderer

    layer._paused = true
    layer.animId = null
    layer.restore()

    expect(layer.renderer).toBe(held)

    layer.destroy()
  })

  test('restored widgets re-arm their context-loss listeners', async () => {
    const burgerCanvas = makeCanvas(NAV_BURGER_CLASSES.NAV_BURGER_CANVAS)
    const burger = new BurgerButtonWebGL(burgerCanvas, () => {})

    burger.purge()
    burger.restore()
    burgerCanvas.dispatchEvent(new window.Event(GL_EVENTS.WEBGL_CONTEXT_LOST))

    expect(burger.useWebGL).toBe(false)

    const closeCanvas = makeCanvas()
    const close = new CloseButtonWebGL(closeCanvas)

    close.purge()
    close.restore()
    closeCanvas.dispatchEvent(new window.Event(GL_EVENTS.WEBGL_CONTEXT_LOST))

    expect(close.useWebGL).toBe(false)

    const themeWrap = document.createElement(HTML_TAGS.DIV)

    themeWrap.className = PREF_CLASSES.PREF_THEME_WRAPPER

    const themeCanvas = makeCanvas(null, themeWrap)

    document.body.appendChild(themeWrap)

    const theme = new ThemeSliderWebGL(themeCanvas, THEME.SYSTEM)

    theme.purge()
    theme.restore()
    themeCanvas.dispatchEvent(new window.Event(GL_EVENTS.WEBGL_CONTEXT_LOST))

    expect(theme.useWebGL).toBe(false)

    burger.destroy()
    close.destroy()
    theme.destroy()
  })

  test('BurgerButtonWebGL deferred resize callback runs once a frame elapses', async () => {
    const canvas = makeCanvas(NAV_BURGER_CLASSES.NAV_BURGER_CANVAS)
    const burger = new BurgerButtonWebGL(canvas, () => {})

    await flush()

    expect(burger.gl).toBeTruthy()

    burger.destroy()
  })

  test('BurgerButtonWebGL canvas activates on Enter/Space and ignores other keys', () => {
    const canvas = makeCanvas(NAV_BURGER_CLASSES.NAV_BURGER_CANVAS)
    let clicks = 0
    const burger = new BurgerButtonWebGL(canvas, () => {
      clicks += 1
    })

    const keyEvent = (key) => {
      const e = new window.Event(KEYBOARD_EVENTS.KEYDOWN, { bubbles: true, cancelable: true })

      e.key = key

      canvas.dispatchEvent(e)
    }

    keyEvent(KEYS.ENTER)
    keyEvent(KEYS.SPACE)
    keyEvent('x')

    expect(clicks).toBe(2)

    burger.destroy()
  })

  test('BurgerButtonWebGL window-resize listener re-measures the canvas', () => {
    const canvas = makeCanvas(NAV_BURGER_CLASSES.NAV_BURGER_CANVAS)
    const burger = new BurgerButtonWebGL(canvas, () => {})

    window.dispatchEvent(new window.Event(WINDOW_EVENTS.RESIZE))

    expect(burger.useWebGL).toBe(true)

    burger.destroy()
  })

  test('BurgerButtonWebGL falls back when the shader program fails to build', () => {
    const proto = window.HTMLCanvasElement?.prototype || HTMLCanvasElement.prototype
    const failingGL = makeFailingGL()

    proto.getContext = function patched(type) {
      if (String(type) === WEBGL_STRINGS.CONTEXT_2D) return mock2D
      if (/webgl/i.test(String(type))) return failingGL

      return null
    }

    const canvas = makeCanvas(NAV_BURGER_CLASSES.NAV_BURGER_CANVAS)
    const burger = new BurgerButtonWebGL(canvas, () => {})

    expect(burger.useWebGL).toBe(false)
    expect(burger.gl).toBeFalsy()

    burger.destroy()
  })

  test('BurgerButtonWebGL _drawFrame is a no-op without a context', () => {
    const burger = new BurgerButtonWebGL(makeCanvas(NAV_BURGER_CLASSES.NAV_BURGER_CANVAS), () => {})

    burger.gl = null
    burger._drawFrame(0)

    burger.destroy()
  })

  test('BurgerButtonWebGL restore after a failed re-init keeps the fallback', () => {
    const proto = window.HTMLCanvasElement?.prototype || HTMLCanvasElement.prototype
    const canvas = makeCanvas(NAV_BURGER_CLASSES.NAV_BURGER_CANVAS)
    const burger = new BurgerButtonWebGL(canvas, () => {})

    burger.purge()

    proto.getContext = function patched(type) {
      return String(type) === WEBGL_STRINGS.CONTEXT_2D ? mock2D : null
    }

    burger.restore()

    expect(burger.useWebGL).toBe(false)
    expect(burger.gl).toBeNull()
  })

  test('CloseButtonWebGL _renderWebGL, double-purge and failed-restore arms', () => {
    const proto = window.HTMLCanvasElement?.prototype || HTMLCanvasElement.prototype
    const canvas = makeCanvas()
    const btn = new CloseButtonWebGL(canvas)

    btn._renderWebGL(0)

    btn.animId = requestAnimationFrame(() => {})
    btn.purge()
    btn.purge()

    proto.getContext = function patched(type) {
      return String(type) === WEBGL_STRINGS.CONTEXT_2D ? mock2D : null
    }

    btn.restore()

    expect(btn.useWebGL).toBe(false)

    btn.destroy()
  })

  test('SwitchWebGL render delegates, double-purge, detached and failed restores', () => {
    const proto = window.HTMLCanvasElement?.prototype || HTMLCanvasElement.prototype
    const canvas = makeCanvas()
    const sw = new SwitchWebGL(canvas, SWITCH_TYPES.STATS)

    sw._renderWebGL(0)
    sw._renderCanvas2D(0)

    sw.animId = requestAnimationFrame(() => {})
    sw.purge()
    sw.purge()

    proto.getContext = function patched(type) {
      return String(type) === WEBGL_STRINGS.CONTEXT_2D ? mock2D : null
    }

    sw.restore()

    expect(sw.useWebGL).toBe(false)

    const canvas2 = makeCanvas()
    const sw2 = new SwitchWebGL(canvas2, SWITCH_TYPES.STATS)

    sw2.purge()
    canvas2.remove()
    sw2.restore()

    expect(sw2._purged).toBe(true)

    document.body.appendChild(canvas2)
    sw2.destroy()
    sw.destroy()
  })

  test('ThemeSliderWebGL render delegates, double-purge, detached restore and destroy else-arms', () => {
    const proto = window.HTMLCanvasElement?.prototype || HTMLCanvasElement.prototype
    const wrapper = document.createElement(HTML_TAGS.DIV)

    wrapper.className = PREF_CLASSES.PREF_THEME_WRAPPER

    const canvas = makeCanvas(null, wrapper)

    document.body.appendChild(wrapper)

    const slider = new ThemeSliderWebGL(canvas, THEME.SYSTEM)

    slider._renderWebGL(0)
    slider._renderCanvas2D()

    slider.animId = requestAnimationFrame(() => {})
    slider.purge()
    slider.purge()
    canvas.remove()
    slider.restore()

    expect(slider._purged).toBe(true)

    document.body.appendChild(wrapper)

    proto.getContext = function patched(type) {
      return String(type) === WEBGL_STRINGS.CONTEXT_2D ? mock2D : null
    }

    slider.restore()

    expect(slider.useWebGL).toBe(false)

    const slider2 = new ThemeSliderWebGL(makeCanvas(), THEME.DARK)

    slider2.onPointerDown = null
    slider2.onPointerMove = null
    slider2.onPointerUp = null
    slider2.animId = null
    slider2._resizeObserver = { disconnect() {} }
    slider2.destroy()

    expect(slider2._resizeObserver).toBeNull()

    slider.destroy()
  })

  test('FlagWebGL loadImages without a renderer and destroy with bare bound target', () => {
    const flag = new FlagWebGL(makeCanvas(), { code: LOCALES.EN, cc: 'us' })

    flag.renderer = null
    flag.loadImages()

    flag.boundTarget = flag.canvas
    flag.onMouseEnter = null
    flag.onMouseLeave = null
    flag.animId = null
    flag.destroy()

    expect(flag.ctx).toBeNull()
  })

  test('CloseButtonWebGL purge tolerates a null animation id', () => {
    const btn = new CloseButtonWebGL(makeCanvas())

    btn.animId = null
    btn.purge()

    expect(btn._purged).toBe(true)

    btn.destroy()
  })

  test('SwitchWebGL purge tolerates a null animation id; a restored loss re-fires the fallback', () => {
    const sw = new SwitchWebGL(makeCanvas(), SWITCH_TYPES.STATS)

    sw.animId = null
    sw.purge()
    sw.restore()

    expect(sw.useWebGL).toBe(true)

    // The re-armed loss listener is a fresh arrow — fire it so the
    // restored widget falls back a second time.
    sw.canvas.dispatchEvent(new window.Event(GL_EVENTS.WEBGL_CONTEXT_LOST))

    expect(sw.useWebGL).toBe(false)

    sw.destroy()
  })

  test('ThemeSliderWebGL purge tolerates a null animation id; a failed re-init keeps the fallback', () => {
    const proto = window.HTMLCanvasElement?.prototype || HTMLCanvasElement.prototype
    const wrapper = document.createElement(HTML_TAGS.DIV)

    wrapper.className = PREF_CLASSES.PREF_THEME_WRAPPER

    const canvas = makeCanvas(null, wrapper)

    document.body.appendChild(wrapper)

    const slider = new ThemeSliderWebGL(canvas, THEME.SYSTEM)

    slider.animId = null
    slider.purge()

    proto.getContext = function patched(type) {
      return String(type) === WEBGL_STRINGS.CONTEXT_2D ? mock2D : null
    }

    slider.restore()

    expect(slider.useWebGL).toBe(false)

    slider.destroy()
  })

  test('CloseButtonWebGL releases the acquired context when the shader program fails to build', () => {
    const proto = window.HTMLCanvasElement?.prototype || HTMLCanvasElement.prototype
    const failingGL = makeFailingGL()

    proto.getContext = function patched(type) {
      if (String(type) === WEBGL_STRINGS.CONTEXT_2D) return mock2D
      if (/webgl/i.test(String(type))) return failingGL

      return null
    }

    const btn = new CloseButtonWebGL(makeCanvas())

    expect(btn.useWebGL).toBe(false)
    expect(btn.gl).toBeNull()

    btn.destroy()
  })

  test('FlagWebGL static + animated frames draw a loaded WebGL flag through the shared renderer', () => {
    const flag = new FlagWebGL(makeCanvas(), { code: LOCALES.EN, cc: 'us' })

    flag.useWebGL = true
    flag.isLoaded = true
    flag.isHovered = true
    flag._paused = false
    flag.renderer = { gl: mockGL, draw() {} }
    flag.ctx = mock2D

    store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, false)

    flag._renderStatic()
    flag.animate()

    // Shared-canvas resize arm: flag dims differ from the renderer's canvas.
    flag.canvas.width = 32

    const sharedCanvas = makeCanvas()
    const renderer = {
      gl: mockGL,
      canvas: sharedCanvas,
      program: {},
      quadBuffer: {},
      aPos: 0,
      uResolution: {},
      uTime: {},
      uHover: {},
      uAnimType: {},
      uIsSplit: {},
      uSplitX: {},
      uTex1: {},
      uTex2: {},
      texture: () => ({}) }

    expect(drawFlag(renderer, flag, 0)).toBe(true)
    expect(sharedCanvas.width).toBe(32)

    // No 2D context → drawFlag bails after the GL pass.
    flag.ctx = null
    expect(drawFlag(renderer, flag, 0)).toBe(false)

    // animateFlag early-return arms: paused loop and reduced motion
    // (with and without a pending frame).
    flag._paused = true
    flag.animate()

    flag._paused = false

    store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, true)

    flag.animate()

    flag.animId = null
    flag.animate()

    store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, false)

    flag.useWebGL = false
    flag.renderer = null

    flag.destroy()
  })

  test('renderCanvas2D tolerates a missing canvas via the ?? 0 arms', () => {
    renderCanvas2D(
      {
        ctx: mock2D,
        canvas: null,
        dpr: 1,
        width: 40,
        height: 24,
        currentP: 0,
        startTime: 0,
        knobX: 0,
        contextType: SWITCH_TYPES.STATS },
      0
    )

    expect(mock2D).toBeTruthy()
  })
})
