/**
 * @file firebase-firebase-bootstrap-lazy-loaders.test.js
 * @description Split from firebase.test.js — covers the "firebase — bootstrap & lazy loaders" describe.
 */
import { describe, test, expect, jest } from '@jest/globals'
import { APP_IDS } from '@core/tokens/ids/app.js'
import { AUTH_STRINGS } from '@core/tokens/strings/auth.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'

const mockAuth = { currentUser: null, marker: 'auth-instance' }
const mockDb = { marker: 'db-instance' }

jest.unstable_mockModule('firebase/auth', () => ({
  getAuth: jest.fn(() => mockAuth),
  GoogleAuthProvider: jest.fn(() => ({ setCustomParameters: jest.fn() })),
  signInWithPopup: jest.fn(async () => ({ user: { uid: 'u1' } })),
  signInWithRedirect: jest.fn(async () => undefined),
  getRedirectResult: jest.fn(async () => null),
  signOut: jest.fn(async () => undefined),
  onAuthStateChanged: jest.fn((_a, cb) => () => cb),
}))

jest.unstable_mockModule('firebase/database', () => ({
  getDatabase: jest.fn(() => mockDb),
  ref: jest.fn((db) => ({ db })),
  child: jest.fn((r, p) => ({ ...r, path: p })),
  get: jest.fn(async (r) => ({ exists: () => true, val: () => ({ sdk: true, path: r?.path }) })),
}))

jest.unstable_mockModule('firebase/app', () => ({
  initializeApp: jest.fn((config) => ({ config, marker: APP_IDS.APP })),
}))

const firebase = await import('@core/firebase.js')

describe('firebase — bootstrap & lazy loaders', () => {
  test('app initializes with project config', () => {
    expect(firebase.app.marker).toBe(APP_IDS.APP)
    expect(firebase.app.config.projectId).toBe('luiskr-com')
    expect(firebase.app.config.databaseURL).toContain('luiskr-com')
  })

  test('no eager auth/db exports — SDKs load only via the lazy getters', () => {
    // The auth/db Proxy shims were removed: nothing may import a Firebase SDK
    // instance synchronously; getAuthInstance/getDbInstance are the contract.
    expect('auth' in firebase).toBe(false)
    expect('db' in firebase).toBe(false)
  })

  test('getAuthInstance lazily loads and memoizes the auth instance', async () => {
    const a1 = await firebase.getAuthInstance()
    const a2 = await firebase.getAuthInstance()
    expect(a1).toBe(mockAuth)
    expect(a2).toBe(mockAuth)
  })

  test('getDbInstance lazily loads and memoizes the db instance', async () => {
    const d1 = await firebase.getDbInstance()
    const d2 = await firebase.getDbInstance()
    expect(d1).toBe(mockDb)
    expect(d2).toBe(mockDb)
  })

  test('signInWithGoogle forces the account chooser and resolves the user', async () => {
    const { signInWithPopup } = await import('firebase/auth')
    const res = await firebase.signInWithGoogle()
    expect(res.user.uid).toBe('u1')
    expect(signInWithPopup).toHaveBeenCalled()
  })

  test('logoutUser signs out', async () => {
    const { signOut } = await import('firebase/auth')
    await firebase.logoutUser()
    expect(signOut).toHaveBeenCalledWith(mockAuth)
  })

  test('signInWithGoogle falls back to redirect when the popup environment fails', async () => {
    const { signInWithPopup, signInWithRedirect } = await import('firebase/auth')

    signInWithPopup.mockRejectedValueOnce({ code: AUTH_STRINGS.ERR_INTERNAL })

    const res = await firebase.signInWithGoogle()

    expect(signInWithRedirect).toHaveBeenCalled()
    expect(res).toBeUndefined()
  })

  test('signInWithGoogle redirects for every popup-environment code', async () => {
    const { signInWithPopup, signInWithRedirect } = await import('firebase/auth')

    const before = signInWithRedirect.mock.calls.length

    for (const code of [
      AUTH_STRINGS.ERR_POPUP_BLOCKED,
      AUTH_STRINGS.ERR_STORAGE_UNSUPPORTED,
      AUTH_STRINGS.ERR_ENV_UNSUPPORTED,
    ]) {
      signInWithPopup.mockRejectedValueOnce({ code })
      await firebase.signInWithGoogle()
    }

    expect(signInWithRedirect.mock.calls.length).toBe(before + 3)
  })

  test('signInWithGoogle rethrows user cancellations instead of redirecting', async () => {
    const { signInWithPopup, signInWithRedirect } = await import('firebase/auth')

    const before = signInWithRedirect.mock.calls.length

    signInWithPopup.mockRejectedValueOnce({ code: AUTH_STRINGS.ERR_POPUP_CLOSED })

    await expect(firebase.signInWithGoogle()).rejects.toEqual({
      code: AUTH_STRINGS.ERR_POPUP_CLOSED,
    })

    expect(signInWithRedirect.mock.calls.length).toBe(before) // no new fallback
  })

  test('onAuthChange subscribes via onAuthStateChanged', async () => {
    const { onAuthStateChanged } = await import('firebase/auth')
    const unsub = await firebase.onAuthChange(() => {})
    expect(onAuthStateChanged).toHaveBeenCalled()
    expect(typeof unsub).toBe(TYPE_STRINGS.FUNCTION)
  })

  test('onAuthChange still subscribes when the redirect result rejects', async () => {
    const { getRedirectResult, onAuthStateChanged } = await import('firebase/auth')

    getRedirectResult.mockRejectedValueOnce(new Error('redirect failed'))

    const unsub = await firebase.onAuthChange(() => {})

    expect(onAuthStateChanged).toHaveBeenCalled()
    expect(typeof unsub).toBe(TYPE_STRINGS.FUNCTION)
  })
})
