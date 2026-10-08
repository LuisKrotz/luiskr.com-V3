/**
 * @file ui-text-tails-test-js.test.js
 * @description Split from coverage-tails.test.js — covers the "ui-text tails" describe.
 */
import { jest } from '@jest/globals'
import store from '@core/store.js'

import '@core/utils/data/sanitize.js'
import { componentText } from '@core/locale/ui-text.js'

import '@website/components/feedback/CookieBanner.js'
import '@website/components/home/ContactSection.js'
import '@website/views/not-found/NotFound.js'
import { TEST_TEXT } from '@tests/fixtures/test-constants.js'
import { LANG_MUTATIONS } from '@core/tokens/events/mutations.js'
import { MEDIA_COMPONENT_KEYS } from '@core/tokens/data/component-keys.js'

jest.unstable_mockModule('@core/firebase.js', () => ({
  signInWithGoogle: jest.fn(async () => ({ user: { uid: 'u1' } })),
  onAuthChange: jest.fn(async (cb) => { cb(null); return () => {} }),
  logoutUser: jest.fn(async () => {}),
  fetchFirebaseDb: jest.fn(async () => ({ exists: () => false, val: () => null })),
  getDbInstance: jest.fn(async () => ({})) }))

describe('ui-text tails', () => {
  test('componentText resolves the live components dict over fallback', () => {
    const prev = store.getters.getlang()?.components

    store.commit(LANG_MUTATIONS.SET_COMPONENT_LANG, { media: { close: TEST_TEXT.SECOND } })

    const live = componentText(MEDIA_COMPONENT_KEYS.MEDIA_CLOSE)
    componentText(TEST_TEXT.HELLO)

    expect(live).toBe(TEST_TEXT.SECOND)

    store.commit(LANG_MUTATIONS.SET_COMPONENT_LANG, prev)
  })
})
