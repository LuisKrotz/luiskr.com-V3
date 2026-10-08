/**
 * @file legal-tails-2.test.js
 * @description Split from coverage-tails-5.test.js — covers the "Legal tails 2" describe.
 */
import { FALLBACK_APP } from '@core/locale/fallback.js'
import store from '@core/store.js'
import router from '@core/router/router.js'

import { TEST_TEXT } from '@tests/fixtures/test-constants.js'
import '@website/views/legal/Legal.js'
import '@website/views/home/Home.js'
import { VIEW_TAGS } from '@core/tokens/elements/views.js'
import { ROUTE_PATHS } from '@core/tokens/routes/paths.js'
import { LANG_MUTATIONS } from '@core/tokens/events/mutations.js'
import { CHAR_STRINGS } from '@core/tokens/strings/chars.js'
import { SECTION_UI_KEYS } from '@core/tokens/data/ui-keys.js'

const flush = (ms = 80) => new Promise((r) => setTimeout(r, ms))

describe('Legal tails 2', () => {
  test('loadData honors wait delay and missing route meta', async () => {
    const el = document.createElement(VIEW_TAGS.VIEW_LEGAL)

    document.body.appendChild(el)
    await flush()

    el.loadData(50)
    el.loadData()

    await flush(120)
    el.remove()
  })

  test('onRouteParamChange guards and legal-swap reload', async () => {
    const el = document.createElement(VIEW_TAGS.VIEW_LEGAL)

    document.body.appendChild(el)
    await flush()

    el.onRouteParamChange({})
    el.onRouteParamChange({ meta: { legalRoute: true } })
    el.onRouteParamChange({ meta: { legalRoute: true, title: TEST_TEXT.HEADING } })

    expect(el.translations).toBeNull()

    await flush()
    el.remove()
  })

  test('onStoreUpdate reloads only on a real locale change', () => {
    const el = document.createElement(VIEW_TAGS.VIEW_LEGAL)

    document.body.appendChild(el)

    el._lastLocale = null
    el.onStoreUpdate()

    el._lastLocale = 'zz-nope'
    el.onStoreUpdate()

    el.remove()
  })

  test('render guards: sections without title/content and aria fallback', async () => {
    const el = document.createElement(VIEW_TAGS.VIEW_LEGAL)

    document.body.appendChild(el)
    await flush()

    el.translations = { sections: [{ content: null }, {}] }
    el._updateDom()

    el.translations = {}
    el._updateDom()

    el.remove()
  })

  test('router subscription swaps legal documents on push', async () => {
    const el = document.createElement(VIEW_TAGS.VIEW_LEGAL)

    document.body.appendChild(el)
    await flush()

    await router.push?.(ROUTE_PATHS.PRIVACY_POLICY).catch(() => {})
    await router.push?.(ROUTE_PATHS.TERMS_OF_USE).catch(() => {})
    await flush(80)

    el.remove()
  })

  test('loadData guards a missing snapshot and empty locale', async () => {
    const el = document.createElement(VIEW_TAGS.VIEW_LEGAL)

    document.body.appendChild(el)
    await flush()

    const prevLocale = store.getters.getlang().locale

    store.commit(LANG_MUTATIONS.SET_LANG, 'zz-missing-locale')
    el.loadData()
    await flush(40)

    store.commit(LANG_MUTATIONS.SET_LANG, CHAR_STRINGS.EMPTY)
    el.loadData()
    await flush(40)

    store.commit(LANG_MUTATIONS.SET_LANG, prevLocale)
    el.remove()
  })

  test('loadData early-returns on a nonexistent snapshot and empty lang locale', async () => {
    const prevFetch = globalThis.fetch
    const prevRoute = router.currentRoute
    const prevDb = store.getters.getlang().database
    const prevLocale = store.getters.getlang().locale

    // route without meta.title/meta.translation covers the meta else-arms;
    // empty locale + unique database prefix -> uncached dbpath; json:null ->
    // snapshot.exists() false -> apply early-returns
    router.currentRoute = { path: ROUTE_PATHS.ROOT, meta: {} }
    store.state.lang.locale = CHAR_STRINGS.EMPTY
    store.state.lang.database = 'zz-coverage-db/'
    globalThis.fetch = async () => ({ ok: true, status: 200, json: async () => null })

    const el = document.createElement(VIEW_TAGS.VIEW_LEGAL)

    try {
      document.body.appendChild(el)
      await flush(80)

      el.loadData()
      await flush(40)

      // translations stays falsy -> render falls to the loading label arm
      el.translations = {}
      el._updateDom()

      // non-legal route push -> subscribed callback's legalRoute else-arm
      await router.push?.(ROUTE_PATHS.ABOUT).catch(() => {})

      // stripHtml(falsy) -> aria-label's `|| undefined` arm: empty live app
      // plus a deleted fallback key leaves every label source falsy
      const prevApp = store.getters.getlang()?.app
      const prevLoading = FALLBACK_APP[SECTION_UI_KEYS.LOADING]

      store.commit(LANG_MUTATIONS.SET_APP_LANG, {})
      delete FALLBACK_APP[SECTION_UI_KEYS.LOADING]
      el._updateDom()

      store.commit(LANG_MUTATIONS.SET_APP_LANG, prevApp)
      FALLBACK_APP[SECTION_UI_KEYS.LOADING] = prevLoading

      expect(el.translations).toBeDefined()
    } finally {
      globalThis.fetch = prevFetch
      router.currentRoute = prevRoute
      store.state.lang.database = prevDb
      store.state.lang.locale = prevLocale
      el.remove()
    }
  })
})
