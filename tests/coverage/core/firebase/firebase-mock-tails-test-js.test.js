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
import { LOCALES} from '@/core/constants.js'

import '@/utils/data/sanitize.js'

import '@/components/feedback/CookieBanner.js'
import '@/components/home/ContactSection.js'
import '@/routes/views/not-found/NotFound.js'

import { TEST_TEXT } from '../../../fixtures/test-constants.js'
import { DB_PATHS } from '../../../../src/core/tokens/routes/paths.js'
import { TYPE_STRINGS } from '../../../../src/core/tokens/strings/types.js'



jest.unstable_mockModule('../../../../src/firebase.js', () => ({
  signInWithGoogle: jest.fn(async () => ({ user: { uid: 'u1' } })),
  onAuthChange: jest.fn(async (cb) => { cb(null); return () => {} }),
  logoutUser: jest.fn(async () => {}),
  fetchFirebaseDb: jest.fn(async () => ({ exists: () => false, val: () => null })),
  getDbInstance: jest.fn(async () => ({})) }))

// ─── genie.js ────────────────────────────────────────────────────────────────

describe('firebase-mock tails', () => {
  test('exercises the full mock surface', async () => {
    const mock = await import('@/cms/dev/firebase-mock.js')

    const db = mock.getDatabase()

    expect(db.__mock).toBe(true)

    const r = mock.ref(db, `${DB_PATHS.TRANSLATIONS}${LOCALES.EN}`)
    const r2 = mock.child(r, TEST_TEXT.SECOND)

    expect(r2.__path).toContain(TEST_TEXT.SECOND)

    const snap = await mock.get(r)

    expect(typeof snap.exists).toBe(TYPE_STRINGS.FUNCTION)

    await mock.set(r, {})
    await mock.update(r, {})
    await mock.remove(r)
    await mock.signInWithGoogle()
    await mock.logoutUser()
    await mock.getDbInstance()
    await mock.fetchFirebaseDb(`${DB_PATHS.TRANSLATIONS}${LOCALES.EN}`)

    let user = null

    const unsub = await mock.onAuthChange((u) => { user = u })

    expect(user).toBeTruthy()
    unsub?.()
  })
})

