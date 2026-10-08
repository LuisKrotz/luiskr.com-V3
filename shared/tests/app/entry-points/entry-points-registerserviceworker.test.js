/**
 * @file entry-points-registerserviceworker.test.js
 * @description Split from entry-points.test.js — covers the "registerServiceWorker" describe.
 */
import { describe, test, expect, jest } from '@jest/globals'

const registerMock = jest.fn()

jest.unstable_mockModule('register-service-worker', () => ({
  register: registerMock,
}))

const authCallbacks = []

jest.unstable_mockModule('@core/firebase.js', () => ({
  onAuthChange: jest.fn(async (cb) => {
    authCallbacks.push(cb)

    return () => {}
  }),
  signInWithGoogle: jest.fn(async () => ({ user: { uid: 'u1' } })),
  logoutUser: jest.fn(async () => {}),
  getDbInstance: jest.fn(async () => ({})),
}))

jest.unstable_mockModule('firebase/database', () => ({
  ref: jest.fn((db, p) => ({ db, p })),
  child: jest.fn((r, p) => ({ r, p })),
  get: jest.fn(async () => ({ exists: () => false, val: () => null })),
  set: jest.fn(async () => {}),
  remove: jest.fn(async () => {}),
}))

const mockRouter = { init: () => {}, subscribe: () => () => {}, currentRoute: null }

jest.unstable_mockModule('@core/router/router.js', () => ({
  default: mockRouter,
  router: mockRouter,
}))

jest.unstable_mockModule('@core/utils/motion/route-warmer.js', () => ({
  startRouteWarming: () => {},
}))

// Boot awaits `./safari/loader.js` whenever isSafari is true (happy-dom lacks
// real CSS.supports, so it is true for most cases here). Re-evaluating that
// real graph after jest.resetModules() starves past the waitFor budget under
// parallel coverage workers and gates `window.router`.
jest.unstable_mockModule('@core/safari/loader.js', () => ({}))

// Each warm-up test re-evaluates the full main.js module graph after
// jest.resetModules() — under the 75%-worker pool that re-import can be
// CPU-starved far beyond the default 60s, so this suite gets 120s.
jest.setTimeout(120000)

describe('registerServiceWorker', () => {
  test('does not register outside production builds', async () => {
    await import('@/registerServiceWorker.js')

    expect(registerMock).not.toHaveBeenCalled()
  })
})
