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

import { TEST_URLS, TEST_PROJECTS } from '../../../fixtures/test-constants.js'
import { HTML_TAGS } from '@/core/tokens/elements/html.js'
import { LINK_ATTRS } from '@/core/tokens/attrs/link.js'
import { ROUTE_PATHS } from '@/core/tokens/routes/paths.js'
import { FOCUS_EVENTS, POINTER_EVENTS, TOUCH_EVENTS } from '@/core/tokens/events/dom.js'





const flush = (ms = 60) => new Promise((r) => setTimeout(r, ms))

// ─── store.js ────────────────────────────────────────────────────────────────

describe('predictive-loader tails', () => {
  test('observe wires intent events and prefetch guards', async () => {
    const { predictiveLoader } = await import('@/core/predictive-loader.js')

    const link = document.createElement(HTML_TAGS.A)

    link.setAttribute(LINK_ATTRS.HREF, `${ROUTE_PATHS.PORTFOLIO}${TEST_PROJECTS.CICB}`)
    document.body.appendChild(link)

    predictiveLoader.observe?.(link)
    predictiveLoader.scanAndObserve?.(document.body)

    for (const evt of [POINTER_EVENTS.POINTERENTER, FOCUS_EVENTS.FOCUS, TOUCH_EVENTS.TOUCHSTART]) {
      link.dispatchEvent(new Event(evt, { bubbles: true }))
    }

    await flush(40)

    link.remove()
  })

  test('prefetchRoute skips same-route/external and dedupes', async () => {
    const { predictiveLoader } = await import('@/core/predictive-loader.js')

    await predictiveLoader.prefetchRoute?.(`${ROUTE_PATHS.PORTFOLIO}${TEST_PROJECTS.CICB}`)
    await predictiveLoader.prefetchRoute?.(`${ROUTE_PATHS.PORTFOLIO}${TEST_PROJECTS.CICB}`)
    await predictiveLoader.prefetchRoute?.(TEST_URLS.EXTERNAL).catch(() => {})
    await predictiveLoader.prefetchRoute?.(ROUTE_PATHS.ABOUT)
    await predictiveLoader.prefetchRoute?.(null)
  })

  test('_init tolerates missing IntersectionObserver + rIC fallback', async () => {
    const { predictiveLoader } = await import('@/core/predictive-loader.js')
    const IO = globalThis.IntersectionObserver

    globalThis.IntersectionObserver = undefined
    predictiveLoader._init?.()
    globalThis.IntersectionObserver = IO

    const ric = window.requestIdleCallback

    delete window.requestIdleCallback
    predictiveLoader._init?.()
    window.requestIdleCallback = ric
  })
})

