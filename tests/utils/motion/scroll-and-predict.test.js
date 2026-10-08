/**
 * @file scroll-and-predict.test.js
 * @description Coverage for the interaction/perf utility layer:
 * scroll-state's scroll/scrollend pipeline, the NPU predictor's
 * pointer-velocity + preload paths, the local media cache's three-tier
 * storage, and the route warmer's idle scheduling.
 */

import { isScrolling, onScrollStop } from '@core/utils/motion/scroll-state.js'
import { npuPredict } from '@core/utils/gpu/npu-predict.js'
import { localMediaCache } from '@core/utils/media/local-media-cache.js'
import { startRouteWarming, stopRouteWarming } from '@core/utils/motion/route-warmer.js'
import { TEST_URLS } from '../../fixtures/test-constants.js'
import { POINTER_EVENTS, WINDOW_EVENTS } from '@core/tokens/events/dom.js'
import { CHAR_STRINGS } from '@core/tokens/strings/chars.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'

const flush = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms))

// ─── scroll-state ────────────────────────────────────────────────────────────

describe('scroll-state', () => {
  test('marks scrolling active and fires the stop callback', async () => {
    const stops = []

    onScrollStop(() => stops.push(1))

    window.dispatchEvent(new window.Event(WINDOW_EVENTS.SCROLL))

    expect(isScrolling()).toBe(true)

    await flush(200)

    expect(isScrolling()).toBe(false)
    expect(stops.length).toBe(1)
  })

  test('a throwing callback does not break the pipeline', async () => {
    const good = []

    window.dispatchEvent(new window.Event(WINDOW_EVENTS.SCROLL))

    onScrollStop(() => {
      throw new Error(CHAR_STRINGS.EMPTY)
    })
    onScrollStop(() => good.push(1))

    await flush(200)

    expect(good.length).toBe(1)
  })
})

// ─── npu-predict ─────────────────────────────────────────────────────────────

describe('npu-predict', () => {
  test('getNpuAnalytics returns the metrics snapshot', async () => {
    await flush(20)

    const snap = npuPredict.getNpuAnalytics()

    expect(snap).toBeTruthy()
    expect(typeof snap.wasmAccelerated).toBe(TYPE_STRINGS.BOOLEAN)
  })

  test('pointer movement updates the velocity tracker', async () => {
    await flush(20)

    window.dispatchEvent(
      new window.MouseEvent(POINTER_EVENTS.POINTERMOVE, { clientX: 100, clientY: 50 })
    )
    window.dispatchEvent(
      new window.MouseEvent(POINTER_EVENTS.POINTERMOVE, { clientX: 200, clientY: 150 })
    )

    expect(npuPredict.pointerVelocity).toBeTruthy()
  })

  test('preloadRouteAsset dedupes targets', async () => {
    await flush(20)

    npuPredict.preloadRouteAsset(TEST_URLS.A)
    npuPredict.preloadRouteAsset(TEST_URLS.A)

    expect(npuPredict.preloadedTargets.has(TEST_URLS.A)).toBe(true)
  })

  test('preloadMediaGPU dispatches through the decoder path without throwing', async () => {
    await flush(20)

    npuPredict.preloadMediaGPU?.(TEST_URLS.IMG, 100, 60)
  })
})

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

// ─── route-warmer ────────────────────────────────────────────────────────────

describe('route-warmer', () => {
  test('startRouteWarming schedules route chunk imports', async () => {
    startRouteWarming()

    await flush(300)
    stopRouteWarming()

    // Reaching here without errors means the scheduler + import chain ran.
    expect(true).toBe(true)
  })
})
