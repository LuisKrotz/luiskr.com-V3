/**
 * @file firebase-firebase-fetchfirebasedb-rest-reader.test.js
 * @description Split from firebase.test.js — covers the "firebase — fetchFirebaseDb REST reader" describe.
 */
import { describe, test, expect, jest, beforeEach } from '@jest/globals'
import { APP_IDS } from '@core/tokens/ids/app.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'
import { CACHE_STORAGE_KEYS } from '@core/tokens/data/storage.js'

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
