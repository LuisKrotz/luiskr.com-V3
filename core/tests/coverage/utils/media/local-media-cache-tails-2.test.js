/**
 * @file local-media-cache-tails-2.test.js
 * @description Split from coverage-tails-4.test.js — covers the "local-media-cache tails 2" describe.
 */
import { localMediaCache } from '@core/utils/media/local-media-cache.js'

import '@website/components/feedback/CookieBanner.js'
import '@website/components/home/ContactSection.js'
import '@website/views/not-found/NotFound.js'

describe('local-media-cache tails 2', () => {
  test('getCacheStats and storeLocalMedia guard paths', async () => {
    const stats = localMediaCache.getCacheStats()

    expect(stats.memoryCachedCount).toBeGreaterThanOrEqual(0)
    expect(await localMediaCache.storeLocalMedia(null, null)).toBeNull()
    expect(await localMediaCache.fetchOrGetLocalMedia(null)).toBeNull()
  })
})
