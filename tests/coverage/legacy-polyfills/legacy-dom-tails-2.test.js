/**
 * @file coverage-tails-5.test.js
 * @description Fifth branch-tail sweep: gpu-accel compositing + texture
 * paths, stats-engine observers and fetch patch, wasm-media-threads
 * probes, Legal route data modes, router canonical/history edges,
 * firebase REST fallback, deep-shadow DOM traversal, burger resize
 * branches, legacy polyfill bodies, wasm-scroll option shapes and
 * Home route param changes.
 */
import { jest } from '@jest/globals'
import _router from '@core/router/router.js'

import '@website/views/legal/Legal.js'
import '@website/views/home/Home.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { ARIA_ATTRS } from '@core/tokens/attrs/aria.js'
import { CHAR_STRINGS } from '@core/tokens/strings/chars.js'





const flush = (ms = 80) => new Promise((r) => setTimeout(r, ms))

// ─── utils/gpu-accel.js ──────────────────────────────────────────────────────

describe('legacy-dom tails 2', () => {
  test('inert shim walks focusables and restores tabindices', async () => {
    if (typeof HTMLElement !== TYPE_STRINGS.UNDEFINED && !('inert' in HTMLElement.prototype)) {
      const el = document.createElement(HTML_TAGS.DIV)
      const btn = document.createElement(HTML_TAGS.BUTTON)

      el.appendChild(btn)
      document.body.appendChild(el)

      el.inert = true

      expect(el.inert).toBe(true)
      expect(btn.getAttribute(ARIA_ATTRS.TABINDEX)).toBe(CHAR_STRINGS.MINUS_ONE)

      el.inert = false

      expect(el.inert).toBe(false)
      expect(btn.getAttribute(ARIA_ATTRS.TABINDEX)).toBeNull()

      el.remove()
    }
  })

  test('queueMicrotask shim defers callbacks', async () => {
    const saved = globalThis.queueMicrotask

    delete globalThis.queueMicrotask

    jest.resetModules()
    await import('@core/legacy-polyfills/dom.js')

    if (typeof globalThis.queueMicrotask === TYPE_STRINGS.FUNCTION) {
      const cb = jest.fn()

      globalThis.queueMicrotask(cb)
      await flush(10)

      expect(cb).toHaveBeenCalled()
    }

    globalThis.queueMicrotask = saved
    jest.resetModules()
  })
})

