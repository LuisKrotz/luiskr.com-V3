/**
 * @file utils-misc-predictiveloader.test.js
 * @description Split from utils-misc.test.js — covers the "predictiveLoader" describe.
 */
import { describe, test, expect } from '@jest/globals'
import { predictiveLoader } from '@core/predictive-loader.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { LINK_ATTRS } from '@core/tokens/attrs/link.js'
import { ROUTE_PATHS } from '@core/tokens/routes/paths.js'
import { POINTER_EVENTS } from '@core/tokens/events/dom.js'

const _flush = (ms = 60) => new Promise((resolve) => setTimeout(resolve, ms))

// ─── predictive-loader ───────────────────────────────────────────────────────
describe('predictiveLoader', () => {
  test('observeLink attaches intent listeners once per element', () => {
    const link = document.createElement(HTML_TAGS.A)

    link.setAttribute(LINK_ATTRS.HREF, `${ROUTE_PATHS.ROOT}portfolio/metcha`)

    predictiveLoader.observeLink(link)
    predictiveLoader.observeLink(link)

    link.dispatchEvent(new window.Event(POINTER_EVENTS.POINTERENTER))

    expect(predictiveLoader.prefetchedRoutes.size).toBeGreaterThan(0)
  })

  test('scanAndObserve discovers links under a root', () => {
    const root = document.createElement(HTML_TAGS.DIV)
    const link = document.createElement(HTML_TAGS.A)

    link.setAttribute(LINK_ATTRS.HREF, `${ROUTE_PATHS.ROOT}about`)
    root.appendChild(link)
    document.body.appendChild(root)

    predictiveLoader.scanAndObserve(root)
  })

  test('prefetchRoute ignores external and current-route paths', async () => {
    await predictiveLoader.prefetchRoute('https://external.example/x')
    await predictiveLoader.prefetchRoute(window.location.pathname)

    expect(predictiveLoader.prefetchedRoutes.has('https://external.example/x')).toBe(false)
  })

  test('prefetchRoute dedupes repeated route paths', async () => {
    const path = `${ROUTE_PATHS.ROOT}portfolio/dedup-test`

    await predictiveLoader.prefetchRoute(path)
    await predictiveLoader.prefetchRoute(path)

    expect(predictiveLoader.prefetchedRoutes.has(path)).toBe(true)
  })
})
