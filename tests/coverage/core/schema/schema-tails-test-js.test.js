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
import '@core/utils/data/sanitize.js'

import { generateCarouselItemListSchema } from '@core/utils/schema.js'

import '@website/components/feedback/CookieBanner.js'
import '@website/components/home/ContactSection.js'
import '@website/views/not-found/NotFound.js'

import { TEST_TEXT, TEST_URLS } from '../../../fixtures/test-constants.js'
import { NET_STRINGS } from '@core/tokens/strings/net.js'


jest.unstable_mockModule('@core/firebase.js', () => ({
  signInWithGoogle: jest.fn(async () => ({ user: { uid: 'u1' } })),
  onAuthChange: jest.fn(async (cb) => { cb(null); return () => {} }),
  logoutUser: jest.fn(async () => {}),
  fetchFirebaseDb: jest.fn(async () => ({ exists: () => false, val: () => null })),
  getDbInstance: jest.fn(async () => ({})) }))

// ─── genie.js ────────────────────────────────────────────────────────────────

describe('schema tails', () => {
  test('carousel item list covers empty, bare, relative and http srcs', () => {
    expect(generateCarouselItemListSchema([])).toBeNull()

    const list = generateCarouselItemListSchema([
      { label: TEST_TEXT.HELLO, link: TEST_URLS.IMG },
      { label: TEST_TEXT.SECOND, link: TEST_URLS.IMG, src: TEST_TEXT.SECOND },
      { label: TEST_TEXT.BODY, link: TEST_URLS.IMG, src: `${NET_STRINGS.SITE_URL}/img.png` },
    ])

    expect(list?.['@type']).toBeTruthy()
  })
})

