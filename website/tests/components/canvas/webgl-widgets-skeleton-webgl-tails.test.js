/**
 * @file webgl-widgets-skeleton-webgl-tails.test.js
 * @description Split from webgl-widgets.test.js — covers the "skeleton-webgl tails" describe.
 */
import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals'
import {
  SkeletonWebGL,
  syncSkeletonLayer,
  destroySkeletonLayer,
} from '@core/utils/canvas/loaders/skeleton-webgl.js'
import { createMockGL, createMock2D } from '@tests/fixtures/mock-webgl.js'
import store from '@core/store.js'
import { PREF_MUTATIONS } from '@core/tokens/events/mutations.js'
import { WEBGL_STRINGS } from '@core/tokens/strings/webgl.js'
import { STATE_CLASSES } from '@core/tokens/classes/state.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { WINDOW_EVENTS } from '@core/tokens/events/dom.js'
import { STATE_STRINGS } from '@core/tokens/strings/state.js'
import { SKELETON_CLASSES } from '@core/tokens/classes/skeleton.js'

let mockGL
let mock2D
let origGetContext

beforeEach(() => {
  store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, false)

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

  document.documentElement.classList.remove(STATE_CLASSES.DARK_MODE)
})

const _makeCanvas = () => document.createElement(HTML_TAGS.CANVAS)

const flushFrames = (ms = 80) => new Promise((resolve) => setTimeout(resolve, ms))

// ─── skeleton-webgl tails ────────────────────────────────────────────────────
describe('skeleton-webgl tails', () => {
  const makeHost = () => {
    const host = document.createElement(HTML_TAGS.DIV)
    const root = document.createElement(HTML_TAGS.DIV)
    const content = document.createElement(HTML_TAGS.DIV)

    host.getBoundingClientRect = () => ({ left: 0, top: 0, width: 400, height: 300 })

    root.appendChild(content)
    host.appendChild(root)
    document.body.appendChild(host)

    return { host, root, content }
  }

  const makeSkel = (cls, rect) => {
    const el = document.createElement(HTML_TAGS.DIV)

    el.className = cls
    el.getBoundingClientRect = () => rect

    return el
  }

  const drainRenderer = (host, root, content) => {
    const probe = new SkeletonWebGL(host, root, content)
    const renderer = probe.renderer

    while (renderer && renderer.refs > 0) renderer.release()

    probe.destroy()
  }

  test('renderer init survives a throwing getContext and a throwing renderer probe', () => {
    const proto = window.HTMLCanvasElement?.prototype || HTMLCanvasElement.prototype
    const { host, root, content } = makeHost()

    drainRenderer(host, root, content)

    proto.getContext = (type) => {
      if (/webgl/i.test(String(type))) throw new Error('no-gpu')

      return mock2D
    }

    const layer = new SkeletonWebGL(host, root, content)

    expect(layer.canvas).toBeNull()

    layer.destroy()

    const throwing = new Proxy(mockGL, {
      get: (t, p) =>
        p === 'getParameter'
          ? () => {
              throw new Error('no-info')
            }
          : t[p],
    })

    proto.getContext = (type) => (/webgl/i.test(String(type)) ? throwing : mock2D)

    const layer2 = new SkeletonWebGL(host, root, content)

    expect(layer2.useWebGL).toBe(true)

    layer2.destroy()
  })

  test('program link failure drops the layer into the fallback path', () => {
    const proto = window.HTMLCanvasElement?.prototype || HTMLCanvasElement.prototype
    const { host, root, content } = makeHost()

    drainRenderer(host, root, content)

    const failLink = new Proxy(mockGL, {
      get: (t, p) => (p === 'getProgramParameter' ? () => false : t[p]),
    })

    proto.getContext = (type) => (/webgl/i.test(String(type)) ? failLink : mock2D)

    const layer = new SkeletonWebGL(host, root, content)

    expect(layer.canvas).toBeNull()

    layer.destroy()
  })

  test('renderer acquire skips init while lost and dispose covers resource-less arms', () => {
    const { host, root, content } = makeHost()
    const a = new SkeletonWebGL(host, root, content)
    const b = new SkeletonWebGL(host, root, content)
    const renderer = a.renderer

    b.destroy()

    renderer.gl = null
    renderer.lost = true

    expect(renderer.acquire()).toBeNull()

    renderer.program = null
    renderer.quadBuffer = null
    renderer.lost = false
    renderer.gl = mockGL
    renderer._dispose()

    expect(renderer.lost).toBe(false)

    a.destroy()
  })

  test('renderer draw blits frames and early-returns without a gl context', () => {
    const { host, root, content } = makeHost()
    const layer = new SkeletonWebGL(host, root, content)

    content.appendChild(
      makeSkel(SKELETON_CLASSES.SKELETON_BLOCK, { left: 0, top: 0, width: 800, height: 600 })
    )

    layer.base = [0.1, 0.1, 0.1]
    layer.ink = [0.9, 0.9, 0.9]
    layer.refresh()

    const renderer = layer.renderer

    expect(renderer.draw(layer, 0.5, 0)).toBe(true)
    expect(renderer.draw(layer, 0.6, 0.5)).toBe(true)

    const gl = renderer.gl

    renderer.gl = null

    expect(renderer.draw(layer, 0.7, 0)).toBe(false)

    renderer.gl = gl

    layer.destroy()
  })

  test('_init returns early without document and releases the ref without a 2d context', () => {
    const proto = window.HTMLCanvasElement?.prototype || HTMLCanvasElement.prototype
    const { host, root, content } = makeHost()
    const doc = globalThis.document

    delete globalThis.document

    const layer = new SkeletonWebGL(host, root, content)

    globalThis.document = doc

    expect(layer.useWebGL).toBe(false)

    layer.destroy()

    proto.getContext = (type) => (/webgl/i.test(String(type)) ? mockGL : null)

    const layer2 = new SkeletonWebGL(host, root, content)

    expect(layer2.canvas).toBeNull()

    layer2.destroy()
  })

  test('ResizeObserver observes host and placeholders and triggers scheduled refresh', () => {
    const observed = []

    globalThis.ResizeObserver = class {
      constructor(cb) {
        this.cb = cb
      }
      observe(el) {
        observed.push(el)
      }
      unobserve() {}
      disconnect() {}
    }

    const { host, root, content } = makeHost()

    content.appendChild(
      makeSkel(SKELETON_CLASSES.SKELETON_BLOCK, { left: 0, top: 0, width: 100, height: 40 })
    )

    const layer = new SkeletonWebGL(host, root, content)

    expect(observed.length).toBeGreaterThan(1)

    layer._ro.cb()

    expect(layer._refreshId).toBeTruthy()

    delete globalThis.ResizeObserver

    layer.destroy()
  })

  test('idle-start begins the loop and destroy cancels a pending idle handle', () => {
    globalThis.requestIdleCallback = (cb) => {
      cb()
      return 1
    }
    globalThis.cancelIdleCallback = jest.fn()

    const { host, root, content } = makeHost()
    const layer = new SkeletonWebGL(host, root, content)

    expect(layer.animId).toBeTruthy()

    globalThis.requestIdleCallback = () => 7

    const layer2 = new SkeletonWebGL(host, root, content)

    layer2.destroy()

    expect(globalThis.cancelIdleCallback).toHaveBeenCalledWith(7)

    delete globalThis.requestIdleCallback
    delete globalThis.cancelIdleCallback

    layer.destroy()
  })

  test('window resize triggers a refresh through the bound listener', () => {
    const { host, root, content } = makeHost()
    const layer = new SkeletonWebGL(host, root, content)
    const spy = jest.spyOn(layer, 'refresh')

    window.dispatchEvent(new Event(WINDOW_EVENTS.RESIZE))

    expect(spy).toHaveBeenCalled()

    layer.destroy()
  })

  test('refresh guards and per-rect palette arms cover text rows, fallbacks and dpr', () => {
    const { host, root, content } = makeHost()
    const layer = new SkeletonWebGL(host, root, content)

    layer.useWebGL = false
    layer.refresh()
    layer.useWebGL = true
    layer.resolveStart = 1
    layer.refresh()
    layer.resolveStart = 0

    const origGCS = globalThis.getComputedStyle

    globalThis.getComputedStyle = (el) => ({
      lineHeight: el._lh || '',
      getPropertyValue: () => '',
    })

    const textRow = makeSkel(SKELETON_CLASSES.SKELETON_TITLE_SM, {
      left: 0,
      top: 0,
      width: 100,
      height: 20,
    })

    textRow._lh = '10px'

    const textNoLh = makeSkel(SKELETON_CLASSES.SKELETON_TITLE_SM, {
      left: 0,
      top: 30,
      width: 100,
      height: 16,
    })
    const zeroText = makeSkel(SKELETON_CLASSES.SKELETON_TITLE_SM, {
      left: 0,
      top: 60,
      width: 100,
      height: 0,
    })
    const media = makeSkel(SKELETON_CLASSES.SKELETON_BLOCK, {
      left: 0,
      top: 90,
      width: 100,
      height: 200,
    })

    content.appendChild(textRow)
    content.appendChild(textNoLh)
    content.appendChild(zeroText)
    content.appendChild(media)

    layer.base = [0.1, 0.1, 0.1]
    layer.ink = [0.9, 0.9, 0.9]

    layer.refresh()
    layer.refresh()

    expect(layer.rects.length).toBeGreaterThan(0)

    const dprDesc = Object.getOwnPropertyDescriptor(window, 'devicePixelRatio')

    Object.defineProperty(window, 'devicePixelRatio', { value: undefined, configurable: true })

    layer.refresh()

    Object.defineProperty(window, 'devicePixelRatio', dprDesc)

    layer.host = null
    layer.refresh()

    globalThis.getComputedStyle = origGCS

    layer.destroy()
  })

  test('_loop covers the stopped, paused, frame-skip, reduced and resolve-complete arms', () => {
    const { host, root, content } = makeHost()
    const layer = new SkeletonWebGL(host, root, content)

    layer.useWebGL = false
    layer._loop()
    layer.useWebGL = true

    layer._paused = true
    layer._frame = 0
    layer._loop()
    layer._frame = 1
    layer._loop()
    layer.resolveStart = 1
    layer._loop()
    layer.resolveStart = 0
    layer._paused = false

    store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, true)

    layer._frame = 1
    layer._loop()

    expect(layer.animId).toBeNull()

    layer.resolveStart = performance.now()
    layer._frame = 1
    layer._loop()
    layer.resolveStart = performance.now() - 1000
    layer._loop()

    expect(layer.canvas).toBeNull()
  })

  test('_render guards empty rects and draws through the shared renderer', () => {
    const { host, root, content } = makeHost()
    const layer = new SkeletonWebGL(host, root, content)

    layer._render(0, 0)

    layer.canvas.width = 100
    layer.canvas.height = 100
    layer.rects = [{}]
    layer.rectData = new Float32Array(4)
    layer.metaData = new Float32Array(4)
    layer.skelBaseData = new Float32Array(4)
    layer.skelInkData = new Float32Array(4)
    layer.inkAlpha = 0.1
    layer.ctx = mock2D
    layer._render(0, 0)

    layer.renderer.gl = null
    layer._render(0, 0)

    expect(layer.canvas).toBeNull()
  })

  test('resolve() covers repeated calls, the helper timeout and non-WebGL arms', async () => {
    const { host, root, content } = makeHost()
    const layer = new SkeletonWebGL(host, root, content)

    layer.resolve()
    layer.resolve()

    expect(layer.resolveStart).toBeGreaterThan(0)

    const layer2 = new SkeletonWebGL(host, root, content)

    layer2.useWebGL = false
    layer2.resolve()

    const layer3 = new SkeletonWebGL(host, root, content)

    layer3.animId = requestAnimationFrame(() => {})
    layer3.resolve()

    expect(layer3.resolveStart).toBeGreaterThan(0)

    await flushFrames(600)

    layer2.destroy()
    layer3.destroy()
  })

  test('_loop cancels its own frame under reduced motion without a resolve', () => {
    const { host, root, content } = makeHost()
    const layer = new SkeletonWebGL(host, root, content)

    layer.useWebGL = true
    layer._frame = 1

    store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, true)
    layer._loop()

    expect(layer.animId).toBeNull()

    store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, false)

    layer.destroy()
  })

  test('syncSkeletonLayer refreshes an existing layer and skips a dead one', () => {
    const el = document.createElement(HTML_TAGS.DIV)
    const shadow = el.attachShadow({ mode: STATE_STRINGS.OPEN })
    const content = document.createElement(HTML_TAGS.DIV)

    el._contentNode = content
    shadow.appendChild(content)
    document.body.appendChild(el)

    const skel = makeSkel(SKELETON_CLASSES.SKELETON_BLOCK, {
      left: 0,
      top: 0,
      width: 100,
      height: 40,
    })

    content.appendChild(skel)

    syncSkeletonLayer(el)

    const layer = el._skeletonLayer
    const spy = jest.spyOn(layer, 'refresh')

    syncSkeletonLayer(el)

    expect(spy).toHaveBeenCalled()

    layer.useWebGL = false
    syncSkeletonLayer(el)

    expect(spy).toHaveBeenCalledTimes(1)

    destroySkeletonLayer(el)
    el.remove()
  })
})
