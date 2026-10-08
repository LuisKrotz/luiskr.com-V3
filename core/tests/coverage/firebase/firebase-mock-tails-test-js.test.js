/**
 * @file firebase-mock-tails-test-js.test.js
 * @description Split from coverage-tails.test.js — covers the "firebase-mock tails" describe.
 */
import { jest } from '@jest/globals'
import { LOCALES} from '@core/constants.js'

import '@core/utils/data/sanitize.js'

import '@website/components/feedback/CookieBanner.js'
import '@website/components/home/ContactSection.js'
import '@website/views/not-found/NotFound.js'

import { TEST_TEXT } from '@tests/fixtures/test-constants.js'
import { DB_PATHS } from '@core/tokens/routes/paths.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'

jest.unstable_mockModule('@core/firebase.js', () => ({
  signInWithGoogle: jest.fn(async () => ({ user: { uid: 'u1' } })),
  onAuthChange: jest.fn(async (cb) => { cb(null); return () => {} }),
  logoutUser: jest.fn(async () => {}),
  fetchFirebaseDb: jest.fn(async () => ({ exists: () => false, val: () => null })),
  getDbInstance: jest.fn(async () => ({})) }))

describe('firebase-mock tails', () => {
  test('exercises the full mock surface', async () => {
    const mock = await import('@cms/dev/firebase-mock.js')

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
