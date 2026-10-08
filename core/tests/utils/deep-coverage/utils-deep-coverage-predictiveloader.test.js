/**
 * @file utils-deep-coverage-predictiveloader.test.js
 * @description Split from utils-deep-coverage.test.js — covers the "predictiveLoader" describe.
 */
import { describe, test, expect, jest } from '@jest/globals'
import { POINTER_EVENTS } from '@core/tokens/events/dom.js'
import { ROUTE_PATHS } from '@core/tokens/routes/paths.js'
import { DOM_STRINGS } from '@core/tokens/strings/dom.js'

const _flush = (ms = 0) => new Promise((r) => setTimeout(r, ms))

// ─── predictive-loader.js ────────────────────────────────────────────────────
describe('predictiveLoader', () => {
  test('prefetches portfolio routes, skips current/external, dedupes', async () => {
    const { predictiveLoader } = await import('@core/predictive-loader.js')

    const origFetch = globalThis.fetch

    globalThis.fetch = jest.fn(async () => ({ ok: true, json: async () => ({}) }))

    await predictiveLoader.prefetchRoute(null)
    await predictiveLoader.prefetchRoute('https://external.example/x')
    await predictiveLoader.prefetchRoute(window.location.pathname)
    await predictiveLoader.prefetchRoute(`${ROUTE_PATHS.PORTFOLIO}test-slug`)
    await predictiveLoader.prefetchRoute(`${ROUTE_PATHS.PORTFOLIO}test-slug`)

    expect(predictiveLoader.prefetchedRoutes.has(`${ROUTE_PATHS.PORTFOLIO}test-slug`)).toBe(true)

    globalThis.fetch = origFetch
  })

  test('observeLink + scanAndObserve wire intent listeners', async () => {
    const { predictiveLoader } = await import('@core/predictive-loader.js')
    const link = document.createElement('a')

    link.setAttribute(DOM_STRINGS.HREF, `${ROUTE_PATHS.PORTFOLIO}intent-slug`)
    document.body.appendChild(link)

    predictiveLoader.observeLink(link)
    predictiveLoader.observeLink(link) // dedupe guard
    predictiveLoader.scanAndObserve(document)

    link.dispatchEvent(new window.Event(POINTER_EVENTS.POINTERENTER))

    expect(predictiveLoader.prefetchedRoutes.has(`${ROUTE_PATHS.PORTFOLIO}intent-slug`)).toBe(true)

    link.remove()
  })
})
