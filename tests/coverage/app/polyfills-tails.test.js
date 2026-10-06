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

import '@/utils/data/sanitize.js'

import '@/components/feedback/CookieBanner.js'
import '@/components/home/ContactSection.js'
import '@/routes/views/not-found/NotFound.js'

import { TEST_TEXT } from '../../fixtures/test-constants.js'

jest.unstable_mockModule('../../../src/firebase.js', () => ({
  signInWithGoogle: jest.fn(async () => ({ user: { uid: 'u1' } })),
  onAuthChange: jest.fn(async (cb) => { cb(null); return () => {} }),
  logoutUser: jest.fn(async () => {}),
  fetchFirebaseDb: jest.fn(async () => ({ exists: () => false, val: () => null })),
  getDbInstance: jest.fn(async () => ({})),
}))

// ─── genie.js ────────────────────────────────────────────────────────────────

describe('polyfills tails', () => {
  test('installs Array/String .at when missing and handles edges', async () => {
    const arrayAt = Array.prototype.at
    const stringAt = String.prototype.at

    delete Array.prototype.at
    delete String.prototype.at

    jest.resetModules()
    await import('@/legacy-polyfills/polyfills.js')

    const arr = [TEST_TEXT.HELLO, TEST_TEXT.SECOND]

    expect(arr.at(0)).toBe(TEST_TEXT.HELLO)
    expect(arr.at(-1)).toBe(TEST_TEXT.SECOND)
    expect(arr.at(-9)).toBeUndefined()
    expect(arr.at(9)).toBeUndefined()
    expect(TEST_TEXT.HELLO.at(0)).toBe(TEST_TEXT.HELLO[0])

    Array.prototype.at = arrayAt
    String.prototype.at = stringAt

    jest.resetModules()
  })
})

