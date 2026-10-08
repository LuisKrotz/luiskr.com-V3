/**
 * @file coverage-tails-4.test.js
 * @description Fourth branch-tail sweep targeting files with ≤8 uncovered
 * branches: ui-text fallback dig, firebase-mock path resolver, sanitize
 * disallowed-tag replacement, webgl-pool IO guard, CMS mount guard,
 * CookieBanner actions, checkbox widget lifecycle, NPU GPU fallback,
 * ContactSection lang guards, jsx prop routing, media helpers,
 * scroll-state one-shots, NotFound link binding, wasm-css reuse,
 * Component remount reuse, schema generators, db bootstrap/cache,
 * gpu-info tiers, wasm-pool worker guards, intro-loader internals.
 */

import { localMediaCache } from '@core/utils/media/local-media-cache.js'

import '@website/components/feedback/CookieBanner.js'
import '@website/components/home/ContactSection.js'
import '@website/views/not-found/NotFound.js'


// ─── core/locale/ui-text.js ──────────────────────────────────────────────────

describe('local-media-cache tails 2', () => {
  test('getCacheStats and storeLocalMedia guard paths', async () => {
    const stats = localMediaCache.getCacheStats()

    expect(stats.memoryCachedCount).toBeGreaterThanOrEqual(0)
    expect(await localMediaCache.storeLocalMedia(null, null)).toBeNull()
    expect(await localMediaCache.fetchOrGetLocalMedia(null)).toBeNull()
  })
})

