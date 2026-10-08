/**
 * @file routes-deep-coverage-viewhome-branches.test.js
 * @description Split from routes-deep-coverage.test.js — covers the "ViewHome branches" describe.
 */
import { describe, test, expect, jest, beforeEach, afterEach } from '@jest/globals'
import { ViewHome } from '@website/views/home/Home.js'
import store from '@core/store.js'
import { mount } from '@tests/fixtures/test-constants.js'
import { LANG_MUTATIONS } from '@core/tokens/events/mutations.js'
import { STATE_STRINGS } from '@core/tokens/strings/state.js'
import { SECTION_IDS } from '@core/tokens/ids/sections.js'
import { COMPONENT_TAGS } from '@core/tokens/elements/components.js'

import { LOCALES } from '@core/constants.js'

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
