/**
 * @file sections-cookiebanner.test.js
 * @description Split from sections.test.js — covers the "CookieBanner" describe.
 */
import { describe, test, expect, beforeEach, afterEach } from '@jest/globals'
import { CookieBanner } from '@website/components/feedback/CookieBanner.js'
import { mount } from '@tests/fixtures/test-constants.js'
import { COOKIE_CLASSES } from '@core/tokens/classes/cookies.js'
import { COMPONENT_TAGS } from '@core/tokens/elements/components.js'
import { AWC_CLASSES } from '@core/tokens/classes/awards-carousel.js'
import { APP_EVENTS } from '@core/tokens/events/app.js'
import { PREF_STORAGE_KEYS } from '@core/tokens/data/storage.js'
import { STATE_STRINGS } from '@core/tokens/strings/state.js'

// ─── Local selector helpers (derived from CLASSES) ────────────────────────────
const S = {
  COOKIES: `aside.${COOKIE_CLASSES.COOKIES}`,
  COOKIES_INFO: `.${COOKIE_CLASSES.COOKIES_INFO}`,
  COOKIES_ACCEPT: `.${COOKIE_CLASSES.COOKIES_BUTTONS_ACCEPT}`,
  COOKIES_REFUSE: `.${COOKIE_CLASSES.COOKIES_BUTTONS_REFUSE}`,
  AWC_AWARDS: `${COMPONENT_TAGS.AWARDS_CAROUSEL}.${AWC_CLASSES.AWC_AWARDS}`,
  AWARDS_CAROUSEL: COMPONENT_TAGS.AWARDS_CAROUSEL,
}

// ─────────────────────────────────────────────────────────────────────────────
// CookieBanner
// ─────────────────────────────────────────────────────────────────────────────
describe('CookieBanner', () => {
  let cookieEl
  let cleanup

  beforeEach(() => {
    localStorage.clear()
    cookieEl = new CookieBanner()
    cleanup = mount(cookieEl)
  })

  afterEach(() => {
    cleanup()
    localStorage.clear()
  })

  test('creates shadow root on construction', () => {
    expect(cookieEl.shadowRoot).not.toBeNull()
  })

  test('renders null when translations is null', () => {
    cookieEl.translations = null
    const aside = cookieEl.shadowRoot.querySelector(S.COOKIES)
    expect(aside).toBeNull()
  })

  test('renders aside.cookies when translations provided and no prior consent', () => {
    cookieEl.translations = {
      cookies: { message: 'This site uses cookies.', accept: 'Accept', refuse: 'Refuse' },
    }
    const aside = cookieEl.shadowRoot.querySelector(S.COOKIES)
    expect(aside).not.toBeNull()
    const info = cookieEl.shadowRoot.querySelector(S.COOKIES_INFO)
    expect(info.textContent).toContain('This site uses cookies.')
  })

  test('accept button renders custom translated text', () => {
    cookieEl.translations = { cookies: { message: 'Info', accept: 'Concordo', refuse: 'Recusar' } }
    const acceptBtn = cookieEl.shadowRoot.querySelector(S.COOKIES_ACCEPT)
    expect(acceptBtn.textContent).toBe('Concordo')
  })

  test('clicking accept sets localStorage "cookie" to true and hides banner', () => {
    cookieEl.translations = { cookies: { message: 'Info', accept: 'Accept', refuse: 'Refuse' } }
    let eventFired = false
    const listener = () => {
      eventFired = true
    }
    document.addEventListener(APP_EVENTS.COOKIE_ACTION, listener)

    const acceptBtn = cookieEl.shadowRoot.querySelector(S.COOKIES_ACCEPT)
    acceptBtn.click()

    expect(localStorage.getItem(PREF_STORAGE_KEYS.COOKIE)).toBe(STATE_STRINGS.TRUE)
    expect(eventFired).toBe(true)
    expect(cookieEl.hidden).toBe(true)
    expect(cookieEl.shadowRoot.querySelector(S.COOKIES)).toBeNull()
    document.removeEventListener(APP_EVENTS.COOKIE_ACTION, listener)
  })

  test('clicking refuse sets localStorage "cookie" to false and hides banner', () => {
    cookieEl.translations = { cookies: { message: 'Info', accept: 'Accept', refuse: 'Refuse' } }
    const refuseBtn = cookieEl.shadowRoot.querySelector(S.COOKIES_REFUSE)
    refuseBtn.click()
    expect(localStorage.getItem(PREF_STORAGE_KEYS.COOKIE)).toBe(STATE_STRINGS.FALSE)
    expect(cookieEl.hidden).toBe(true)
    expect(cookieEl.shadowRoot.querySelector(S.COOKIES)).toBeNull()
  })

  test('does not render when localStorage already contains consent', () => {
    localStorage.setItem(PREF_STORAGE_KEYS.COOKIE, STATE_STRINGS.TRUE)
    const newBanner = new CookieBanner()
    document.body.appendChild(newBanner)
    newBanner.translations = { cookies: { message: 'Info', accept: 'Accept', refuse: 'Refuse' } }
    expect(newBanner.hidden).toBe(true)
    expect(newBanner.shadowRoot.querySelector(S.COOKIES)).toBeNull()
    newBanner.parentNode.removeChild(newBanner)
  })
})
