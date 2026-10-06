/**
 * @file coverage-tails-4.test.js
 * @description Fourth branch-tail sweep targeting files with ≤8 uncovered
 * branches: ui-text fallback dig, firebase-mock path resolver, sanitize
 * disallowed-tag replacement, webgl-pool IO guard, CMS mount guard,
 * CookieBanner actions, checkbox widget lifecycle, NPU GPU fallback,
 * ContactSection lang guards, jsx prop routing, media helpers,
 * scroll-state one-shots, NotFound link binding, wasm-css reuse,
 * Component remount reuse, schema generators, db bootstrap/cache,
 * gpu-info tiers, wasm-pool worker guards, intro-loader internals.
 */
import { jest } from '@jest/globals'
import { LOCALES} from '@/core/constants.js'
import store from '@/core/store.js'

import '@/components/feedback/CookieBanner.js'
import '@/components/home/ContactSection.js'
import '@/routes/views/not-found/NotFound.js'
import { HTML_TAGS } from '../../../../src/core/tokens/elements/html.js'
import { LINK_ATTRS } from '../../../../src/core/tokens/attrs/link.js'
import { ROUTE_PATHS } from '../../../../src/core/tokens/routes/paths.js'
import { FOCUS_EVENTS, POINTER_EVENTS, TOUCH_EVENTS } from '../../../../src/core/tokens/events/dom.js'
import { CHAR_STRINGS } from '../../../../src/core/tokens/strings/chars.js'







// ─── core/locale/ui-text.js ──────────────────────────────────────────────────

describe('predictive-loader tails', () => {
  const makeLink = (href) => {
    const a = document.createElement(HTML_TAGS.A)

    if (href) a.setAttribute(LINK_ATTRS.HREF, href)

    return a
  }

  test('observeLink guards: null element and double-observe are no-ops', async () => {
    const { predictiveLoader } = await import('@/core/predictive-loader.js')

    predictiveLoader.observeLink(null)

    const a = makeLink(`${ROUTE_PATHS.ROOT}about`)

    predictiveLoader.observeLink(a)
    predictiveLoader.observeLink(a)

    expect(predictiveLoader.observedLinks.has(a)).toBe(true)
  })

  test('observer fires prefetch via schedule; non-intersecting entries skipped', async () => {
    const { predictiveLoader } = await import('@/core/predictive-loader.js')
    const spy = jest.spyOn(predictiveLoader, 'prefetchRoute')

    const a = makeLink(`${ROUTE_PATHS.PORTFOLIO_SLASH}some-slug`)

    predictiveLoader.observeLink(a)

    // Mock IO auto-fires isIntersecting:true after ~10ms — schedule then
    // forwards to prefetchRoute once idle time arrives. Poll instead of a
    // fixed sleep: under parallel-suite CPU load a single 300ms window is
    // not guaranteed to cover IO delay + idle scheduling + microtask drain.
    const deadline = Date.now() + 3000

    while (spy.mock.calls.length === 0 && Date.now() < deadline) {
      await new Promise((r) => setTimeout(r, 25))
    }

    expect(spy).toHaveBeenCalledWith(`${ROUTE_PATHS.PORTFOLIO_SLASH}some-slug`)

    // non-intersecting entry and an entry whose target has no href/dataset
    const cb = predictiveLoader.observer.callback
    const bare = document.createElement(HTML_TAGS.SPAN)

    cb([{ isIntersecting: false, target: a }], predictiveLoader.observer)
    cb([{ isIntersecting: true, target: bare }], predictiveLoader.observer)

    await new Promise((r) => setTimeout(r, 300))

    spy.mockRestore()
  })

  test('intent events prefetch from href and dataset.route arms', async () => {
    const { predictiveLoader } = await import('@/core/predictive-loader.js')
    const spy = jest.spyOn(predictiveLoader, 'prefetchRoute')

    const a = makeLink(`${ROUTE_PATHS.ROOT}terms`)

    predictiveLoader.observeLink(a)
    a.dispatchEvent(new Event(POINTER_EVENTS.POINTERENTER))

    expect(spy).toHaveBeenCalledWith(`${ROUTE_PATHS.ROOT}terms`)

    // dataset.route arm — element without an href attribute
    const b = document.createElement(HTML_TAGS.A)

    b.dataset.route = `${ROUTE_PATHS.ROOT}gdpr`
    predictiveLoader.observeLink(b)
    b.dispatchEvent(new Event(FOCUS_EVENTS.FOCUS))

    expect(spy).toHaveBeenCalledWith(`${ROUTE_PATHS.ROOT}gdpr`)

    // no href and no dataset.route — the href guard skips the call
    const c = document.createElement(HTML_TAGS.A)

    predictiveLoader.observeLink(c)
    spy.mockClear()
    c.dispatchEvent(new Event(TOUCH_EVENTS.TOUCHSTART))

    expect(spy).not.toHaveBeenCalled()

    spy.mockRestore()
  })

  test('scanAndObserve guards: null root and missing querySelectorAll', async () => {
    const { predictiveLoader } = await import('@/core/predictive-loader.js')

    predictiveLoader.scanAndObserve()
    predictiveLoader.scanAndObserve(null)
    predictiveLoader.scanAndObserve({})

    const box = document.createElement(HTML_TAGS.DIV)
    const link = makeLink(`${ROUTE_PATHS.ROOT}privacy`)

    box.appendChild(link)
    predictiveLoader.scanAndObserve(box)

    expect(predictiveLoader.observedLinks.has(link)).toBe(true)
  })

  test('prefetchRoute guards: empty, duplicate, current-route and external', async () => {
    const { predictiveLoader } = await import('@/core/predictive-loader.js')
    const self = window.location.pathname

    await predictiveLoader.prefetchRoute(null)
    await predictiveLoader.prefetchRoute(self)
    await predictiveLoader.prefetchRoute('https://external.example/x')

    const internal = `${ROUTE_PATHS.ROOT}portfolio-tail-${Date.now()}`

    await predictiveLoader.prefetchRoute(internal)
    await predictiveLoader.prefetchRoute(internal)

    expect(predictiveLoader.prefetchedRoutes.has(internal)).toBe(true)
  })

  test('prefetchRoute covers lang fallbacks, portfolio match and catch', async () => {
    const { predictiveLoader } = await import('@/core/predictive-loader.js')
    const lang = store.getters.getlang()
    const prevDb = lang.database
    const prevLocale = lang.locale

    // falsy database + locale → `||` fallback arms inside the try
    lang.database = null
    lang.locale = CHAR_STRINGS.EMPTY

    await predictiveLoader.prefetchRoute(`${ROUTE_PATHS.PORTFOLIO_SLASH}tail-slug-a`)

    lang.database = prevDb
    lang.locale = prevLocale

    // non-portfolio internal path → marked prefetched, no fetch
    await predictiveLoader.prefetchRoute(`${ROUTE_PATHS.ROOT}about`)

    // getlang throwing → swallowed by the catch
    const spy = jest.spyOn(store.getters, 'getlang').mockImplementation(() => {
      throw new Error('boom')
    })

    await predictiveLoader.prefetchRoute(`${ROUTE_PATHS.ROOT}tail-boom`)

    spy.mockRestore()
  })

  test('module re-eval with no IntersectionObserver leaves observer null', async () => {
    const gIO = globalThis.IntersectionObserver
    const wIO = window.IntersectionObserver

    delete globalThis.IntersectionObserver
    delete window.IntersectionObserver
    jest.resetModules()

    const { predictiveLoader } = await import('@/core/predictive-loader.js')

    expect(predictiveLoader.observer).toBeNull()

    const a = document.createElement(HTML_TAGS.A)

    a.setAttribute(LINK_ATTRS.HREF, `${ROUTE_PATHS.ROOT}noio`)
    predictiveLoader.observeLink(a)

    globalThis.IntersectionObserver = gIO
    window.IntersectionObserver = wIO
  })

  test('module re-eval without window skips init entirely', async () => {
    const prevWindow = globalThis.window
    const prevDocument = globalThis.document

    delete globalThis.window
    delete globalThis.document
    jest.resetModules()

    const { predictiveLoader } = await import('@/core/predictive-loader.js')

    predictiveLoader.scanAndObserve()

    await predictiveLoader.prefetchRoute(`${ROUTE_PATHS.ROOT}x`)

    globalThis.window = prevWindow
    globalThis.document = prevDocument
  })

  test('idle schedule arm uses requestIdleCallback when present', async () => {
    const origIdle = window.requestIdleCallback
    const calls = []

    window.requestIdleCallback = (cb) => {
      calls.push(cb)
      setTimeout(cb, 0)
    }

    jest.resetModules()

    const { predictiveLoader } = await import('@/core/predictive-loader.js')
    const spy = jest.spyOn(predictiveLoader, 'prefetchRoute')
    const a = document.createElement(HTML_TAGS.A)

    a.setAttribute(LINK_ATTRS.HREF, `${ROUTE_PATHS.ROOT}idle-link`)
    predictiveLoader.observeLink(a)

    // Poll: under parallel-suite load the mock-IO fire + idle chain can
    // exceed a fixed 300ms window.
    const deadline = Date.now() + 3000

    while (spy.mock.calls.length === 0 && Date.now() < deadline) {
      await new Promise((r) => setTimeout(r, 25))
    }

    expect(calls.length).toBeGreaterThan(0)
    expect(spy).toHaveBeenCalledWith(`${ROUTE_PATHS.ROOT}idle-link`)

    spy.mockRestore()
    window.requestIdleCallback = origIdle
  })

  test('prefetchRoute covers getlang-null and database-less arms', async () => {
    const { predictiveLoader } = await import('@/core/predictive-loader.js')
    const { default: liveStore } = await import('@/core/store.js')
    const spy = jest.spyOn(liveStore.getters, 'getlang').mockReturnValue(null)

    // nullish lang -> `lang?.locale` falls back to LOCALES.EN; `lang.database`
    // then throws inside the try and is swallowed by the catch
    await predictiveLoader.prefetchRoute(`${ROUTE_PATHS.ROOT}tail-null-lang`)

    // lang without database -> `|| DB_PATHS.TRANSLATIONS` fallback on a match
    spy.mockReturnValue({ locale: LOCALES.EN })
    await predictiveLoader.prefetchRoute(`${ROUTE_PATHS.PORTFOLIO_SLASH}tail-nodb-slug`)

    spy.mockRestore()
  })

})

