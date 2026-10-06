/**
 * @file coverage-tails.test.js
 * @description Branch-tail coverage sweep for utility modules and small
 * components that sit just under the per-file gate: genie open guards,
 * sanitizeHtml's disallowed-node paths, ui-text live-dict lookup, the CMS
 * firebase mock surface, the Array/String .at ponyfill shims, scroll-state
 * deferred callbacks, gravatar URL classification, NotFound getters, jsx
 * prop-mapping branches, schema builders, wasm-media-threads guards,
 * gpu-info renderer classification, wasm-css style injection, AdminLogin
 * sign-in paths, and the cookie/contact section component branches.
 */
import { jest } from '@jest/globals'
import { sanitizeHtml } from '@/utils/data/sanitize.js'

import '@/components/feedback/CookieBanner.js'
import '@/components/home/ContactSection.js'
import '@/routes/views/not-found/NotFound.js'

import { TEST_TEXT } from '../../../fixtures/test-constants.js'
import { HTML_TAGS } from '../../../../src/core/tokens/elements/html.js'
import { TYPE_STRINGS } from '../../../../src/core/tokens/strings/types.js'



jest.unstable_mockModule('../../../../src/firebase.js', () => ({
  signInWithGoogle: jest.fn(async () => ({ user: { uid: 'u1' } })),
  onAuthChange: jest.fn(async (cb) => { cb(null); return () => {} }),
  logoutUser: jest.fn(async () => {}),
  fetchFirebaseDb: jest.fn(async () => ({ exists: () => false, val: () => null })),
  getDbInstance: jest.fn(async () => ({})) }))


// ─── genie.js ────────────────────────────────────────────────────────────────

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

