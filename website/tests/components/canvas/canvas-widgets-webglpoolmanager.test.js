/**
 * @file canvas-widgets-webglpoolmanager.test.js
 * @description Split from canvas-widgets.test.js — covers the "WebGLPoolManager" describe.
 */
import { describe, test, expect, jest, beforeEach } from '@jest/globals'
import { webglPool } from '@core/utils/canvas/webgl-pool.js'
import { attachMockGL } from '@tests/fixtures/mock-webgl.js'
import store from '@core/store.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { PREF_MUTATIONS } from '@core/tokens/events/mutations.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'

const makeCanvas = () => document.createElement(HTML_TAGS.CANVAS)

const _flushFrames = (ms = 80) => new Promise((resolve) => setTimeout(resolve, ms))

const WebGLPoolManager = webglPool.constructor

const _makeRectCanvas = (width = 300) => {
  const canvas = makeCanvas()

  canvas.getBoundingClientRect = () => ({ left: 0, top: 0, width, height: 64 })

  return canvas
}

beforeEach(() => {
  store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, false)
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
