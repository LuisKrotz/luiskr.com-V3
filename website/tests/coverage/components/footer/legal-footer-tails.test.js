/**
 * @file legal-footer-tails.test.js
 * @description Split from coverage-tails-3.test.js — covers the "legal Footer tails" describe.
 */
import { jest } from '@jest/globals'
import { CMS_KEYS, ROUTE_NAMES } from '@core/constants.js'
import store from '@core/store.js'
import router from '@core/router/router.js'
import { TEST_TEXT } from '@tests/fixtures/test-constants.js'

import '@website/components/feedback/StatsHud.js'
import '@website/components/home/AwardsMentions.js'
import '@website/components/legal/Footer.js'
import { getFallbackLegalLinks } from '@website/components/legal/Footer.js'
import { FALLBACK_COMPONENTS } from '@core/locale/fallback.js'
import { LANG_SLUGS } from '@core/i18n.js'
import '@website/components/home/HomeMosaic.js'
import '@website/components/dialogs/LangDialog.js'
import '@website/components/dialogs/PreferencesModal.js'
import '@website/components/carousel/AwardsCarousel.js'
import '@website/views/home/Home.js'
import '@website/views/legal/Legal.js'
import { COMPONENT_TAGS } from '@core/tokens/elements/components.js'
import { ROUTE_STRINGS } from '@core/tokens/strings/routes.js'
import { LANG_MUTATIONS } from '@core/tokens/events/mutations.js'
import { CHAR_STRINGS } from '@core/tokens/strings/chars.js'
import { ROUTE_PATHS } from '@core/tokens/routes/paths.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { MOUSE_EVENTS } from '@core/tokens/events/dom.js'
import { ROUTER_CLASSES } from '@core/tokens/classes/router.js'

const flush = (ms = 80) => new Promise((r) => setTimeout(r, ms))

describe('legal Footer tails', () => {
  test('mounts with defaults and rebuilds on locale change', async () => {
    const el = document.createElement(COMPONENT_TAGS.LEGAL_FOOTER)

    document.body.appendChild(el)
    await flush()

    el._updateDom?.()
    el.onStoreUpdate?.()

    await flush()
    el.remove()
  })

  test('getFallbackLegalLinks covers empty-slug and missing-label fallbacks', () => {
    LANG_SLUGS.zz = {}

    const links = getFallbackLegalLinks('zz')

    expect(links).toHaveLength(4)
    expect(links[1].link).toContain(ROUTE_STRINGS.PRIVACY_POLICY)
    expect(links[2].link).toContain(ROUTE_STRINGS.GDPR)
    expect(links[3].link).toContain(ROUTE_STRINGS.TERMS_OF_USE)

    delete LANG_SLUGS.zz
  })

  test('getFallbackLegalLinks tolerates an absent labels dictionary', () => {
    // componentText() falls through to FALLBACK_COMPONENTS — removing the
    // legal-footer node makes the labels lookup itself come back empty.
    const prevComponents = store.getters.getlang()?.components
    const prevNode = FALLBACK_COMPONENTS[CMS_KEYS.LEGAL_FOOTER]

    store.commit(LANG_MUTATIONS.SET_COMPONENT_LANG, null)
    delete FALLBACK_COMPONENTS[CMS_KEYS.LEGAL_FOOTER]

    // unknown-locale arm: falls back to the EN slug map, empty page labels
    const links = getFallbackLegalLinks('qq')

    expect(links).toHaveLength(4)
    expect(links[0].page).toBe(CHAR_STRINGS.EMPTY)

    FALLBACK_COMPONENTS[CMS_KEYS.LEGAL_FOOTER] = prevNode
    store.commit(LANG_MUTATIONS.SET_COMPONENT_LANG, prevComponents)
  })

  test('getFallbackLegalLinks uses committed component labels', () => {
    // sync body — no awaits — so no pending _ensureData().then can
    // overwrite the committed components between commit and lookup.
    const prev = store.getters.getlang()?.components

    store.commit(LANG_MUTATIONS.SET_COMPONENT_LANG, {
      [CMS_KEYS.LEGAL_FOOTER]: {
        links: [{ page: TEST_TEXT.HELLO, link: ROUTE_PATHS.ROOT }, { link: ROUTE_PATHS.ROOT }],
      },
    })

    const links = getFallbackLegalLinks()

    expect(links[0].page).toBe(TEST_TEXT.HELLO)
    expect(links[1].page).toBe(CHAR_STRINGS.EMPTY)

    store.commit(LANG_MUTATIONS.SET_COMPONENT_LANG, prev)
  })

  test('linkless item renders by index key and its click is a no-op', async () => {
    const prev = store.getters.getlang()?.components
    const pushSpy = jest.spyOn(router, 'push').mockImplementation(() => {})
    const payload = { [CMS_KEYS.LEGAL_FOOTER]: { links: [{ page: TEST_TEXT.HELLO }] } }

    store.commit(LANG_MUTATIONS.SET_COMPONENT_LANG, payload)

    const el = document.createElement(COMPONENT_TAGS.LEGAL_FOOTER)

    document.body.appendChild(el)
    await flush()

    // re-commit + re-render so a resolved _ensureData can't swap the links back
    store.commit(LANG_MUTATIONS.SET_COMPONENT_LANG, payload)
    el._updateDom()

    const anchor = el.shadowRoot.querySelector(HTML_TAGS.A)

    expect(anchor).not.toBeNull()

    anchor.dispatchEvent(new Event(MOUSE_EVENTS.CLICK, { bubbles: true }))

    expect(pushSpy).not.toHaveBeenCalled()

    pushSpy.mockRestore()
    store.commit(LANG_MUTATIONS.SET_COMPONENT_LANG, prev)
    el.remove()
  })

  test('shadow click on non-anchor and href-less anchor are ignored', async () => {
    const el = document.createElement(COMPONENT_TAGS.LEGAL_FOOTER)

    document.body.appendChild(el)
    await flush()

    const pushSpy = jest.spyOn(router, 'push').mockImplementation(() => {})

    // click inside the shadow on a non-anchor — closest() finds no <a>
    el.shadowRoot
      .querySelector(HTML_TAGS.DIV)
      ?.dispatchEvent(new Event(MOUSE_EVENTS.CLICK, { bubbles: true }))

    // a raw shadow anchor without an href — the href guard skips the push
    const bare = document.createElement(HTML_TAGS.A)

    el.shadowRoot.appendChild(bare)
    bare.dispatchEvent(new Event(MOUSE_EVENTS.CLICK, { bubbles: true }))

    expect(pushSpy).not.toHaveBeenCalled()

    pushSpy.mockRestore()
    el.remove()
  })

  test('onDestroy tolerates a missing router subscription', () => {
    const el = document.createElement(COMPONENT_TAGS.LEGAL_FOOTER)

    el.onDestroy()

    expect(el._unsubRouter).toBeNull()
  })

  test('active route class lands on the matching link', async () => {
    const prevRoute = router.currentRoute
    const prevComponents = store.getters.getlang()?.components
    const payload = {
      [CMS_KEYS.LEGAL_FOOTER]: {
        links: [
          { page: TEST_TEXT.HELLO, link: `${ROUTE_PATHS.ROOT}${ROUTE_STRINGS.PRIVACY_POLICY}` },
        ],
      },
    }

    router.currentRoute = { path: `${ROUTE_PATHS.ROOT}${ROUTE_STRINGS.PRIVACY_POLICY}` }
    store.commit(LANG_MUTATIONS.SET_COMPONENT_LANG, payload)

    const el = document.createElement(COMPONENT_TAGS.LEGAL_FOOTER)

    document.body.appendChild(el)
    await flush()

    // re-commit + re-render so a resolved _ensureData can't swap the links back
    store.commit(LANG_MUTATIONS.SET_COMPONENT_LANG, payload)
    el._updateDom()

    const active = el.shadowRoot.querySelector(`.${ROUTER_CLASSES.ROUTER_LINK_EXACT_ACTIVE}`)

    expect(active).not.toBeNull()

    // delegated click on a real link goes through the href guard
    const pushSpy = jest.spyOn(router, 'push').mockImplementation(() => {})

    active.dispatchEvent(new Event(MOUSE_EVENTS.CLICK, { bubbles: true }))

    expect(pushSpy).toHaveBeenCalled()

    pushSpy.mockRestore()
    store.commit(LANG_MUTATIONS.SET_COMPONENT_LANG, prevComponents)
    router.currentRoute = prevRoute
    el.remove()
  })

  test('_ensureData falls back when locale and database are falsy', async () => {
    const lang = store.getters.getlang()
    const prevDb = lang.database
    const prevLocale = lang.locale

    lang.database = null
    lang.locale = CHAR_STRINGS.EMPTY

    const el = document.createElement(COMPONENT_TAGS.LEGAL_FOOTER)

    document.body.appendChild(el)
    await flush(150)

    el.remove()

    lang.database = prevDb
    lang.locale = prevLocale
  })

  test('_ensureData skips a nonexistent snapshot node', async () => {
    const lang = store.getters.getlang()
    const prevDb = lang.database
    const prevLocale = lang.locale
    const origFetch = globalThis.fetch

    // null JSON body → _snapshot(null) → exists() === false → else arm
    globalThis.fetch = async () => ({ ok: true, json: async () => null })

    lang.database = 'nodb/'
    lang.locale = 'yy'

    const el = document.createElement(COMPONENT_TAGS.LEGAL_FOOTER)

    document.body.appendChild(el)
    await flush(150)

    el.remove()

    globalThis.fetch = origFetch
    lang.database = prevDb
    lang.locale = prevLocale
  })

  test('router subscribe callback triggers a DOM refresh', async () => {
    const el = document.createElement(COMPONENT_TAGS.LEGAL_FOOTER)

    document.body.appendChild(el)
    await flush()

    el._updateDom = jest.fn()

    router.notify(
      { path: `${ROUTE_PATHS.ROOT}x`, name: 'x' },
      { path: ROUTE_PATHS.ROOT, name: ROUTE_NAMES.HOME }
    )

    expect(el._updateDom).toHaveBeenCalled()

    el.remove()
  })

  test('module re-eval sees the tag already registered', async () => {
    jest.resetModules()

    await import('@website/components/legal/Footer.js')
  })
})
