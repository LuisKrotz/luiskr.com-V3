/**
 * @file home-tails-2.test.js
 * @description Split from coverage-tails-5.test.js — covers the "Home tails 2" describe.
 */
import { jest } from '@jest/globals'
import store from '@core/store.js'
import router from '@core/router/router.js'

import '@core/utils/dom.js'

import '@website/views/legal/Legal.js'
import '@website/views/home/Home.js'
import { VIEW_TAGS } from '@core/tokens/elements/views.js'
import { LANG_MUTATIONS, UI_MUTATIONS } from '@core/tokens/events/mutations.js'
import { COMMON_ATTRS } from '@core/tokens/attrs/common.js'
import { INPUT_STRINGS } from '@core/tokens/strings/input.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { CHAR_STRINGS } from '@core/tokens/strings/chars.js'
import { ROUTE_PATHS } from '@core/tokens/routes/paths.js'

const flush = (ms = 80) => new Promise((r) => setTimeout(r, ms))

describe('Home tails 2', () => {
  test('route-param scrollTo resolves via deepQuerySelector', async () => {
    const el = document.createElement(VIEW_TAGS.VIEW_HOME)

    document.body.appendChild(el)
    await flush(200)

    el.onRouteParamChange?.({ meta: { scrollTo: 'nonexistent-anchor-xyz' } })

    await flush(200)
    el.remove()
  })

  test('storage getter delegates to the store and touch renders has_touch', async () => {
    const el = document.createElement(VIEW_TAGS.VIEW_HOME)

    document.body.appendChild(el)
    await flush(60)

    expect(el.storage).toBe(store.getters.getStorage())

    const prevMethod = store.getters.getInputMethod?.()

    store.commit(UI_MUTATIONS.SET_INPUT_METHOD, COMMON_ATTRS.TOUCH)
    el._updateDom()

    store.commit(UI_MUTATIONS.SET_INPUT_METHOD, prevMethod || INPUT_STRINGS.MOUSE)
    el.remove()
  })

  test('scrollTo arm hits a body-level marker when shadow lookup misses', async () => {
    const marker = document.createElement(HTML_TAGS.DIV)

    marker.id = 'body-level-marker-x'
    document.body.appendChild(marker)

    const el = document.createElement(VIEW_TAGS.VIEW_HOME)

    document.body.appendChild(el)
    await flush(60)

    el.onRouteParamChange?.({ meta: { scrollTo: 'body-level-marker-x' } })

    await flush(80)
    marker.remove()
    el.remove()
  })

  test('loadData tolerates every snapshot missing under an unknown locale', async () => {
    const el = document.createElement(VIEW_TAGS.VIEW_HOME)

    document.body.appendChild(el)
    await flush(60)

    const prevLocale = store.getters.getlang().locale

    store.commit(LANG_MUTATIONS.SET_LANG, 'zz-missing')
    el.loadData()
    await flush(60)

    store.commit(LANG_MUTATIONS.SET_LANG, prevLocale)
    el.remove()
  })

  test('onMounted covers missing snapshots, absent scroll target and empty locale', async () => {
    const prevFetch = globalThis.fetch
    const prevRoute = router.currentRoute
    const prevDb = store.getters.getlang().database
    const prevLocale = store.getters.getlang().locale

    // empty locale + unique database prefix -> uncached dbpaths; json:null
    // -> exists() false on every home/projects/about/pic snapshot
    store.state.lang.locale = CHAR_STRINGS.EMPTY
    store.state.lang.database = 'zz-coverage-db/'
    router.currentRoute = { path: ROUTE_PATHS.ROOT, meta: { scrollTo: 'missing-anchor-xyz' } }
    globalThis.fetch = async () => ({ ok: true, status: 200, json: async () => null })

    try {
      const el = document.createElement(VIEW_TAGS.VIEW_HOME)

      document.body.appendChild(el)
      await flush(220)

      expect(el.translations).toBeFalsy()
      el.remove()
    } finally {
      globalThis.fetch = prevFetch
      router.currentRoute = prevRoute
      store.state.lang.database = prevDb
      store.state.lang.locale = prevLocale
    }
  })

  test('_passDataToChildren tolerates absent section elements', async () => {
    const el = document.createElement(VIEW_TAGS.VIEW_HOME)

    document.body.appendChild(el)
    await flush(60)

    const qs = jest.spyOn(el.shadowRoot, 'querySelector').mockReturnValue(null)

    el._passDataToChildren?.()
    qs.mockRestore()

    el.remove()
  })
})
