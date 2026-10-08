/**
 * @file routes-deep-coverage-viewlegal-branches.test.js
 * @description Split from routes-deep-coverage.test.js — covers the "ViewLegal branches" describe.
 */
import { describe, test, expect, jest, beforeEach, afterEach } from '@jest/globals'
import { ViewLegal } from '@website/views/legal/Legal.js'
import router from '@core/router/router.js'
import store from '@core/store.js'
import { mount } from '@tests/fixtures/test-constants.js'
import { LANG_MUTATIONS } from '@core/tokens/events/mutations.js'

import { LOCALES } from '@core/constants.js'
import { TRANSLATION_KEYS } from '@core/tokens/routes/translation-keys.js'

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
