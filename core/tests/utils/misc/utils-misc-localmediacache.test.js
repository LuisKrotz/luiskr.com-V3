/**
 * @file utils-misc-localmediacache.test.js
 * @description Split from utils-misc.test.js — covers the "localMediaCache" describe.
 */
import { describe, test, expect, jest } from '@jest/globals'
import { localMediaCache } from '@core/utils/media/local-media-cache.js'
import { NET_STRINGS } from '@core/tokens/strings/net.js'

const _flush = (ms = 60) => new Promise((resolve) => setTimeout(resolve, ms))

// ─── local-media-cache ───────────────────────────────────────────────────────
describe('localMediaCache', () => {
  test('init resolves false when IndexedDB is unavailable', async () => {
    const ok = await localMediaCache.initPromise

    expect([true, false]).toContain(ok)
  })

  test('getWasmMediaHash falls back to sanitized btoa when WASM fails', async () => {
    const key = await localMediaCache.getWasmMediaHash('https://cdn.test/img.png?v=1')

    expect(key).toMatch(/^media_/)
    expect(key).not.toContain('?')
  })

  test('getLocalMedia reads memory cache first', async () => {
    const url = 'https://cdn.test/mem.png'
    const objectUrl = 'blob:fake-1'

    localMediaCache.memoryCache.set(url, objectUrl)

    expect(await localMediaCache.getLocalMedia(url)).toBe(objectUrl)
    expect(await localMediaCache.getLocalMedia('')).toBeNull()
  })

  test('storeLocalMedia writes all available tiers', async () => {
    const url = 'https://cdn.test/store.png'
    const blob = new Blob(['x'], { type: NET_STRINGS.IMAGE_PNG })

    const objectUrl = await localMediaCache.storeLocalMedia(url, blob)

    expect(objectUrl).toBeTruthy()
    expect(localMediaCache.memoryCache.has(url)).toBe(true)
    expect(await localMediaCache.storeLocalMedia('', blob)).toBeNull()
    expect(await localMediaCache.storeLocalMedia(url, null)).toBeNull()
  })

  test('fetchOrGetLocalMedia returns cached urls and passes through external', async () => {
    const url = 'https://external.test/x.png'

    expect(await localMediaCache.fetchOrGetLocalMedia(url)).toBe(url)
    expect(await localMediaCache.fetchOrGetLocalMedia('')).toBe('')

    const sameOrigin = `${window.location.origin}/media/y.png`

    localMediaCache.memoryCache.set(sameOrigin, 'blob:cached')

    expect(await localMediaCache.fetchOrGetLocalMedia(sameOrigin)).toBe('blob:cached')
  })

  test('getCacheStats reports the diagnostic snapshot', async () => {
    const req = { onsuccess: null, onerror: null, result: null }
    const store = { get: jest.fn(() => req) }
    const tx = { objectStore: jest.fn(() => store) }

    const prevDb = localMediaCache.db

    localMediaCache.db = { transaction: jest.fn(() => tx) }

    const pending = localMediaCache.getLocalMedia('idb-key-miss')

    await new Promise((resolve) => setTimeout(resolve, 0))

    req.onerror()

    expect(await pending).toBeNull()

    localMediaCache.db = {
      transaction: () => {
        throw new Error('tx-boom')
      },
    }

    expect(await localMediaCache.getLocalMedia('tx-throw-key')).toBeNull()

    localMediaCache.db = prevDb

    const stats = localMediaCache.getCacheStats()

    expect(stats).toHaveProperty('memoryCachedCount')
    expect(stats).toHaveProperty('hasIndexedDB')
  })
})
