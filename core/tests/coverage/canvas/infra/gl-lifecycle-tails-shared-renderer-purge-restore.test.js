/**
 * @file gl-lifecycle-tails-shared-renderer-purge-restore.test.js
 * @description Split from gl-lifecycle-tails.test.js — covers the "shared-renderer purge/restore" describe.
 */
import { describe, test, expect, beforeEach, afterEach } from '@jest/globals'
import { SkeletonWebGL } from '@core/utils/canvas/loaders/skeleton-webgl.js'
import { FlagWebGL } from '@core/utils/canvas/widgets/flag-webgl.js'
import { createMockGL, createMock2D } from '@tests/fixtures/mock-webgl.js'
import { WEBGL_STRINGS } from '@core/tokens/strings/webgl.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'
import { STATE_CLASSES } from '@core/tokens/classes/state.js'
import { SKELETON_CLASSES } from '@core/tokens/classes/skeleton.js'

import { LOCALES } from '@core/constants.js'

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
