/**
 * @file firebase.test.js
 * @description Covers src/firebase.js — the split site/CMS bootstrap: lazy
 * auth/database loaders, the backward-compat proxies, and the REST
 * fetchFirebaseDb() path with its in-flight dedup + sessionStorage cache.
 * firebase/auth and firebase/database are module-mocked so no SDK/network
 * code executes; REST reads go through the suite's mocked fetch.
 */

import { describe, test, expect, jest, beforeEach } from '@jest/globals'
import { APP_IDS } from '@/core/tokens/ids/app.js'
import { AUTH_STRINGS } from '@/core/tokens/strings/auth.js'
import { TYPE_STRINGS } from '@/core/tokens/strings/types.js'
import { CACHE_STORAGE_KEYS } from '@/core/tokens/data/storage.js'
import { CHAR_STRINGS } from '@/core/tokens/strings/chars.js'

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

const firebase = await import('@/firebase.js')

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

describe('firebase — fetchFirebaseDb REST reader', () => {
  beforeEach(() => {
    sessionStorage.clear()
    firebase.clearDbCache()
  })

  test('resolves REST payload wrapped in a snapshot shape', async () => {
    const snap = await firebase.fetchFirebaseDb('translations/en/components')
    expect(snap.exists()).toBe(true)
    expect(snap.val()).toEqual({})
  })

  test('dedupes concurrent fetches to the same path into one request', async () => {
    const orig = globalThis.fetch
    globalThis.fetch = jest.fn(async () => ({
      ok: true,
      status: 200,
      json: async () => ({ a: 1 }),
    }))
    const [s1, s2, s3] = await Promise.all([
      firebase.fetchFirebaseDb('path/a'),
      firebase.fetchFirebaseDb('path/a'),
      firebase.fetchFirebaseDb('path/a'),
    ])
    globalThis.fetch = orig
    expect(s1.val()).toEqual({ a: 1 })
    expect(s2.val()).toEqual({ a: 1 })
    expect(s3.val()).toEqual({ a: 1 })
  })

  test('serves subsequent identical reads from the in-flight/session cache', async () => {
    const orig = globalThis.fetch
    let calls = 0
    globalThis.fetch = jest.fn(async () => {
      calls++
      return { ok: true, status: 200, json: async () => ({ b: 2 }) }
    })

    await firebase.fetchFirebaseDb('path/b')
    firebase.clearDbCache() // drop the promise map — sessionStorage must serve next read
    const snap = await firebase.fetchFirebaseDb('path/b')
    globalThis.fetch = orig

    expect(calls).toBe(1) // only the first read hit the network
    expect(snap.val()).toEqual({ b: 2 })
    expect(sessionStorage.getItem(CACHE_STORAGE_KEYS.SESSION_FB_CACHE_PREFIX + 'path/b')).toContain(
      '"b"'
    )
  })

  test('falls back to the SDK when REST fails', async () => {
    const orig = globalThis.fetch
    globalThis.fetch = jest.fn(async () => ({ ok: false, status: 500, json: async () => null }))

    const snap = await firebase.fetchFirebaseDb('path/fail')
    globalThis.fetch = orig

    expect(snap.exists()).toBe(true)
    expect(snap.val()).toEqual({ sdk: true, path: 'path/fail' })
  })

  test('handles fetch throwing outright via SDK fallback', async () => {
    const orig = globalThis.fetch
    globalThis.fetch = jest.fn(async () => {
      throw new Error('network down')
    })

    const snap = await firebase.fetchFirebaseDb('path/throw')
    globalThis.fetch = orig

    expect(snap.exists()).toBe(true)
  })

  test('strips a leading slash from the path', async () => {
    const orig = globalThis.fetch
    let url = ''
    globalThis.fetch = jest.fn(async (u) => {
      url = u
      return { ok: true, status: 200, json: async () => null }
    })

    const snap = await firebase.fetchFirebaseDb('/leading/slash')
    globalThis.fetch = orig

    expect(url).toContain('/leading/slash.json')
    expect(snap.exists()).toBe(false) // null payload → exists() false
  })

  test('null REST payload yields exists() === false', async () => {
    const orig = globalThis.fetch
    globalThis.fetch = jest.fn(async () => ({ ok: true, status: 200, json: async () => null }))

    const snap = await firebase.fetchFirebaseDb('path/null')
    globalThis.fetch = orig

    expect(snap.exists()).toBe(false)
    expect(snap.val()).toBeNull()
  })

  test('survives sessionStorage being unavailable', async () => {
    const origFetch = globalThis.fetch
    const origGet = sessionStorage.getItem
    sessionStorage.getItem = () => {
      throw new Error('storage blocked')
    }
    globalThis.fetch = jest.fn(async () => ({
      ok: true,
      status: 200,
      json: async () => ({ c: 3 }),
    }))

    const snap = await firebase.fetchFirebaseDb('path/blocked')
    expect(snap.val()).toEqual({ c: 3 })

    sessionStorage.getItem = origGet
    globalThis.fetch = origFetch
  })

  test('survives sessionStorage.setItem throwing (quota) via inner catch', async () => {
    const origFetch = globalThis.fetch
    const origSet = sessionStorage.setItem

    sessionStorage.setItem = () => {
      throw new Error('quota exceeded')
    }
    globalThis.fetch = jest.fn(async () => ({
      ok: true,
      status: 200,
      json: async () => ({ d: 4 }),
    }))

    const snap = await firebase.fetchFirebaseDb('path/quota')

    expect(snap.val()).toEqual({ d: 4 })

    sessionStorage.setItem = origSet
    globalThis.fetch = origFetch
  })

  test('falsy path coerces to the empty node via `path || EMPTY` arm', async () => {
    const snap = await firebase.fetchFirebaseDb()

    expect(typeof snap.exists).toBe(TYPE_STRINGS.FUNCTION)
  })

  test('cached snapshot exposes exists()/val() shapes', async () => {
    const orig = globalThis.fetch

    globalThis.fetch = jest.fn(async () => ({
      ok: true,
      status: 200,
      json: async () => ({ e: 5 }),
    }))

    await firebase.fetchFirebaseDb('path/cached')
    firebase.clearDbCache()

    const snap = await firebase.fetchFirebaseDb('path/cached')

    expect(snap.exists()).toBe(true)
    expect(snap.val()).toEqual({ e: 5 })

    globalThis.fetch = orig
  })
})

describe('firebase — fresh module edges', () => {
  test('concurrent getAuthInstance/getDbInstance share the pending promise', async () => {
    jest.resetModules()

    const fresh = await import('@/firebase.js')
    const [a1, a2] = await Promise.all([fresh.getAuthInstance(), fresh.getAuthInstance()])
    const [d1, d2] = await Promise.all([fresh.getDbInstance(), fresh.getDbInstance()])

    expect(a1).toBe(a2)
    expect(d1).toBe(d2)
  })

  test('getApiKey falls back to empty when atob is unavailable', async () => {
    const origAtob = globalThis.atob

    delete globalThis.atob
    jest.resetModules()

    const fresh = await import('@/firebase.js')

    expect(fresh.app.config.apiKey).toBe(CHAR_STRINGS.EMPTY)

    globalThis.atob = origAtob
  })

  test('getApiKey prefers the build-time env value when present', async () => {
    const origEnv = globalThis.__VITE_ENV__

    globalThis.__VITE_ENV__ = { VITE_FIREBASE_API_KEY: 'env-key-1' }
    jest.resetModules()

    const fresh = await import('@/firebase.js')

    expect(fresh.app.config.apiKey).toBe('env-key-1')

    globalThis.__VITE_ENV__ = origEnv
  })
})
