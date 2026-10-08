/**
 * @file webgl-widgets-skeletonwebgl.test.js
 * @description Split from webgl-widgets.test.js — covers the "SkeletonWebGL" describe.
 */
import { describe, test, expect, beforeEach, afterEach } from '@jest/globals'
import { SkeletonWebGL } from '@core/utils/canvas/loaders/skeleton-webgl.js'
import { createMockGL, createMock2D } from '@tests/fixtures/mock-webgl.js'
import { TEST_GPU } from '@tests/fixtures/test-constants.js'
import store from '@core/store.js'
import { PREF_MUTATIONS } from '@core/tokens/events/mutations.js'
import { WEBGL_STRINGS } from '@core/tokens/strings/webgl.js'
import { STATE_CLASSES } from '@core/tokens/classes/state.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { GL_EVENTS } from '@core/tokens/events/dom.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'
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

// ─── SkeletonWebGL ───────────────────────────────────────────────────────────
describe('SkeletonWebGL', () => {
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

  test('acquires the renderer and installs the layer canvas', () => {
    const { host, root, content } = makeHost()
    const layer = new SkeletonWebGL(host, root, content)

    expect(layer.useWebGL).toBe(true)
    expect(layer.canvas).toBeTruthy()
    expect(host.classList.contains(SKELETON_CLASSES.HAS_SKELETON_LAYER)).toBe(true)

    layer.destroy()
  })

  test('falls back to null canvas when no renderer can be acquired', () => {
    const proto = window.HTMLCanvasElement?.prototype || HTMLCanvasElement.prototype

    proto.getContext = () => null

    const { host, root, content } = makeHost()
    const layer = new SkeletonWebGL(host, root, content)

    expect(layer.canvas).toBeNull()

    layer.destroy()
  })

  test('_parseCssColor handles hex, rgb and color(srgb) syntax', () => {
    const { host, root, content } = makeHost()
    const layer = new SkeletonWebGL(host, root, content)

    expect(layer._parseCssColor('#ff0000')).toEqual([1, 0, 0])
    expect(layer._parseCssColor('#f00')).toEqual([1, 0, 0])
    expect(layer._parseCssColor('rgb(255, 0, 0)')).toEqual([1, 0, 0])
    expect(layer._parseCssColor('rgba(0, 255, 0, 0.5)')).toEqual([0, 1, 0])
    expect(layer._parseCssColor('color(srgb 1 0 0)')).toEqual([1, 0, 0])
    expect(layer._parseCssColor('bogus')).toBeNull()
    expect(layer._parseCssColor(42)).toBeNull()

    layer.destroy()
  })

  test('refresh measures skeleton placeholders into rect data', () => {
    const { host, root, content } = makeHost()
    const layer = new SkeletonWebGL(host, root, content)

    layer.base = [0.1, 0.1, 0.1]
    layer.ink = [0.9, 0.9, 0.9]

    const node = document.createElement(HTML_TAGS.DIV)

    node.className = SKELETON_CLASSES.SKELETON_BLOCK
    node.getBoundingClientRect = () => ({ left: 10, top: 20, width: 100, height: 40 })
    content.appendChild(node)

    layer.refresh()

    expect(layer.rects).toHaveLength(1)
    expect(layer.rects[0].w).toBe(100)
    expect(layer.rectData[0]).toBeDefined()

    layer.destroy()
  })

  test('refresh skips when no skeleton placeholders exist', () => {
    const { host, root, content } = makeHost()
    const layer = new SkeletonWebGL(host, root, content)

    layer.refresh()

    expect(layer.rects).toHaveLength(0)

    layer.destroy()
  })

  test('purge pauses rendering and restore resumes it', () => {
    const { host, root, content } = makeHost()
    const layer = new SkeletonWebGL(host, root, content)

    layer.purge()

    expect(layer._paused).toBe(true)

    layer.restore()

    expect(layer._paused).toBe(false)

    layer.destroy()
  })

  test('resolve animates the reveal then cleans up', async () => {
    const { host, root, content } = makeHost()
    const layer = new SkeletonWebGL(host, root, content)

    layer.base = [0.1, 0.1, 0.1]
    layer.ink = [0.9, 0.9, 0.9]
    layer.resolve()

    expect(layer.resolveStart).toBeGreaterThan(0)

    await flushFrames(60)

    layer.destroy()
  })

  test('dark mode samples the dark ink alpha', () => {
    document.documentElement.classList.add(STATE_CLASSES.DARK_MODE)

    const { host, root, content } = makeHost()
    const layer = new SkeletonWebGL(host, root, content)

    layer._sampleTheme()

    layer.destroy()
  })

  test('software rasterizers take the CSS fallback and the ref is returned', () => {
    const { host, root, content } = makeHost()
    const probe = new SkeletonWebGL(host, root, content)
    const renderer = probe.renderer

    probe.destroy()

    const swGL = new Proxy(
      {},
      {
        get(_t, prop) {
          if (typeof prop === TYPE_STRINGS.STRING && prop === prop.toUpperCase()) return 1

          return (...args) => {
            if (prop === 'getExtension') {
              return { UNMASKED_RENDERER_WEBGL: 1, loseContext: () => {} }
            }
            if (prop === 'getParameter') return TEST_GPU.SOFTWARE_RENDERER

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

    const proto = window.HTMLCanvasElement?.prototype || HTMLCanvasElement.prototype

    proto.getContext = (type) => (/webgl/i.test(String(type)) ? swGL : null)

    const layer = new SkeletonWebGL(host, root, content)

    expect(layer.canvas).toBeNull()
    expect(renderer.lost).toBe(true)
    expect(renderer.refs).toBe(0)

    renderer._dispose()

    expect(renderer.lost).toBe(false)

    layer.destroy()
  })

  test('context loss marks the renderer; stale canvas events are ignored', () => {
    const { host, root, content } = makeHost()
    const layer = new SkeletonWebGL(host, root, content)
    const renderer = layer.renderer
    const live = renderer.canvas

    live.dispatchEvent(new window.Event(GL_EVENTS.WEBGL_CONTEXT_LOST, { cancelable: true }))

    expect(renderer.lost).toBe(true)
    expect(renderer.gl).toBeNull()

    layer.destroy()

    const layer2 = new SkeletonWebGL(host, root, content)
    const oldLive = layer2.renderer.canvas

    layer2.destroy()

    const layer3 = new SkeletonWebGL(host, root, content)

    oldLive.dispatchEvent(new window.Event(GL_EVENTS.WEBGL_CONTEXT_LOST, { cancelable: true }))

    expect(layer3.renderer.lost).toBe(false)

    layer3.destroy()
  })

  test('shader compile failure keeps the widget in the fallback path', () => {
    const proto = window.HTMLCanvasElement?.prototype || HTMLCanvasElement.prototype
    const failingGL = new Proxy(
      {},
      {
        get(_t, prop) {
          if (typeof prop === TYPE_STRINGS.STRING && prop === prop.toUpperCase()) return 1

          return (...args) => {
            if (prop === 'getShaderParameter') return false
            if (prop === 'getShaderInfoLog') return 'compile failed'

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

    proto.getContext = (type) => (/webgl/i.test(String(type)) ? failingGL : null)

    const { host, root, content } = makeHost()
    const layer = new SkeletonWebGL(host, root, content)

    expect(layer.canvas).toBeNull()

    layer.destroy()
  })

  test('refresh classifies text-like placeholders by selector and height', () => {
    const { host, root, content } = makeHost()
    const layer = new SkeletonWebGL(host, root, content)

    layer.base = [0.1, 0.1, 0.1]
    layer.ink = [0.9, 0.9, 0.9]

    const textNode = document.createElement(HTML_TAGS.DIV)

    textNode.className = SKELETON_CLASSES.SKELETON_BLOCK
    textNode.getBoundingClientRect = () => ({ left: 0, top: 0, width: 100, height: 16 })

    const mediaNode = document.createElement(HTML_TAGS.DIV)

    mediaNode.className = SKELETON_CLASSES.SKELETON_BLOCK
    mediaNode.getBoundingClientRect = () => ({ left: 0, top: 30, width: 100, height: 200 })

    content.appendChild(textNode)
    content.appendChild(mediaNode)

    layer.refresh()

    expect(layer.rects).toHaveLength(2)

    layer.destroy()
  })

  test('_scheduleRefresh no-ops when paused, unscheduled, or without WebGL', async () => {
    const { host, root, content } = makeHost()
    const layer = new SkeletonWebGL(host, root, content)

    layer.useWebGL = false
    layer._scheduleRefresh()

    expect(layer._refreshId).toBeFalsy()

    layer.useWebGL = true
    layer._scheduleRefresh()

    expect(layer._refreshId).toBeTruthy()

    await flushFrames(40)

    layer.destroy()
  })
})
