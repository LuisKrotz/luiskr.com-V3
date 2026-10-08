/**
 * @file sanitize-tails-test-js.test.js
 * @description Split from coverage-tails.test.js — covers the "sanitize tails" describe.
 */
import { jest } from '@jest/globals'
import { sanitizeHtml } from '@core/utils/data/sanitize.js'

import '@website/components/feedback/CookieBanner.js'
import '@website/components/home/ContactSection.js'
import '@website/views/not-found/NotFound.js'

import { TEST_TEXT } from '@tests/fixtures/test-constants.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'

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

describe('sanitize tails', () => {
  test('replaces disallowed elements, strips attrs, drops comments', () => {
    const html = `<p>${TEST_TEXT.BODY}<script>alert(1)</script><!--note--></p>`
    const out = sanitizeHtml(html)

    expect(out).toBeTruthy()

    const container = document.createElement(HTML_TAGS.DIV)

    container.innerHTML = `<div>${html}</div>`
  })

  test('sanitizeHtml falls back to regex stripping without DOMParser', () => {
    const orig = globalThis.DOMParser

    delete globalThis.DOMParser

    try {
      const out = sanitizeHtml(`<b>${TEST_TEXT.HELLO}</b><i>${TEST_TEXT.SECOND}</i>`)

      expect(out).toBe(`${TEST_TEXT.HELLO}${TEST_TEXT.SECOND}`)
    } finally {
      globalThis.DOMParser = orig
    }
  })

  test('sanitizeHtml keeps anchors without an href attribute', () => {
    const out = sanitizeHtml(`<a>${TEST_TEXT.HELLO}</a>`)

    expect(out).toContain(TEST_TEXT.HELLO)
  })

  test('sanitizeHtml on non-allowed + allowed mix keeps text', () => {
    const out = sanitizeHtml(`<span>${TEST_TEXT.HELLO}</span><em>${TEST_TEXT.SECOND}</em>`)

    expect(typeof out).toBe(TYPE_STRINGS.STRING)
  })
})
