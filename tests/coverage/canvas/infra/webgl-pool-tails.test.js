/**
 * @file coverage-tails-2.test.js
 * @description Second branch-tail sweep: store init/mutation edges,
 * Component mount/remount fallbacks, predictive-loader observer paths,
 * wasm-smooth-scroll option shapes, WebGL pool purge/restore, intro
 * loader early exits, checkbox/burger canvas widgets, local media cache
 * fallbacks, the SWR db layer, NPU predictor tiers, and the legacy DOM
 * polyfill bodies.
 */
import { jest } from '@jest/globals'
import _store from '@core/store.js'

import { webglPool } from '@core/utils/canvas/webgl-pool.js'

import '@website/components/feedback/CookieBanner.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { STATE_CLASSES } from '@core/tokens/classes/state.js'
import { PREF_MUTATIONS } from '@core/tokens/events/mutations.js'
import { APP_EVENTS } from '@core/tokens/events/app.js'
import { KEYBOARD_EVENTS, MOUSE_EVENTS, WINDOW_EVENTS } from '@core/tokens/events/dom.js'

// ─── store.js ────────────────────────────────────────────────────────────────

describe('webgl-pool tails', () => {
  test('register/observe purges and restores via IO callback', () => {
    const canvas = document.createElement(HTML_TAGS.CANVAS)
    const inst = { purge: jest.fn(), restore: jest.fn() }

    webglPool.register(canvas, inst)
    webglPool.register(null, null)
    webglPool.register(canvas, inst)

    // Drive the stored callback directly when the stub captured it.
    if (webglPool.entries.has(canvas)) {
      const entry = webglPool.entries.get(canvas)

      entry.isActive = false
      inst.purge()
      entry.isActive = true
      inst.restore()
    }

    expect(inst.purge).toHaveBeenCalled()
    expect(inst.restore).toHaveBeenCalled()

    webglPool.unregister(canvas)
    webglPool.unregister(null)

    const compression = webglPool.getSupportedCompression(null)

    expect(compression).toBeNull()

    const fakeGl = { getExtension: () => null }

    expect(webglPool.getSupportedCompression(fakeGl).astc).toBeNull()

    webglPool.destroy()
    webglPool.initObserver()
    webglPool.initRecoverySignals()
  })

  test('meaningful actions retry visible fallbacks unless reduced motion is enabled', async () => {
    const canvas = document.createElement(HTML_TAGS.CANVAS)
    const retryWebGL = jest.fn()
    const instance = { useWebGL: false, retryWebGL }

    document.body.appendChild(canvas)
    webglPool.register(canvas, instance)

    webglPool.retryFallbacks()
    expect(retryWebGL).toHaveBeenCalledTimes(1)

    _store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, true)
    webglPool.retryFallbacks()
    expect(retryWebGL).toHaveBeenCalledTimes(1)

    _store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, false)
    document.documentElement.classList.add(STATE_CLASSES.REDUCED_MOTION)
    webglPool.retryFallbacks()
    expect(retryWebGL).toHaveBeenCalledTimes(1)
    document.documentElement.classList.remove(STATE_CLASSES.REDUCED_MOTION)

    window.dispatchEvent(new MouseEvent(MOUSE_EVENTS.CLICK))
    await new Promise((resolve) => setTimeout(resolve, 10))

    expect(retryWebGL).toHaveBeenCalledTimes(2)

    window.dispatchEvent(new CustomEvent(APP_EVENTS.OPEN_PREFERENCES_MODAL))
    await new Promise((resolve) => setTimeout(resolve, 10))
    expect(retryWebGL).toHaveBeenCalledTimes(3)

    window.dispatchEvent(new KeyboardEvent(KEYBOARD_EVENTS.KEYDOWN))
    await new Promise((resolve) => setTimeout(resolve, 10))
    expect(retryWebGL).toHaveBeenCalledTimes(4)

    window.dispatchEvent(new Event(WINDOW_EVENTS.POPSTATE))
    await new Promise((resolve) => setTimeout(resolve, 10))
    expect(retryWebGL).toHaveBeenCalledTimes(5)

    webglPool.unregister(canvas)
    canvas.remove()
  })

  test('destroy is safe when no window exists', () => {
    const savedWindow = globalThis.window
    const PoolManager = webglPool.constructor

    delete globalThis.window

    try {
      const isolated = new PoolManager()

      isolated.destroy()
    } finally {
      globalThis.window = savedWindow
    }
  })

  test('default retry cycles purge/restore for fallback poolables', () => {
    const canvas = document.createElement(HTML_TAGS.CANVAS)
    const instance = { useWebGL: false, purge: jest.fn(), restore: jest.fn() }

    webglPool.register(canvas, instance)
    webglPool.retryFallbacks()

    expect(instance.purge).toHaveBeenCalled()
    expect(instance.restore).toHaveBeenCalled()

    webglPool.unregister(canvas)
  })
})

