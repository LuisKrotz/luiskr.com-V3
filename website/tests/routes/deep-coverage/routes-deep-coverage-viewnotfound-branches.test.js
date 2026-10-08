/**
 * @file routes-deep-coverage-viewnotfound-branches.test.js
 * @description Split from routes-deep-coverage.test.js — covers the "ViewNotFound branches" describe.
 */
import { describe, test, expect, jest, beforeEach, afterEach } from '@jest/globals'
import { ViewNotFound } from '@website/views/not-found/NotFound.js'
import router from '@core/router/router.js'
import store from '@core/store.js'
import { mount } from '@tests/fixtures/test-constants.js'
import { LANG_MUTATIONS } from '@core/tokens/events/mutations.js'
import { NOT_FOUND_CLASSES } from '@core/tokens/classes/legal.js'
import { MOUSE_EVENTS } from '@core/tokens/events/dom.js'

import { LOCALES } from '@core/constants.js'
import { TRANSLATION_KEYS } from '@core/tokens/routes/translation-keys.js'
import { FALLBACK_PAGES } from '@core/locale/fallback.js'
import { DOM_STRINGS } from '@core/tokens/strings/dom.js'

const _flush = (ms = 0) => new Promise((r) => setTimeout(r, ms))

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
const _mockStableFetch = () => {
  globalThis.fetch = jest.fn(async () => ({ ok: true, json: async () => null }))
}

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
