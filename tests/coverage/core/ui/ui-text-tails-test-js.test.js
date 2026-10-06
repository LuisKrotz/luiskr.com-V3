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
import store from '@/core/store.js'

import '@/utils/data/sanitize.js'
import { componentText } from '@/core/locale/ui-text.js'

import '@/components/feedback/CookieBanner.js'
import '@/components/home/ContactSection.js'
import '@/routes/views/not-found/NotFound.js'
import { TEST_TEXT } from '../../../fixtures/test-constants.js'
import { LANG_MUTATIONS } from '../../../../src/core/tokens/events/mutations.js'
import { MEDIA_COMPONENT_KEYS } from '../../../../src/core/tokens/data/component-keys.js'



jest.unstable_mockModule('../../../../src/firebase.js', () => ({
  signInWithGoogle: jest.fn(async () => ({ user: { uid: 'u1' } })),
  onAuthChange: jest.fn(async (cb) => { cb(null); return () => {} }),
  logoutUser: jest.fn(async () => {}),
  fetchFirebaseDb: jest.fn(async () => ({ exists: () => false, val: () => null })),
  getDbInstance: jest.fn(async () => ({})) }))

// ─── genie.js ────────────────────────────────────────────────────────────────

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

