/**
 * @file scroll-and-predict-local-media-cache.test.js
 * @description Split from scroll-and-predict.test.js — covers the "local-media-cache" describe.
 */
import { localMediaCache } from '@core/utils/media/local-media-cache.js'
import { TEST_URLS } from '@tests/fixtures/test-constants.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'

const _flush = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms))

// ─── local-media-cache ───────────────────────────────────────────────────────
describe('local-media-cache', () => {
  test('getLocalMedia resolves null for empty and cache-miss URLs', async () => {
    expect(await localMediaCache.getLocalMedia(null)).toBeNull()
    expect(await localMediaCache.getLocalMedia(TEST_URLS.IMG)).toBeNull()
  })

  test('getWasmMediaHash produces a sanitized fallback key', async () => {
    const key = await localMediaCache.getWasmMediaHash(TEST_URLS.IMG)

    expect(key.startsWith('media_')).toBe(true)
  })

  test('storeLocalMedia caches object URLs and getLocalMedia hits memory', async () => {
    globalThis.URL.createObjectURL = globalThis.URL.createObjectURL || (() => 'blob:mock')

    const url = TEST_URLS.A
    const blob = new Blob(['data'])

    const objUrl = await localMediaCache.storeLocalMedia(url, blob)

    expect(objUrl).toBeTruthy()

    const cached = await localMediaCache.getLocalMedia(url)

    expect(cached).toBe(objUrl)
  })

  test('fetchOrGetLocalMedia returns the URL for cross-origin misses', async () => {
    const out = await localMediaCache.fetchOrGetLocalMedia(TEST_URLS.B)

    expect(out).toBe(TEST_URLS.B)
  })

  test('getCacheStats reports memory entries', () => {
    const stats = localMediaCache.getCacheStats()

    expect(stats.memoryCachedCount).toBeGreaterThanOrEqual(0)
    expect(typeof stats.hasIndexedDB).toBe(TYPE_STRINGS.BOOLEAN)
  })
})
