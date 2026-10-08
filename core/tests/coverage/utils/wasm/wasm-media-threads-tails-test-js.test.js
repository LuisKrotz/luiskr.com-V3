/**
 * @file wasm-media-threads-tails-test-js.test.js
 * @description Split from coverage-tails.test.js — covers the "wasm-media-threads tails" describe.
 */
import { jest } from '@jest/globals'

import '@core/utils/data/sanitize.js'

import { wasmMediaThreads } from '@core/utils/wasm/wasm-media-threads.js'

import '@website/components/feedback/CookieBanner.js'
import '@website/components/home/ContactSection.js'
import '@website/views/not-found/NotFound.js'

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

describe('wasm-media-threads tails', () => {
  test('prefetchVideoVariants guards empty input', async () => {
    expect(await wasmMediaThreads.prefetchVideoVariants(null)).toBeNull()
    expect(await wasmMediaThreads.prefetchVideoVariants([])).toBeNull()
  })
})
