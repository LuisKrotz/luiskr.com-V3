import { devInfo } from '@/core/devlog.js'
/**
 * @file dev/firebase-mock.js (cms)
 * @description Dev-only offline stub for Firebase Auth + RTDB. Enabled by
 * running the dev server with `CMS_MOCK=1 yarn dev` — vite.config.js
 * aliases `firebase/database` and `../firebase.js` to this module.
 * Reads the committed `database.json` so every CMS editor can be exercised
 * without credentials; all writes are logged instead of persisted.
 * NEVER aliased in production builds — `snyk`/verify scans ignore this file
 * because it cannot be reached from the shipped bundle.
 */

let _dbCache: Record<string, unknown> | null = null

/** Fetches and caches the committed database snapshot once per session. */
async function loadDb(): Promise<Record<string, unknown>> {
  if (!_dbCache) {
    const res = await fetch('/database.json')
    _dbCache = (await res.json()) as Record<string, unknown>
  }

  return _dbCache
}

/** Walks a `a/b/c` path down the snapshot; returns the node or undefined. */
async function getNode(path: string): Promise<unknown> {
  const db = await loadDb()

  let node: unknown = db

  for (const key of path.split('/').filter(Boolean)) {
    node = (node as Record<string, unknown> | undefined)?.[key]
  }

  return node
}

interface MockRef {
  __path: string
}

// ─── firebase/database surface ──────────────────────────────────────────────
/**
 * The ref constant.
 * @param _db — the value
 * @param path — the path
 * @returns MockRef
 */
export const ref = (_db: unknown, path = ''): MockRef => ({ __path: path })
/**
 * The child helper.
 */
export const child = (r: MockRef, path: string): MockRef => ({ __path: `${r.__path}/${path}` })

/**
 * Gets.
 * @param r — the value
 */
export const get = async (r: MockRef) => {
  const node = await getNode(r.__path)

  return { exists: () => node !== undefined && node !== null, val: () => node }
}

/**
 * Sets.
 * @param r — the value
 * @param v — the value
 */
export const set = async (r: MockRef, v: unknown) => devInfo('[CMS-MOCK] set', r.__path, v)
/**
 * The remove helper.
 */
export const remove = async (r: MockRef) => devInfo('[CMS-MOCK] remove', r.__path)
/**
 * The update helper.
 */
export const update = async (r: MockRef, v: unknown) => devInfo('[CMS-MOCK] update', r.__path, v)
/**
 * Gets database.
 */
export const getDatabase = () => ({ __mock: true })

// ─── firebase.js surface ────────────────────────────────────────────────────
const MOCK_USER = Object.freeze({
  email: 'cms-dev@localhost',
  displayName: 'CMS Dev',
  uid: 'cms-mock',
})

type MockUser = typeof MOCK_USER

/**
 * The onAuthChange constant.
 * @param cb — the callback
 */
export const onAuthChange = async (cb: (_user: MockUser | null) => void) => {
  cb(MOCK_USER)

  return () => {}
}

/**
 * Gets db instance.
 */
export const getDbInstance = async () => ({ __mock: true })
/**
 * The sign in with google helper.
 */
export const signInWithGoogle = async () => MOCK_USER
/**
 * The logout user helper.
 */
export const logoutUser = async () => devInfo('[CMS-MOCK] logout')
/**
 * Fetches firebase db.
 * @param path — the path
 */
export const fetchFirebaseDb = async (path: string) => getNode(path)
