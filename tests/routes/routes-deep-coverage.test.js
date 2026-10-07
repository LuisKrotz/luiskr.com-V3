/**
 * @file routes-deep-coverage.test.js
 * @description Branch coverage for the route views and the SPA router:
 * ViewLegal's param-change/locale-reload/waited-load paths, ViewHome's
 * scroll-to anchors, featured detection, object/array portfoliolist
 * shapes and child-data push, ViewNotFound's getters and SPA-bound home
 * link, plus router subscribe/notify, before/after hooks, popstate and
 * canonical-link syncing.
 */

import { describe, test, expect, jest, beforeEach, afterEach } from '@jest/globals'
import { ViewLegal } from '@/routes/views/legal/Legal.js'
import { ViewHome } from '@/routes/views/home/Home.js'
import { ViewNotFound } from '@/routes/views/not-found/NotFound.js'
import router from '@/routes/router.js'
import store from '@/core/store.js'
import { mount } from '../fixtures/test-constants.js'
import { LANG_MUTATIONS } from '@/core/tokens/events/mutations.js'
import { STATE_STRINGS } from '@/core/tokens/strings/state.js'
import { SECTION_IDS } from '@/core/tokens/ids/sections.js'
import { COMPONENT_TAGS } from '@/core/tokens/elements/components.js'
import { NOT_FOUND_CLASSES } from '@/core/tokens/classes/legal.js'
import { MOUSE_EVENTS, WINDOW_EVENTS } from '@/core/tokens/events/dom.js'

import { LOCALES, ROUTE_NAMES } from '@/core/constants.js'
import { TRANSLATION_KEYS } from '@/core/tokens/routes/translation-keys.js'
import { FALLBACK_PAGES } from '@/core/locale/fallback.js'
import { DOM_STRINGS } from '@/core/tokens/strings/dom.js'

const flush = (ms = 0) => new Promise((r) => setTimeout(r, ms))

let origFetch
let cleanups = []

beforeEach(() => {
  origFetch = globalThis.fetch
  window.scrollTo = jest.fn()
})

afterEach(() => {
  globalThis.fetch = origFetch
  cleanups.forEach((c) => c())
  cleanups = []
})

// Revalidation payload identical → snapshot kept, no onUpdate.
const mockStableFetch = () => {
  globalThis.fetch = jest.fn(async () => ({ ok: true, json: async () => null }))
}

// ─── ViewLegal ───────────────────────────────────────────────────────────────

describe('ViewLegal branches', () => {
  test('onRouteParamChange retitles and reloads for legal routes', async () => {
    mockStableFetch()

    const el = new ViewLegal()
    cleanups.push(mount(el))

    el.onRouteParamChange({ meta: { legalRoute: true, title: 'Doc Title' } })

    expect(document.title).toBe('Doc Title')
    expect(el.translations).toBeNull()
    expect(window.scrollTo).toHaveBeenCalled()

    el.onRouteParamChange({ meta: { legalRoute: false } })
    el.onRouteParamChange(null)

    await flush(10)
  })

  test('onStoreUpdate reloads when the locale actually changes', async () => {
    mockStableFetch()

    const el = new ViewLegal()
    cleanups.push(mount(el))

    await flush(10)

    const spy = jest.spyOn(el, 'loadData')

    el._lastLocale = LOCALES.EN
    store.commit(LANG_MUTATIONS.SET_LANG, LOCALES.ES)

    await flush(10)

    expect(spy).toHaveBeenCalled()

    store.commit(LANG_MUTATIONS.SET_LANG, LOCALES.EN)
  })

  test('loadData applies meta title and the waited swap path', async () => {
    mockStableFetch()

    router.currentRoute = {
      meta: { title: 'Legal Page', translation: TRANSLATION_KEYS.TERMS_OF_USE },
    }

    const el = new ViewLegal()
    cleanups.push(mount(el))

    el.loadData(50)

    await flush(120)

    el.onDestroy()
    el.onDestroy() // second call is a no-op
  })
})

// ─── ViewHome ────────────────────────────────────────────────────────────────

describe('ViewHome branches', () => {
  test('featured detection reads item flags and the featuredLinks set', () => {
    const el = new ViewHome()

    expect(el.isFeatured(null)).toBe(false)
    expect(el.isFeatured({ featured: true })).toBe(true)
    expect(el.isFeatured({ featured: STATE_STRINGS.TRUE })).toBe(true)
    expect(el.isFeatured({ featured: 1 })).toBe(true)
    expect(el.isFeatured({})).toBeFalsy()

    el.featuredLinks.add('/portfolio/x')
    expect(el.isFeatured({ link: '/portfolio/x' })).toBe(true)
  })

  test('processedItems normalizes array and object portfoliolists', () => {
    const el = new ViewHome()

    expect(el.processedItems).toEqual([])

    el.translations = { portfoliolist: { a: { link: '/a' }, b: { link: '/b', featured: true } } }

    expect(el.processedItems).toHaveLength(2)
    expect(el.processedItems[1].featured).toBe(true)

    el.translations = { portfoliolist: [{ link: '/c' }] }
    expect(el.processedItems).toHaveLength(1)
  })

  test('onRouteParamChange scrolls to the anchor element or top', async () => {
    mockStableFetch()

    const el = new ViewHome()
    cleanups.push(mount(el))

    el.onRouteParamChange({ meta: { scrollTo: SECTION_IDS.ABOUT } })

    await flush(150)

    expect(window.scrollTo).toHaveBeenCalled()

    window.scrollTo.mockClear()
    el.onRouteParamChange({ meta: { scrollTo: 'missing-anchor' } })

    await flush(150)

    el.onRouteParamChange({ meta: {} })

    expect(window.scrollTo).toHaveBeenCalled()
  })

  test('loadData resolves boot data and pushes to children + store', async () => {
    mockStableFetch()

    const el = new ViewHome()
    cleanups.push(mount(el))

    await flush(60)

    // Home node resolved from the boot snapshot → translations populated.
    expect(el.translations).not.toBeNull()

    // Child elements exist in the render → _passDataToChildren ran.
    const mosaic = el.shadowRoot.querySelector(COMPONENT_TAGS.HOME_MOSAIC)

    expect(mosaic).not.toBeNull()
  })

  test('onStoreUpdate reloads when the locale changes', async () => {
    mockStableFetch()

    const el = new ViewHome()
    cleanups.push(mount(el))

    await flush(30)

    const spy = jest.spyOn(el, 'loadData')

    el._lastLocale = LOCALES.EN
    store.commit(LANG_MUTATIONS.SET_LANG, LOCALES.FR)

    await flush(10)

    expect(spy).toHaveBeenCalled()

    store.commit(LANG_MUTATIONS.SET_LANG, LOCALES.EN)
  })
})

// ─── ViewNotFound ────────────────────────────────────────────────────────────

describe('ViewNotFound branches', () => {
  test('getters derive emoji/subtitle/home path from translations + locale', () => {
    const el = new ViewNotFound()

    // Seeded from the build-time English snapshot — meaningful copy
    // renders before (and without) the Firebase fetch resolving.
    const seeded = FALLBACK_PAGES[TRANSLATION_KEYS.NOT_FOUND]

    expect(el.emojiLine).toBe(seeded.title.split(DOM_STRINGS.BR_TAG)[0])
    expect(el.subtitle).toBe(seeded.title.split(DOM_STRINGS.BR_TAG)[1])
    expect(el.homePath).toBe('/')

    el.translations = { title: '🔍<br>Signal lost', link: 'Go home' }

    expect(el.emojiLine).toBe('🔍')
    expect(el.subtitle).toBe('Signal lost')

    store.commit(LANG_MUTATIONS.SET_LANG, LOCALES.DE)

    expect(el.homePath).toBe(`/${LOCALES.DE}`)

    store.commit(LANG_MUTATIONS.SET_LANG, LOCALES.EN)
  })

  test('the home link routes through router.push', () => {
    const el = new ViewNotFound()

    el.translations = { title: 'X<br>Y', link: 'Back' }

    cleanups.push(mount(el))

    const push = jest.spyOn(router, 'push').mockImplementation(() => {})
    const link = el.shadowRoot.querySelector(`.${NOT_FOUND_CLASSES.NOT_FOUND_LINK}`)

    expect(link).not.toBeNull()

    link.dispatchEvent(new window.MouseEvent(MOUSE_EVENTS.CLICK, { bubbles: true }))

    expect(push).toHaveBeenCalledWith(el.homePath)

    push.mockRestore()
  })
})

// ─── router ──────────────────────────────────────────────────────────────────

describe('router branches', () => {
  test('match() aliases parsePath and notifies subscribers on nav', async () => {
    window.scrollTo = jest.fn()

    const hits = []
    const unsub = router.subscribe((to) => hits.push(to))

    await router.handleNavigation('/')

    expect(hits.length).toBeGreaterThan(0)
    expect(router.match('/').name).toBeTruthy()
    expect(router.match('/unknown-path-xyz').name).toBe(ROUTE_NAMES.NOT_FOUND)

    unsub()
  })

  test('before-hooks can redirect the navigation', async () => {
    window.scrollTo = jest.fn()

    router.beforeHooks.push((to) => (to?.path === '/unknown-path-abc' ? '/' : undefined))

    await router.push('/unknown-path-abc')

    expect(router.currentRoute.path).toBe('/')

    router.beforeHooks.length = 0
  })

  test('after-hooks run and {path} redirect objects resolve', async () => {
    window.scrollTo = jest.fn()

    const after = []

    router.afterHooks.push((to) => after.push(to.path))
    await router.push('/')

    expect(after).toContain('/')

    router.beforeHooks.push((to) => (to?.path === '/elsewhere' ? { path: '/' } : undefined))
    await router.push('/elsewhere')

    expect(router.currentRoute.path).toBe('/')

    router.beforeHooks.length = 0
    router.afterHooks.length = 0
  })

  test('replace mode swaps history state instead of pushing', async () => {
    window.scrollTo = jest.fn()

    const replace = jest.spyOn(window.history, 'replaceState')

    await router.handleNavigation('/', true)

    expect(replace).toHaveBeenCalled()

    replace.mockRestore()
  })

  test('popstate re-runs navigation on the current location', async () => {
    window.scrollTo = jest.fn()

    const spy = jest.spyOn(router, 'handleNavigation')

    window.dispatchEvent(new window.Event(WINDOW_EVENTS.POPSTATE))

    expect(spy).toHaveBeenCalled()

    spy.mockRestore()
  })
})
