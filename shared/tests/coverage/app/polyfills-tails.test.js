/**
 * @file polyfills-tails.test.js
 * @description Split from coverage-tails.test.js — covers the "polyfills tails" describe.
 */
import { jest } from '@jest/globals'

import '@core/utils/data/sanitize.js'

import '@website/components/feedback/CookieBanner.js'
import '@website/components/home/ContactSection.js'
import '@website/views/not-found/NotFound.js'

import { TEST_TEXT } from '@tests/fixtures/test-constants.js'

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

describe('polyfills tails', () => {
  test('installs Array/String .at when missing and handles edges', async () => {
    const arrayAt = Array.prototype.at
    const stringAt = String.prototype.at

    delete Array.prototype.at
    delete String.prototype.at

    jest.resetModules()
    await import('@core/legacy-polyfills/polyfills.js')

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
