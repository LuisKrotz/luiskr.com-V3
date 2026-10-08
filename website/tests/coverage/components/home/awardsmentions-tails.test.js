/**
 * @file awardsmentions-tails.test.js
 * @description Split from coverage-tails-3.test.js — covers the "AwardsMentions tails" describe.
 */
import { jest } from '@jest/globals'
import { TRANSLATION_KEYS } from '@core/constants.js'
import store from '@core/store.js'
import _router from '@core/router/router.js'
import { TEST_TEXT } from '@tests/fixtures/test-constants.js'

import '@website/components/feedback/StatsHud.js'
import '@website/components/home/AwardsMentions.js'
import '@website/components/legal/Footer.js'

import { FALLBACK_PAGES } from '@core/locale/fallback.js'

import '@website/components/home/HomeMosaic.js'
import '@website/components/dialogs/LangDialog.js'
import '@website/components/dialogs/PreferencesModal.js'
import '@website/components/carousel/AwardsCarousel.js'
import '@website/views/home/Home.js'
import '@website/views/legal/Legal.js'
import { COMPONENT_TAGS } from '@core/tokens/elements/components.js'
import { CHAR_STRINGS } from '@core/tokens/strings/chars.js'
import { LANG_MUTATIONS } from '@core/tokens/events/mutations.js'
import { MOUSE_EVENTS } from '@core/tokens/events/dom.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'

const flush = (ms = 80) => new Promise((r) => setTimeout(r, ms))

describe('AwardsMentions tails', () => {
  test('title/items setters drive fallback render paths', async () => {
    const el = document.createElement(COMPONENT_TAGS.AWARDS_MENTIONS)

    document.body.appendChild(el)
    await flush()

    el.title = TEST_TEXT.SECOND
    el.items = [{ name: TEST_TEXT.HEADING, link: '' }]
    el.items = []
    el.title = null

    await flush()
    el.remove()
  })

  test('title falls back to empty when the bundled mentions node is absent', () => {
    const aboutNode = FALLBACK_PAGES[TRANSLATION_KEYS.ABOUT]
    const prev = aboutNode.mentions

    aboutNode.mentions = CHAR_STRINGS.EMPTY

    const el = document.createElement(COMPONENT_TAGS.AWARDS_MENTIONS)

    expect(el.title).toBe(CHAR_STRINGS.EMPTY)

    el.title = null
    expect(el.title).toBe(CHAR_STRINGS.EMPTY)

    aboutNode.mentions = prev
  })

  test('title setter on an unmounted element skips the DOM update', () => {
    const el = document.createElement(COMPONENT_TAGS.AWARDS_MENTIONS)

    el.title = TEST_TEXT.HEADING

    expect(el.title).toBe(TEST_TEXT.HEADING)
  })

  test('_ensureData tolerates a null lang object and missing snapshots', async () => {
    const el = document.createElement(COMPONENT_TAGS.AWARDS_MENTIONS)

    document.body.appendChild(el)
    await flush()

    const prevLang = store.state.lang

    try {
      store.state.lang = null
      el._ensureData()
    } finally {
      store.state.lang = prevLang
    }

    const prevComponents = store.getters.getlang()?.components

    store.commit(LANG_MUTATIONS.SET_COMPONENT_LANG, null)

    expect(el.legalLinks.length).toBeGreaterThan(0)

    store.commit(LANG_MUTATIONS.SET_LANG, 'zz-missing')
    el._ensureData()
    await flush(40)

    store.commit(LANG_MUTATIONS.SET_LANG, prevLang.locale)
    store.commit(LANG_MUTATIONS.SET_COMPONENT_LANG, prevComponents)
    el.remove()
  })

  test('progress helpers tolerate absent bar/fill nodes', async () => {
    const el = document.createElement(COMPONENT_TAGS.AWARDS_MENTIONS)

    document.body.appendChild(el)
    await flush()

    const qs = jest.spyOn(el.shadowRoot, 'querySelector').mockReturnValue(null)

    el._showProgress()
    el._hideProgress()
    el._restartProgressAnimation()
    qs.mockRestore()

    el.remove()
  })

  test('delegated click handler covers non-element and non-item targets', async () => {
    const el = document.createElement(COMPONENT_TAGS.AWARDS_MENTIONS)

    document.body.appendChild(el)
    await flush()

    el.shadowRoot.dispatchEvent(
      new window.Event(MOUSE_EVENTS.CLICK, { bubbles: true, composed: true })
    )

    const inner = document.createElement(HTML_TAGS.SPAN)

    el.shadowRoot.appendChild(inner)
    inner.dispatchEvent(new window.Event(MOUSE_EVENTS.CLICK, { bubbles: true, composed: true }))

    inner.remove()
    el.remove()
  })
})
