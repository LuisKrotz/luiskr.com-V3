/**
 * @file entry-points-home-view-module-re-registration-guards.test.js
 * @description Split from entry-points.test.js — covers the "home view module re-registration guards" describe.
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

describe('home view module re-registration guards', () => {
  test('second eval takes the already-defined else arm on all guarded modules', async () => {
    // Home.js transitively imports the three home section modules; each file
    // ends with `if (!customElements.get(TAG)) customElements.define(...)`.
    // The first eval below registers the elements (true arm); the second —
    // after resetModules so the module factory re-runs while the DOM-global
    // custom-element registry persists — takes the skip arm (else). The
    // warm-up mocks above keep the heavy graph stubbed, so unmock the real
    // subtree here and eval it twice; istanbul merges both instances' counts
    // into the file-level branch pair.
    await jest.unstable_unmockModule('@website/views/home/Home.js')
    await jest.unstable_unmockModule('@core/utils/wasm/wasm-css.js')
    await jest.unstable_unmockModule('@/App.js')

    const { VIEW_TAGS } = await import('@core/tokens/elements/views.js')

    jest.resetModules()
    await import('@website/views/home/Home.js')

    jest.resetModules()
    await import('@website/views/home/Home.js')

    expect(customElements.get(VIEW_TAGS.VIEW_HOME)).toBeTruthy()
  })
})
