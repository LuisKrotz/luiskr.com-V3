/**
 * @file firebase.js
 * @description Firebase client bootstrap — split between the site (read-only)
 * and the CMS (auth + writes).
 *
 * The firebase/app core is imported eagerly (tiny), while firebase/auth and
 * firebase/database load lazily behind getAuthInstance()/getDbInstance() so
 * the public site never pays for SDK code it doesn't use.
 *
 * Reads go through fetchFirebaseDb(): a plain REST `.json` GET with a
 * sessionStorage + in-flight-promise cache — zero WebSockets, zero unload
 * listeners — falling back to the SDK only if REST fails.
 */

import { ATTR_VALUES } from '@/core/tokens/attrs/values.js'
import { TYPE_STRINGS } from '@/core/tokens/strings/types.js'
import { initializeApp } from 'firebase/app'
import type { Auth, User, Unsubscribe } from 'firebase/auth'
import type { Database } from 'firebase/database'
import { CDN_URLS } from '@/core/tokens/media/urls.js'
import { CACHE_STORAGE_KEYS } from '@/core/tokens/data/storage.js'
import { devWarn } from '@/core/devlog.js'

/**
 * Resolves the API key from the build env (VITE_FIREBASE_API_KEY) or the
 * base64-encoded fallback baked at build time. Firebase API keys identify
 * the project, not a secret — but the fallback still avoids a plaintext
 * literal for casual scraping.
 */
const getApiKey = () => {
  if (
    typeof import.meta !== TYPE_STRINGS.UNDEFINED &&
    import.meta.env &&
    import.meta.env.VITE_FIREBASE_API_KEY
  ) {
    return import.meta.env.VITE_FIREBASE_API_KEY
  }
  if (typeof atob === TYPE_STRINGS.FUNCTION) {
    return atob('QUl6YVN5RGVEcjNMRGRjMzRJREJBUWMtNkJpVU9lSTMyX0hkN0hJ')
  }
  return ATTR_VALUES.EMPTY
}

const firebaseConfig = {
  apiKey: getApiKey(),
  authDomain: 'luiskr-com.firebaseapp.com',
  databaseURL: CDN_URLS.FIREBASE_DB,
  projectId: 'luiskr-com',
  storageBucket: 'luiskr-com.appspot.com',
  messagingSenderId: '967717102790',
  appId: '1:967717102790:web:eea19f216fd097a08163c7',
  measurementId: 'G-66F5L8CS9F',
}

/**
 * The app constant.
 * @param firebaseConfig — the value
 */
export const app = initializeApp(firebaseConfig)

// Dynamic Auth loader (loaded only for Admin/CMS)
let _authInstance: Auth | null = null
let _authPromise: Promise<Auth> | null = null

/**
 * Lazily imports firebase/auth once and returns the shared Auth instance.
 * Concurrent callers share _authPromise so the chunk is fetched exactly once.
 */
export async function getAuthInstance() {
  if (_authInstance) return _authInstance
  if (!_authPromise) {
    _authPromise = import('firebase/auth').then(({ getAuth }) => {
      _authInstance = getAuth(app)
      return _authInstance
    })
  }
  return await _authPromise
}

// Dynamic Database loader for CMS admin writes
let _dbInstance: Database | null = null
let _dbPromise: Promise<Database> | null = null

/**
 * Lazily imports firebase/database once and returns the shared RTDB
 * instance. Only needed by the CMS write path — public reads use REST.
 */
export async function getDbInstance() {
  if (_dbInstance) return _dbInstance
  if (!_dbPromise) {
    _dbPromise = import('firebase/database').then(({ getDatabase }) => {
      _dbInstance = getDatabase(app)
      return _dbInstance
    })
  }
  return await _dbPromise
}

/** CMS login — Google OAuth popup (forces the account chooser). */
export async function signInWithGoogle() {
  const auth = await getAuthInstance()
  const { GoogleAuthProvider, signInWithPopup } = await import('firebase/auth')
  const provider = new GoogleAuthProvider()
  provider.setCustomParameters({ prompt: 'select_account' })
  return await signInWithPopup(auth, provider)
}

/** Signs the CMS user out. */
export async function logoutUser() {
  const auth = await getAuthInstance()
  const { signOut } = await import('firebase/auth')
  return await signOut(auth)
}

/**
 * Subscribes to auth state after lazily loading firebase/auth.
 * @returns {Promise<Function>} the SDK's unsubscribe function
 */
export async function onAuthChange(callback: (_user: User | null) => void): Promise<Unsubscribe> {
  const auth = await getAuthInstance()
  const { onAuthStateChanged } = await import('firebase/auth')
  return onAuthStateChanged(auth, callback)
}

/** Snapshot-shaped result matching the SDK's DataSnapshot read API. */
export interface DbSnapshot {
  exists: () => boolean
  val: () => unknown
}

// In-flight promise dedup map — parallel calls to the same path share one fetch.
const _fetchCache = new Map<string, Promise<DbSnapshot>>()

/**
 * Lightweight HTTP REST reader for the Realtime Database: GETs
 * `<db>/<path>.json` and wraps the payload in a snapshot-shaped
 * { exists(), val() } object so callers match the SDK API.
 *
 * Cache order: in-flight promise map → sessionStorage (survives route
 * changes within the tab) → network → SDK get() fallback on REST failure.
 */
export async function fetchFirebaseDb(path: string): Promise<DbSnapshot> {
  const cleanPath = (path || '').toString().replace(/^\//, '')
  const url = `${firebaseConfig.databaseURL}/${cleanPath}.json`

  if (_fetchCache.has(url)) {
    return await (_fetchCache.get(url) as Promise<DbSnapshot>)
  }

  // Fast sessionStorage cache lookup for zero latency
  try {
    const cached = sessionStorage.getItem(CACHE_STORAGE_KEYS.SESSION_FB_CACHE_PREFIX + cleanPath)
    if (cached) {
      const data = JSON.parse(cached)
      const cachedResult = Promise.resolve({
        exists: () => data !== null && data !== undefined,
        val: () => data,
      })
      _fetchCache.set(url, cachedResult)
      return await cachedResult
    }
  } catch {
    /* ignore */
  }

  const promise = (async () => {
    try {
      const res = await fetch(url)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      try {
        if (data !== null && data !== undefined) {
          sessionStorage.setItem(
            CACHE_STORAGE_KEYS.SESSION_FB_CACHE_PREFIX + cleanPath,
            JSON.stringify(data)
          )
        }
      } catch {
        /* ignore */
      }
      return {
        exists: () => data !== null && data !== undefined,
        val: () => data,
      }
    } catch (err) {
      devWarn('REST DB fetch failed, falling back to SDK', err)
      const { ref, child, get } = await import('firebase/database')
      const db = await getDbInstance()
      return (await get(child(ref(db), cleanPath))) as unknown as DbSnapshot
    }
  })()

  _fetchCache.set(url, promise)
  return await promise
}

/** Drops the in-memory REST cache (sessionStorage entries persist). */
export function clearDbCache() {
  _fetchCache.clear()
}
