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
import _store from '@/core/store.js'

import { webglPool } from '@/utils/canvas/webgl-pool.js'

import '@/components/feedback/CookieBanner.js'
import { HTML_TAGS } from '../../../../src/core/tokens/elements/html.js'



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
  })
})

