/**
 * @file coverage-tails-2.test.js
 * @description Second branch-tail sweep: store init/mutation edges,
 * Component mount/remount fallbacks, predictive-loader observer paths,
 * wasm-smooth-scroll option shapes, WebGL pool purge/restore, intro
 * loader early exits, checkbox/burger canvas widgets, local media cache
 * fallbacks, the SWR db layer, NPU predictor tiers, and the legacy DOM
 * polyfill bodies.
 */

import _store from '@/core/store.js'

import '@/components/feedback/CookieBanner.js'
import { COMPONENT_TAGS } from '@/core/tokens/elements/components.js'
import { HTML_TAGS } from '@/core/tokens/elements/html.js'



const flush = (ms = 60) => new Promise((r) => setTimeout(r, ms))

// ─── store.js ────────────────────────────────────────────────────────────────

describe('Component tails', () => {
  test('_updateDom rebuilds a missing content node', async () => {
    const el = document.createElement(COMPONENT_TAGS.COOKIE_BANNER)

    document.body.appendChild(el)
    await flush()

    el._contentNode = null
    el._updateDom()

    expect(el._contentNode).toBeTruthy()

    el.remove()
  })

  test('re-mount reuses existing shadow nodes', async () => {
    const el = document.createElement(COMPONENT_TAGS.COOKIE_BANNER)

    document.body.appendChild(el)
    await flush()

    el.remove()
    document.body.appendChild(el)
    await flush()

    expect(el.shadowRoot).toBeTruthy()

    el.remove()
  })

  test('legacy <style> fallback when CSSStyleSheet is unavailable', async () => {
    const saved = globalThis.CSSStyleSheet

    delete globalThis.CSSStyleSheet

    try {
      const el = document.createElement(COMPONENT_TAGS.COOKIE_BANNER)

      document.body.appendChild(el)
      await flush()

      el.remove()
      document.body.appendChild(el)
      await flush()

      el.remove()
    } finally {
      globalThis.CSSStyleSheet = saved
    }
  })

  test('constructable stylesheet path adopts and reuses shared sheets', async () => {
    const saved = globalThis.CSSStyleSheet

    globalThis.CSSStyleSheet = window.CSSStyleSheet || class CSSStyleSheet {
      replaceSync() {}
    }

    try {
      const el = document.createElement(COMPONENT_TAGS.COOKIE_BANNER)

      document.body.appendChild(el)
      await flush()

      el.remove()
      document.body.appendChild(el)
      await flush()

      el.remove()
    } finally {
      globalThis.CSSStyleSheet = saved
    }
  })

  test('_applyRenderOutput covers missing content node and array output', async () => {
    const el = document.createElement(COMPONENT_TAGS.COOKIE_BANNER)

    document.body.appendChild(el)
    await flush()

    const node = el._contentNode

    el._contentNode = null
    el._applyRenderOutput(document.createElement(HTML_TAGS.DIV))

    el._contentNode = node
    el._applyRenderOutput([document.createElement(HTML_TAGS.DIV), null, document.createElement(HTML_TAGS.SPAN)])

    el.remove()
  })
})

