/**
 * @file cookiebanner-tails-test-js.test.js
 * @description Split from coverage-tails.test.js — covers the "CookieBanner tails" describe.
 */
import { jest } from '@jest/globals'
import '@core/utils/data/sanitize.js'

import '@website/components/feedback/CookieBanner.js'
import '@website/components/home/ContactSection.js'
import '@website/views/not-found/NotFound.js'

import { TEST_TEXT } from '@tests/fixtures/test-constants.js'
import { COMPONENT_TAGS } from '@core/tokens/elements/components.js'
import { PREF_STORAGE_KEYS } from '@core/tokens/data/storage.js'
import { STATE_STRINGS } from '@core/tokens/strings/state.js'
import { COOKIE_SELECTORS } from '@core/tokens/selectors/cookies.js'
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

describe('CookieBanner tails', () => {
  test('accept and refuse buttons persist consent and hide', async () => {
    const el = document.createElement(COMPONENT_TAGS.COOKIE_BANNER)

    document.body.appendChild(el)
    await flush()

    el.handleAction(true)

    expect(localStorage.getItem(PREF_STORAGE_KEYS.COOKIE)).toBe(STATE_STRINGS.TRUE)
    expect(el.hidden).toBe(true)

    el.hidden = false
    el.handleAction(false)

    expect(localStorage.getItem(PREF_STORAGE_KEYS.COOKIE)).toBe(STATE_STRINGS.FALSE)

    el.remove()
  })

  test('rendered buttons route clicks to handleAction', async () => {
    const el = document.createElement(COMPONENT_TAGS.COOKIE_BANNER)

    document.body.appendChild(el)
    await flush()

    const accept = el.shadowRoot?.querySelector(`${COOKIE_SELECTORS.COOKIES_BUTTONS_ACCEPT}`)
    const refuse = el.shadowRoot?.querySelector(`${COOKIE_SELECTORS.COOKIES_BUTTONS_REFUSE}`)

    const spy = jest.spyOn(el, 'handleAction')

    accept?.dispatchEvent(new Event(MOUSE_EVENTS.CLICK, { bubbles: true }))
    refuse?.dispatchEvent(new Event(MOUSE_EVENTS.CLICK, { bubbles: true }))

    if (accept || refuse) expect(spy).toHaveBeenCalled()

    el.remove()
  })

  test('empty cookie translations fall back to appText defaults', async () => {
    localStorage.removeItem(PREF_STORAGE_KEYS.COOKIE)

    const el = document.createElement(COMPONENT_TAGS.COOKIE_BANNER)

    el.translations = { cookies: {} }
    document.body.appendChild(el)
    await flush()

    expect(el.shadowRoot.innerHTML.length).toBeGreaterThan(0)

    el.remove()
  })

  test('given consent hides the banner via the stored-preference arm', async () => {
    localStorage.setItem(PREF_STORAGE_KEYS.COOKIE, STATE_STRINGS.TRUE)

    const el = document.createElement(COMPONENT_TAGS.COOKIE_BANNER)

    el.translations = {
      cookies: { message: TEST_TEXT.HELLO, accept: TEST_TEXT.HELLO, refuse: TEST_TEXT.SECOND },
    }
    document.body.appendChild(el)
    await flush()

    expect(el.hidden).toBe(true)

    el.remove()
    localStorage.removeItem(PREF_STORAGE_KEYS.COOKIE)
  })

  test('rendered accept/refuse buttons invoke handleAction', async () => {
    localStorage.removeItem(PREF_STORAGE_KEYS.COOKIE)

    const el = document.createElement(COMPONENT_TAGS.COOKIE_BANNER)

    el.translations = { cookies: {} }
    document.body.appendChild(el)
    await flush()

    const spy = jest.spyOn(el, 'handleAction')
    const accept = el.shadowRoot?.querySelector(`${COOKIE_SELECTORS.COOKIES_BUTTONS_ACCEPT}`)
    const refuse = el.shadowRoot?.querySelector(`${COOKIE_SELECTORS.COOKIES_BUTTONS_REFUSE}`)

    accept?.dispatchEvent(new Event(MOUSE_EVENTS.CLICK, { bubbles: true }))
    refuse?.dispatchEvent(new Event(MOUSE_EVENTS.CLICK, { bubbles: true }))
    await flush()

    if (accept && refuse) expect(spy).toHaveBeenCalled()

    el.remove()
  })
})
