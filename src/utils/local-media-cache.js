// High-Performance WASM-Powered Local Disk Media Cache Engine
// Stores loaded media locally in persistent IndexedDB disk storage & localStorage metadata index.
// Computes media hashes in WASM worker thread and retrieves stored media instantly without network requests.
import { wasmPool } from './wasm-pool.js'

const DB_NAME = 'luiskr_media_disk_cache_v1'
const DB_VERSION = 1
const STORE_NAME = 'media_blobs'

class LocalMediaCache {
  constructor() {
    this.db = null
    this.memoryCache = new Map()
    this.initPromise = this.initStorage()
  }

  async initStorage() {
    if (typeof window === 'undefined' || typeof indexedDB === 'undefined') return false

    return new Promise((resolve) => {
      try {
        const req = indexedDB.open(DB_NAME, DB_VERSION)

        req.onupgradeneeded = (e) => {
          const db = e.target.result
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME, { keyPath: 'url' })
          }
        }

        req.onsuccess = (e) => {
          this.db = e.target.result
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

  // Get WASM hash for media URL
  async getWasmMediaHash(url) {
    try {
      const res = await wasmPool.dispatch('COMPUTE_MEDIA_HASH', { url })
      if (res && res.key) return res.key
    } catch {
      // Fallback hash
    }
    const cleanBtoa = btoa(url)
    const fallbackKey = cleanBtoa.replace(/[^a-zA-Z0-9]/g, '').slice(0, 32)
    return `media_${fallbackKey}`
  }

  // Retrieve media Blob / DataURL from local disk storage
  async getLocalMedia(url) {
    if (!url) return null
    if (this.memoryCache.has(url)) {
      return this.memoryCache.get(url)
    }

    await this.initPromise
    if (!this.db) {
      // LocalStorage fallback check
      try {
        const hashKey = 'luiskr_media_' + url
        const cached = localStorage.getItem(hashKey)
        if (cached) return cached
      } catch {
        // Fallback fail
      }
      return null
    }

    return new Promise((resolve) => {
      try {
        const tx = this.db.transaction(STORE_NAME, 'readonly')
        const store = tx.objectStore(STORE_NAME)
        const req = store.get(url)

        req.onsuccess = () => {
          if (req.result && req.result.blob) {
            const objectUrl = URL.createObjectURL(req.result.blob)
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

  // Save loaded Blob to persistent local disk storage & localStorage index
  async storeLocalMedia(url, blob) {
    if (!url || !blob) return null

    await this.initPromise
    const hashKey = await this.getWasmMediaHash(url)

    // Save in memory cache
    const objectUrl = URL.createObjectURL(blob)
    this.memoryCache.set(url, objectUrl)

    // Save in IndexedDB persistent disk storage
    if (this.db) {
      try {
        const tx = this.db.transaction(STORE_NAME, 'readwrite')
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
      const metaKey = 'luiskr_media_meta_' + hashKey
      const metaVal = JSON.stringify({ url, time: Date.now() })
      localStorage.setItem(metaKey, metaVal)
    } catch {
      // Storage quota exception fallback
    }

    return objectUrl
  }

  // Fetch or retrieve from local storage
  async fetchOrGetLocalMedia(url) {
    if (!url) return url

    // 1. Try retrieving from local disk storage first
    const cachedUrl = await this.getLocalMedia(url)
    if (cachedUrl) {
      return cachedUrl
    }

    // 2. Fetch from remote network if missing locally
    try {
      const res = await fetch(url, { mode: 'cors', cache: 'force-cache' })
      if (!res.ok) return url

      const blob = await res.blob()
      const localUrl = await this.storeLocalMedia(url, blob)
      return localUrl || url
    } catch {
      return url
    }
  }

  getCacheStats() {
    return {
      memoryCachedCount: this.memoryCache.size,
      hasIndexedDB: !!this.db,
    }
  }
}

export const localMediaCache = new LocalMediaCache()
