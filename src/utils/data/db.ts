/**
 * @file db.ts
 * @description SWR-style data layer over Firebase RTDB.
 *
 * Translation nodes resolve instantly from the build-time `database.json`
 * snapshot (bundled as per-locale lazy chunks via the virtual:i18n-boot-index
 * module), then silently revalidate against Firebase — divergent live data
 * re-renders through the caller's onUpdate callback. Non-translation paths
 * go straight to REST with a localStorage copy as offline fallback.
 */

import { DB_PATHS } from '@/core/tokens/routes/paths.js'
import { CHAR_STRINGS } from '@/core/tokens/strings/chars.js'
import { TYPE_STRINGS } from '@/core/tokens/strings/types.js'
import bootLoaders from 'virtual:i18n-boot-index'
import { CACHE_STORAGE_KEYS } from '@/core/tokens/data/storage.js'
import { CDN_URLS } from '@/core/tokens/media/urls.js'

/** Minimal Firebase-style snapshot shape callers consume. */
export interface DbSnapshot {
  exists: () => boolean
  val: () => unknown
}

/** Lazy chunk loaders per locale emitted by the i18n-boot-index plugin. */
type BootLoader = Record<string, () => Promise<{ default: unknown }>>

// Resolved-read promise map — repeated reads of a node share one resolution.
const _dbCache = new Map<string, Promise<DbSnapshot>>()

// Per-locale snapshot-chunk promises (core / projects), so each lazy chunk
// is imported at most once.
const _bootChunks = new Map<string, Promise<unknown>>()

/** Wraps a raw node value in the snapshot shape ({exists, val}) callers expect. */
const _snapshot = (data: unknown): DbSnapshot => {
  const isNull = data === null || data === undefined

  return {
    exists: () => !isNull,
    val: () => data,
  }
}

/**
 * Resolves a translations path against the build-time snapshot of
 * database.json (per-locale lazy chunks). Returns undefined when the path is
 * not covered (non-translation paths, unknown locale) so the caller falls
 * back to the network.
 */
const _fromBootstrap = async (cleanPath: string): Promise<unknown> => {
  if (!cleanPath.startsWith(DB_PATHS.TRANSLATIONS)) return undefined

  const segments = cleanPath
    .slice(DB_PATHS.TRANSLATIONS.length)
    .split(CHAR_STRINGS.SLASH)
    .filter(Boolean)

  const [locale, ...rest] = segments

  const loader = (bootLoaders as Record<string, BootLoader> | undefined)?.[locale]

  if (!loader) return undefined

  const part =
    rest[0] === DB_PATHS.PROJECTS_SEGMENT ? DB_PATHS.PROJECTS_SEGMENT : DB_PATHS.CORE_SEGMENT

  const key = `${locale}/${part}`

  if (!_bootChunks.has(key)) {
    _bootChunks.set(
      key,
      loader[part]()
        .then((m) => m.default)
        .catch(() => null)
    )
  }

  const chunk = await _bootChunks.get(key)

  if (!chunk) return undefined

  return rest.reduce<unknown>(
    (cur, seg) => (cur == null ? undefined : (cur as Record<string, unknown>)[seg]),
    chunk
  )
}

/**
 * Starts downloading the core snapshot chunk for a locale right away so the
 * first render does not wait for an extra network hop after the route chunk.
 */
export const warmBootstrap = (locale: string): void => {
  const loader = (bootLoaders as Record<string, BootLoader> | undefined)?.[locale]

  if (!loader) return

  const key = `${locale}/${DB_PATHS.CORE_SEGMENT}`

  if (!_bootChunks.has(key)) {
    _bootChunks.set(
      key,
      loader[DB_PATHS.CORE_SEGMENT]()
        .then((m) => m.default)
        .catch(() => null)
    )
  }
}

/** Reads the localStorage mirror of a node (offline fallback); null-safe. */
const _readLocalCache = (cleanPath: string): unknown => {
  try {
    if (typeof localStorage === TYPE_STRINGS.UNDEFINED) return null

    const raw = localStorage.getItem(CACHE_STORAGE_KEYS.FB_CACHE_PREFIX + cleanPath)

    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

/**
 * Key-order-insensitive stringify: Firebase may return object keys in a
 * different order than the build snapshot even when content is identical.
 * Array order is preserved (it is meaningful).
 */
const _sortedStringify = (value: unknown): string =>
  JSON.stringify(value, (_k, v) =>
    v && typeof v === 'object' && !Array.isArray(v)
      ? Object.fromEntries(
          Object.keys(v)
            .sort()
            .map((k) => [k, (v as Record<string, unknown>)[k]])
        )
      : v
  )

/** Persists a node to localStorage; swallows quota/security errors. */
const _writeLocalCache = (cleanPath: string, data: unknown): void => {
  try {
    if (typeof localStorage !== TYPE_STRINGS.UNDEFINED && data !== null && data !== undefined) {
      localStorage.setItem(CACHE_STORAGE_KEYS.FB_CACHE_PREFIX + cleanPath, JSON.stringify(data))
    }
  } catch {
    // Quota exceeded fallback
  }
}

/** Fetches a node via the RTDB REST endpoint and mirrors it to localStorage. */
const _fetchNetwork = async (cleanPath: string): Promise<unknown> => {
  const res = await fetch(
    `${CDN_URLS.FIREBASE_DB}${CHAR_STRINGS.SLASH}${cleanPath}${CHAR_STRINGS.JSON_EXT}`
  )

  if (!res.ok) throw new Error(`HTTP ${res.status}`)

  const data = await res.json()

  _writeLocalCache(cleanPath, data)

  return data
}

/**
 * Reads a database node.
 *
 * Static first: translation paths resolve instantly from the build-time
 * snapshot of database.json, then revalidate against Firebase in the
 * background. When the live value differs, the cache is updated and
 * `onUpdate(snapshot)` is called so the caller can re-render with CMS edits
 * made after the last deploy. Non-translation paths go straight to the
 * network with the localStorage copy as offline fallback.
 */
export const fetchFirebaseDb = async (
  path: string,
  onUpdate?: (_snapshot: DbSnapshot) => void
): Promise<DbSnapshot> => {
  const cleanPath = path.startsWith(CHAR_STRINGS.SLASH) ? path.slice(1) : path

  const hit = _dbCache.get(cleanPath)

  if (hit) {
    return hit
  }

  const promise = (async (): Promise<DbSnapshot> => {
    const boot = await _fromBootstrap(cleanPath)

    if (boot !== undefined) {
      const snapshot = _snapshot(boot)

      const serialized = _sortedStringify(boot)

      _fetchNetwork(cleanPath)
        .then((live) => {
          // A missing live node must not wipe content rendered from the
          // snapshot (e.g. locales not yet pushed to Firebase).
          if (live === null || live === undefined) return

          if (_sortedStringify(live) === serialized) return

          const fresh = _snapshot(live)

          _dbCache.set(cleanPath, Promise.resolve(fresh))

          onUpdate?.(fresh)
        })
        .catch(() => {})

      return snapshot
    }

    const cachedData = _readLocalCache(cleanPath)

    try {
      return _snapshot(await _fetchNetwork(cleanPath))
    } catch {
      return cachedData !== null ? _snapshot(cachedData) : _snapshot(null)
    }
  })()

  _dbCache.set(cleanPath, promise)

  return promise
}
