/**
 * @file schema-tails-test-js.test.js
 * @description Split from coverage-tails.test.js — covers the "schema tails" describe.
 */
import { jest } from '@jest/globals'
import '@core/utils/data/sanitize.js'

import { generateCarouselItemListSchema } from '@core/utils/schema.js'

import '@website/components/feedback/CookieBanner.js'
import '@website/components/home/ContactSection.js'
import '@website/views/not-found/NotFound.js'

import { TEST_TEXT, TEST_URLS } from '@tests/fixtures/test-constants.js'
import { NET_STRINGS } from '@core/tokens/strings/net.js'

jest.unstable_mockModule('@core/firebase.js', () => ({
  signInWithGoogle: jest.fn(async () => ({ user: { uid: 'u1' } })),
  onAuthChange: jest.fn(async (cb) => { cb(null); return () => {} }),
  logoutUser: jest.fn(async () => {}),
  fetchFirebaseDb: jest.fn(async () => ({ exists: () => false, val: () => null })),
  getDbInstance: jest.fn(async () => ({})) }))

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
