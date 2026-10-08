/**
 * @file entry-points-cms-main-js-bootstrap.test.js
 * @description Split from entry-points.test.js — covers the "cms/main.js bootstrap" describe.
 */
import { describe, test, expect, jest } from '@jest/globals'
import { CMS_TAGS } from '@cms/tokens.js'
import { waitFor } from '@tests/fixtures/test-constants.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { CMS_IDS } from '@core/tokens/ids/cms.js'

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

describe('cms/main.js bootstrap', () => {
  test('mounts the login view when unauthenticated and dashboard when authed', async () => {
    const root = document.createElement(HTML_TAGS.DIV)

    root.id = CMS_IDS.CMS_ROOT
    document.body.appendChild(root)

    await import('@cms/main.js')
    await waitFor(() => authCallbacks.length)

    expect(authCallbacks.length).toBeGreaterThan(0)

    authCallbacks.forEach((cb) => cb(null))
    await waitFor(() => root.querySelector(CMS_TAGS.VIEW_ADMIN_LOGIN))

    expect(root.querySelector(CMS_TAGS.VIEW_ADMIN_LOGIN)).toBeTruthy()

    const { CMS_EVENTS } = await import('@cms/tokens.js')

    window.dispatchEvent(new window.CustomEvent(CMS_EVENTS.AUTH_CHANGED, { detail: { uid: 'u9' } }))
    window.dispatchEvent(new window.CustomEvent(CMS_EVENTS.AUTH_CHANGED, { detail: { uid: 'u9' } }))
    await waitFor(() => root.querySelector(CMS_TAGS.VIEW_CMS_DASHBOARD))

    expect(root.querySelector(CMS_TAGS.VIEW_CMS_DASHBOARD)).toBeTruthy()

    window.dispatchEvent(new window.CustomEvent(CMS_EVENTS.AUTH_CHANGED, { detail: null }))
    await waitFor(() => root.querySelector(CMS_TAGS.VIEW_ADMIN_LOGIN))

    expect(root.querySelector(CMS_TAGS.VIEW_ADMIN_LOGIN)).toBeTruthy()

    authCallbacks.forEach((cb) => cb({ uid: 'u1' }))
    await waitFor(() => root.querySelector(CMS_TAGS.VIEW_CMS_DASHBOARD))

    expect(root.querySelector(CMS_TAGS.VIEW_CMS_DASHBOARD)).toBeTruthy()
  }, 15000)
})
