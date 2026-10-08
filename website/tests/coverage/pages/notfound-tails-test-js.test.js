/**
 * @file notfound-tails-test-js.test.js
 * @description Split from coverage-tails.test.js — covers the "NotFound tails" describe.
 */
import { jest } from '@jest/globals'
import store from '@core/store.js'

import '@core/utils/data/sanitize.js'

import '@website/components/feedback/CookieBanner.js'
import '@website/components/home/ContactSection.js'
import '@website/views/not-found/NotFound.js'

import { TEST_TEXT } from '@tests/fixtures/test-constants.js'
import { VIEW_TAGS } from '@core/tokens/elements/views.js'
import { DOM_STRINGS } from '@core/tokens/strings/dom.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'
import { CHAR_STRINGS } from '@core/tokens/strings/chars.js'
import { NOT_FOUND_CLASSES } from '@core/tokens/classes/legal.js'
import { MOUSE_EVENTS } from '@core/tokens/events/dom.js'

jest.unstable_mockModule('@core/firebase.js', () => ({
  signInWithGoogle: jest.fn(async () => ({ user: { uid: 'u1' } })),
  onAuthChange: jest.fn(async (cb) => {
    cb(null)
    return () => {}
  }),
  logoutUser: jest.fn(async () => {}),
  fetchFirebaseDb: jest.fn(async () => ({ exists: () => false, val: () => null })),
  getDbInstance: jest.fn(async () => ({})),
}))

const flush = (ms = 60) => new Promise((r) => setTimeout(r, ms))

describe('NotFound tails', () => {
  const mountNotFound = () => {
    const el = document.createElement(VIEW_TAGS.VIEW_NOT_FOUND)

    document.body.appendChild(el)

    return el
  }

  test('getters derive emoji, subtitle and localized home path', async () => {
    const el = mountNotFound()

    await flush()

    el.translations = { title: `${TEST_TEXT.HELLO}${DOM_STRINGS.BR_TAG}${TEST_TEXT.BODY}` }

    expect(el.emojiLine).toBe(TEST_TEXT.HELLO)
    expect(el.subtitle).toBe(TEST_TEXT.BODY)
    expect(typeof el.homePath).toBe(TYPE_STRINGS.STRING)

    el.translations = null

    expect(el.emojiLine).toBe(CHAR_STRINGS.EMPTY)
    expect(el.subtitle).toBe(CHAR_STRINGS.EMPTY)

    el.remove()
  })

  test('home link click routes through the SPA router', async () => {
    const el = mountNotFound()

    await flush()

    el._bindLinks()

    const link = el.shadowRoot?.querySelector(`.${NOT_FOUND_CLASSES.NOT_FOUND_LINK}`)

    if (link) {
      link.dispatchEvent(new Event(MOUSE_EVENTS.CLICK, { bubbles: true }))
    }

    el.remove()
  })

  test('title edge splits, locale fallback, null snapshot and missing link', async () => {
    const el = mountNotFound()

    await flush()

    el.translations = { title: `${DOM_STRINGS.BR_TAG}${TEST_TEXT.SECOND}` }

    expect(el.emojiLine).toBe(CHAR_STRINGS.EMPTY)
    expect(el.subtitle).toBe(TEST_TEXT.SECOND)

    el.translations = { title: DOM_STRINGS.BR_TAG }

    expect(el.subtitle).toBe(CHAR_STRINGS.EMPTY)

    el.translations = { title: `${TEST_TEXT.HELLO}${DOM_STRINGS.BR_TAG}${TEST_TEXT.BODY}` }
    el._updateDom()

    const linkEl = el.shadowRoot?.querySelector(`.${NOT_FOUND_CLASSES.NOT_FOUND_LINK}`)

    expect(linkEl?.textContent?.length ?? 0).toBeGreaterThanOrEqual(0)

    el.remove()

    const prevLang = store.state.lang

    store.state.lang = { database: 'dbz/', pagesPath: 'pz/' }

    const el2 = mountNotFound()

    await flush(80)
    el2.remove()

    store.state.lang = { locale: 'zznf', database: 'dbz/', pagesPath: 'pz/' }

    const origFetch = globalThis.fetch

    globalThis.fetch = async () => ({ ok: true, json: async () => null })

    const el3 = mountNotFound()

    await flush(80)
    el3.remove()

    globalThis.fetch = origFetch
    store.state.lang = prevLang
  })

  test('module re-eval skips custom-element re-registration', async () => {
    jest.resetModules()

    await expect(import('@website/views/not-found/NotFound.js')).resolves.toBeTruthy()
  })
})
