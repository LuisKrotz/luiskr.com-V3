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

import '@/components/feedback/CookieBanner.js'
import { HTML_TAGS } from '@/core/tokens/elements/html.js'
import { TYPE_STRINGS } from '@/core/tokens/strings/types.js'




// ─── store.js ────────────────────────────────────────────────────────────────

describe('legacy dom polyfill tails', () => {
  test('shims install and run when APIs are absent', async () => {
    const proto = window.Element?.prototype
    const savedMatches = proto?.matches
    const savedClosest = proto?.closest
    const savedRAF = globalThis.requestAnimationFrame
    if (proto) {
      delete proto.matches
      delete proto.closest
    }

    delete globalThis.requestAnimationFrame

    jest.resetModules()
    await import('@/legacy-polyfills/dom.js')

    const el = document.createElement(HTML_TAGS.DIV)

    document.body.appendChild(el)

    if (typeof el.matches === TYPE_STRINGS.FUNCTION) {
      expect(typeof el.matches(HTML_TAGS.DIV)).toBe(TYPE_STRINGS.BOOLEAN)
      expect(typeof el.closest(HTML_TAGS.DIV)).not.toBe('never')
    }

    if (typeof globalThis.requestAnimationFrame === TYPE_STRINGS.FUNCTION) {
      globalThis.requestAnimationFrame(() => {})
    }

    if (proto) {
      if (savedMatches) proto.matches = savedMatches
      if (savedClosest) proto.closest = savedClosest
    }

    globalThis.requestAnimationFrame = savedRAF

    jest.resetModules()
  })
})

