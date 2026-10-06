/**
 * @file local-media-cache.ts
 * @description Three-tier media cache: in-memory Map (object URLs) →
 * IndexedDB blob store (persistent across sessions) → network fetch for
 * same-origin assets. Cache keys are hashed off the main thread by the WASM
 * worker pool (btoa fallback). localStorage keeps a small metadata index.
 */

// High-Performance WASM-Powered Local Disk Media Cache Engine
// Stores loaded media locally in persistent IndexedDB disk storage & localStorage metadata index.
// Computes media hashes in WASM worker thread and retrieves stored media instantly without network requests.
import { WASM_ACTIONS } from '@/core/tokens/data/wasm.js'
import { CACHE_CONFIG, IDB_CONFIG } from '@/core/tokens/media/cache.js'
import { TYPE_STRINGS } from '@/core/tokens/strings/types.js'
import { wasmPool } from '@/utils/wasm/wasm-pool.js'

const {
  MEDIA_DB_NAME: DB_NAME,
  MEDIA_DB_VERSION: DB_VERSION,
  MEDIA_STORE: STORE_NAME,
  READONLY,
  READWRITE,
} = IDB_CONFIG

interface CacheStats {
  memoryCachedCount: number
  hasIndexedDB: boolean
}

/**
 * Two-tier media cache — an in-memory Map for the current session plus
 * an IndexedDB backing store for cross-session persistence. `initPromise`
 * resolves once the IDB database is open (or failed → memory-only).
 */
class LocalMediaCache {
  db: IDBDatabase | null = null
  memoryCache = new Map<string, string>()
  initPromise: Promise<boolean>

  constructor() {
    this.initPromise = this.initStorage()
  }

  /** Opens the media IndexedDB, creating the blob store on first run. Resolves false when IDB is unavailable (private mode, SSR). */
  async initStorage(): Promise<boolean> {
    if (typeof window === TYPE_STRINGS.UNDEFINED || typeof indexedDB === TYPE_STRINGS.UNDEFINED)
      return false

    return new Promise((resolve) => {
      try {
        const req = indexedDB.open(DB_NAME, DB_VERSION)

        req.onupgradeneeded = (e) => {
          const db = (e.target as IDBOpenDBRequest).result

          if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME, { keyPath: 'url' })
          }
        }

        req.onsuccess = (e) => {
          this.db = (e.target as IDBOpenDBRequest).result

          resolve(true)
        }

        req.onerror = () => {
          resolve(false)
        }
      } catch {
        resolve(false)
      }
    })
  }

  /** Computes the media cache key in the WASM worker; falls back to a sanitized btoa when WASM fails. */
  async getWasmMediaHash(url: string): Promise<string> {
    try {
      const res = (await wasmPool.dispatch(WASM_ACTIONS.COMPUTE_MEDIA_HASH, { url })) as {
        key?: string
      } | null

      if (res && res.key) return res.key
    } catch {
      // Fallback hash
    }

    const cleanBtoa = btoa(url)

    const fallbackKey = cleanBtoa.replace(/[^a-zA-Z0-9]/g, '').slice(0, 32)

    return `media_${fallbackKey}`
  }

  /** Resolves a URL to a cached object URL: memory → IndexedDB blob → localStorage string → null. */
  async getLocalMedia(url: string): Promise<string | null> {
    if (!url) return null

    if (this.memoryCache.has(url)) {
      return this.memoryCache.get(url) as string
    }

    await this.initPromise

    if (!this.db) {
      // LocalStorage fallback check
      try {
        const hashKey = IDB_CONFIG.MEDIA_KEY_PREFIX + url

        const cached = localStorage.getItem(hashKey)

        if (cached) return cached
      } catch {
        // Fallback fail
      }

      return null
    }

    const db = this.db

    return new Promise<string | null>((resolve) => {
      try {
        const tx = db.transaction(STORE_NAME, READONLY as IDBTransactionMode)

        const store = tx.objectStore(STORE_NAME)

        const req = store.get(url)

        req.onsuccess = () => {
          const record = req.result as { blob?: Blob } | undefined

          if (record?.blob) {
            const objectUrl = URL.createObjectURL(record.blob)

            this.memoryCache.set(url, objectUrl)

            resolve(objectUrl)
          } else {
            resolve(null)
          }
        }

        req.onerror = () => resolve(null)
      } catch {
        resolve(null)
      }
    })
  }

  /** Persists a blob across all three tiers and returns its object URL. */
  async storeLocalMedia(url: string, blob: Blob): Promise<string | null> {
    if (!url || !blob) return null

    await this.initPromise

    const hashKey = await this.getWasmMediaHash(url)

    // Save in memory cache
    const objectUrl = URL.createObjectURL(blob)

    this.memoryCache.set(url, objectUrl)

    // Save in IndexedDB persistent disk storage
    if (this.db) {
      try {
        const tx = this.db.transaction(STORE_NAME, READWRITE as IDBTransactionMode)

        const store = tx.objectStore(STORE_NAME)

        store.put({
          url,
          hash: hashKey,
          blob,
          timestamp: Date.now(),
        })
      } catch {
        // Ignore transaction error
      }
    }

    // Save metadata in localStorage
    try {
      const metaKey = IDB_CONFIG.MEDIA_META_PREFIX + hashKey

      const metaVal = JSON.stringify({ url, time: Date.now() })

      localStorage.setItem(metaKey, metaVal)
    } catch {
      // Storage quota exception fallback
    }

    return objectUrl
  }

  /** Cache-through read: returns the cached object URL if present, otherwise fetches same-origin, stores, and returns. Cross-origin URLs pass through untouched. */
  async fetchOrGetLocalMedia(url: string): Promise<string | null> {
    if (!url) return url

    // 1. Try retrieving from local disk storage first
    const cachedUrl = await this.getLocalMedia(url)

    if (cachedUrl) {
      return cachedUrl
    }

    // 2. Fetch from remote network if missing locally (same-origin endpoints)
    if (typeof window !== TYPE_STRINGS.UNDEFINED && url.startsWith(window.location.origin)) {
      try {
        const res = await fetch(url, { cache: CACHE_CONFIG.FORCE_CACHE as RequestCache })

        if (res.ok) {
          const blob = await res.blob()

          const localUrl = await this.storeLocalMedia(url, blob)

          return localUrl || url
        }
      } catch {
        // Fallback
      }
    }

    return url
  }

  /** Diagnostic snapshot for the stats HUD (memory entries, IDB availability). */
  getCacheStats(): CacheStats {
    return {
      memoryCachedCount: this.memoryCache.size,
      hasIndexedDB: !!this.db,
    }
  }
}

/**
 * locals media cache.
 */
export const localMediaCache = new LocalMediaCache()
