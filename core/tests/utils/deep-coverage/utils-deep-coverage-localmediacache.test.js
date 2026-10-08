/**
 * @file utils-deep-coverage-localmediacache.test.js
 * @description Split from utils-deep-coverage.test.js — covers the "localMediaCache" describe.
 */
import { describe, test, expect, jest } from '@jest/globals'
import { wasmPool } from '@core/utils/wasm/wasm-pool.js'
import { localMediaCache } from '@core/utils/media/local-media-cache.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'

import { IDB_CONFIG } from '@core/constants.js'

const _flush = (ms = 0) => new Promise((r) => setTimeout(r, ms))

// ─── local-media-cache.js ────────────────────────────────────────────────────
describe('localMediaCache', () => {
  test('serves from memory, then localStorage, then network', async () => {
    localMediaCache.memoryCache.clear()
    localMediaCache.db = null

    expect(await localMediaCache.getLocalMedia(null)).toBeNull()
    expect(await localMediaCache.getLocalMedia('missing')).toBeNull()

    localStorage.setItem(IDB_CONFIG.MEDIA_KEY_PREFIX + 'local-hit', 'cached-value')

    expect(await localMediaCache.getLocalMedia('local-hit')).toBe('cached-value')

    localMediaCache.memoryCache.set('mem-hit', 'mem-url')
    expect(await localMediaCache.getLocalMedia('mem-hit')).toBe('mem-url')
  })

  test('storeLocalMedia writes all tiers and fetchOrGetLocalMedia caches through', async () => {
    const origCreate = URL.createObjectURL
    const origFetch = globalThis.fetch

    URL.createObjectURL = () => 'blob:fake'
    wasmPool.dispatch = jest.fn(async () => ({ key: 'hash-key-1' }))
    localMediaCache.memoryCache.clear()
    localMediaCache.db = null

    expect(await localMediaCache.storeLocalMedia(null, null)).toBeNull()

    const stored = await localMediaCache.storeLocalMedia('u1', { size: 3 })

    expect(stored).toBe('blob:fake')
    expect(localMediaCache.memoryCache.get('u1')).toBe('blob:fake')

    // Memory hit — no fetch.
    globalThis.fetch = jest.fn(async () => {
      throw new Error('should not fetch')
    })
    expect(await localMediaCache.fetchOrGetLocalMedia('u1')).toBe('blob:fake')

    // Miss + same-origin fetch → store-through.
    const origin = window.location.origin

    globalThis.fetch = jest.fn(async () => ({ ok: true, blob: async () => ({ size: 9 }) }))
    expect(await localMediaCache.fetchOrGetLocalMedia(`${origin}/asset.jpg`)).toBe('blob:fake')

    // Miss + failed response → passthrough.
    localMediaCache.memoryCache.clear()
    globalThis.fetch = jest.fn(async () => ({ ok: false }))
    expect(await localMediaCache.fetchOrGetLocalMedia(`${origin}/gone.jpg`)).toBe(
      `${origin}/gone.jpg`
    )

    // Cross-origin passthrough without a fetch.
    globalThis.fetch = jest.fn(async () => {
      throw new Error('nope')
    })
    expect(await localMediaCache.fetchOrGetLocalMedia('https://other.example/x')).toBe(
      'https://other.example/x'
    )

    // Null input passthrough.
    expect(await localMediaCache.fetchOrGetLocalMedia(null)).toBeNull()

    URL.createObjectURL = origCreate
    globalThis.fetch = origFetch
  })

  test('getWasmMediaHash falls back to a btoa key when WASM fails', async () => {
    const origDispatch = wasmPool.dispatch

    wasmPool.dispatch = jest.fn(async () => null)

    const key = await localMediaCache.getWasmMediaHash('https://x/y.png')

    expect(key.startsWith('media_')).toBe(true)

    wasmPool.dispatch = jest.fn(async () => {
      throw new Error('wasm down')
    })
    expect(await localMediaCache.getWasmMediaHash('z')).toMatch(/^media_/)

    wasmPool.dispatch = origDispatch
  })

  test('getCacheStats reports memory size + IDB availability', () => {
    const stats = localMediaCache.getCacheStats()

    expect(stats.memoryCachedCount).toBe(localMediaCache.memoryCache.size)
    expect(typeof stats.hasIndexedDB).toBe(TYPE_STRINGS.BOOLEAN)
  })

  test('initStorage succeeds and reads/writes against a fake IndexedDB', async () => {
    jest.resetModules()

    const records = new Map()
    const fakeReq = () => ({ onsuccess: null, onerror: null, onupgradeneeded: null, result: null })
    const fakeStore = {
      get: (k) => {
        const req = fakeReq()
        setTimeout(() => {
          req.result = records.get(k)
          req.onsuccess?.()
        }, 0)
        return req
      },
      put: (v) => {
        records.set(v.url, v)
        return fakeReq()
      },
    }
    const fakeDb = {
      objectStoreNames: { contains: () => false },
      createObjectStore: () => ({}),
      transaction: () => ({ objectStore: () => fakeStore }),
    }

    const origIDB = globalThis.indexedDB

    globalThis.indexedDB = {
      open: () => {
        const req = fakeReq()
        setTimeout(() => {
          req.onupgradeneeded?.({ target: { result: fakeDb } })
          req.result = fakeDb
          req.onsuccess?.({ target: { result: fakeDb } })
        }, 0)
        return req
      },
    }

    const { localMediaCache: freshCache } = await import('@core/utils/media/local-media-cache.js')

    await freshCache.initPromise

    expect(freshCache.db).toBe(fakeDb)

    records.set('hit', { url: 'hit', blob: { id: 1 } })
    URL.createObjectURL = () => 'blob:idb'

    expect(await freshCache.getLocalMedia('hit')).toBe('blob:idb')

    records.set('empty', undefined)
    expect(await freshCache.getLocalMedia('empty')).toBeNull()

    globalThis.indexedDB = origIDB
  })
})
