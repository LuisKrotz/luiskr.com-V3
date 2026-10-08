/**
 * @file local-media-cache-tails.test.js
 * @description Split from coverage-tails-2.test.js — covers the "local-media-cache tails" describe.
 */
import { jest } from '@jest/globals'
import _store from '@core/store.js'

import '@website/components/feedback/CookieBanner.js'
import { localMediaCache } from '@core/utils/media/local-media-cache.js'

import { wasmPool } from '@core/utils/wasm/wasm-pool.js'
import { IDB_CONFIG } from '@core/constants.js'
import { TEST_TEXT, TEST_URLS } from '@tests/fixtures/test-constants.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'

describe('local-media-cache tails', () => {
  test('hash falls back to sanitized btoa and cache resolves tiers', async () => {
    const key = await localMediaCache.getWasmMediaHash(TEST_URLS.IMG)

    expect(typeof key).toBe(TYPE_STRINGS.STRING)

    expect(await localMediaCache.getLocalMedia(null)).toBeNull()

    localMediaCache.memoryCache.set(TEST_URLS.IMG, TEST_URLS.BLOB)

    expect(await localMediaCache.getLocalMedia(TEST_URLS.IMG)).toBe(TEST_URLS.BLOB)

    localMediaCache.memoryCache.clear()
  })

  test('IndexedDB tier resolves stored blobs via fake indexedDB', async () => {
    const fakeStore = {
      get: () => {
        const req = {}

        queueMicrotask(() => {
          req.result = { blob: new Blob([TEST_TEXT.HELLO]) }
          req.onsuccess?.()
        })

        return req
      },
      put: () => ({}),
    }
    const fakeDb = {
      objectStoreNames: { contains: () => false },
      createObjectStore: () => ({}),
      transaction: () => ({ objectStore: () => fakeStore }),
    }
    const hadIDB = 'indexedDB' in globalThis

    globalThis.indexedDB = {
      open: () => {
        const req = {}

        queueMicrotask(() => {
          req.onupgradeneeded?.({ target: { result: fakeDb } })
          req.onsuccess?.({ target: { result: fakeDb } })
        })

        return req
      },
    }

    try {
      localMediaCache.db = null

      const ok = await localMediaCache.initStorage()

      expect(ok).toBe(true)
      expect(localMediaCache.db).toBe(fakeDb)

      localMediaCache.memoryCache.clear()

      const got = await localMediaCache.getLocalMedia(`${TEST_URLS.IMG}-idb`)

      expect(got).toBeTruthy()
    } finally {
      if (!hadIDB) delete globalThis.indexedDB

      localMediaCache.db = null
      localMediaCache.memoryCache.clear()
    }
  })

  test('fetchOrGetLocalMedia passes through when object URL creation fails', async () => {
    const orig = URL.createObjectURL

    URL.createObjectURL = () => undefined

    localMediaCache.db = null
    localMediaCache.memoryCache.clear()

    const url = `${window.location.origin}/never-cached-x.png`

    try {
      const out = await localMediaCache.fetchOrGetLocalMedia(url)

      expect(out).toBe(url)
    } finally {
      URL.createObjectURL = orig
      localMediaCache.memoryCache.clear()
    }
  })

  test('initStorage covers existing-store, onerror and open-throw paths', async () => {
    const prevIDB = globalThis.indexedDB
    const restore = () => {
      if (prevIDB === undefined) delete globalThis.indexedDB
      else globalThis.indexedDB = prevIDB
    }

    try {
      const fakeDb = {
        objectStoreNames: { contains: () => true },
        createObjectStore: () => ({}),
      }

      globalThis.indexedDB = {
        open: () => {
          const req = {}

          queueMicrotask(() => {
            req.onupgradeneeded?.({ target: { result: fakeDb } })
            req.onsuccess?.({ target: { result: fakeDb } })
          })

          return req
        },
      }

      localMediaCache.db = null

      expect(await localMediaCache.initStorage()).toBe(true)

      globalThis.indexedDB = {
        open: () => {
          const req = {}

          queueMicrotask(() => req.onerror?.())

          return req
        },
      }

      expect(await localMediaCache.initStorage()).toBe(false)

      globalThis.indexedDB = {
        open: () => {
          throw new Error('idb-x')
        },
      }

      expect(await localMediaCache.initStorage()).toBe(false)
    } finally {
      restore()
      localMediaCache.db = null
      localMediaCache.memoryCache.clear()
    }
  })

  test('getLocalMedia null/onerror/localStorage hits and storeLocalMedia db put', async () => {
    const txGetNull = {
      get: () => {
        const req = {}

        queueMicrotask(() => {
          req.result = null
          req.onsuccess?.()
        })

        return req
      },
      put: () => ({}),
    }
    const txGetErr = {
      get: () => {
        const req = {}

        queueMicrotask(() => req.onerror?.())

        return req
      },
      put: () => ({}),
    }
    const fakeDbNull = { transaction: () => ({ objectStore: () => txGetNull }) }
    const fakeDbErr = { transaction: () => ({ objectStore: () => txGetErr }) }

    localMediaCache.db = fakeDbNull
    localMediaCache.memoryCache.clear()

    expect(await localMediaCache.getLocalMedia(`${TEST_URLS.IMG}-n1`)).toBeNull()

    localMediaCache.db = fakeDbErr

    expect(await localMediaCache.getLocalMedia(`${TEST_URLS.IMG}-n2`)).toBeNull()

    localMediaCache.db = null

    localStorage.setItem(IDB_CONFIG.MEDIA_KEY_PREFIX + `${TEST_URLS.IMG}-ls`, TEST_URLS.BLOB)

    expect(await localMediaCache.getLocalMedia(`${TEST_URLS.IMG}-ls`)).toBe(TEST_URLS.BLOB)
    expect(await localMediaCache.storeLocalMedia(null, null)).toBeNull()

    localMediaCache.db = fakeDbNull

    const stored = await localMediaCache.storeLocalMedia(
      `${TEST_URLS.IMG}-s`,
      new Blob([TEST_TEXT.HELLO])
    )

    expect(stored === null || typeof stored === TYPE_STRINGS.STRING).toBe(true)

    localMediaCache.db = null
    localMediaCache.memoryCache.clear()
  })

  test('wasm hash key hit, fetchOrGetLocalMedia tails and cache stats', async () => {
    const spy = jest.spyOn(wasmPool, 'dispatch')

    spy.mockResolvedValueOnce({ key: 'wasm-key-x' })

    await localMediaCache.getWasmMediaHash(`${TEST_URLS.IMG}-w`)

    spy.mockRestore()

    expect(await localMediaCache.fetchOrGetLocalMedia(null)).toBeNull()

    localMediaCache.memoryCache.set(`${TEST_URLS.IMG}-mem`, TEST_URLS.BLOB)

    expect(await localMediaCache.fetchOrGetLocalMedia(`${TEST_URLS.IMG}-mem`)).toBe(TEST_URLS.BLOB)

    localMediaCache.memoryCache.clear()

    const crossOrigin = `https://${TEST_TEXT.SECOND}.example.com/z.png`

    expect(await localMediaCache.fetchOrGetLocalMedia(crossOrigin)).toBe(crossOrigin)

    const origFetch = globalThis.fetch
    const sameOrigin = `${window.location.origin}/z-not-ok.png`

    globalThis.fetch = async () => ({ ok: false })

    expect(await localMediaCache.fetchOrGetLocalMedia(sameOrigin)).toBe(sameOrigin)

    globalThis.fetch = origFetch

    expect(typeof localMediaCache.getCacheStats()).toBe(TYPE_STRINGS.OBJECT)
  })
})
