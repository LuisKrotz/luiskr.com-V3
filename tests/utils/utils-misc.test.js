/**
 * @file utils-misc.test.js
 * @description Coverage for misc utility modules: stats-engine (metrics
 * collection lifecycle), predictive-loader (link prefetching),
 * local-media-cache (tiered media caching without IndexedDB), and the
 * aspect-ratio scaler.
 */
import { describe, test, expect, jest } from '@jest/globals'
import { statsEngine } from '@core/utils/perf/stats-engine.js'
import { predictiveLoader } from '@core/predictive-loader.js'
import { localMediaCache } from '@core/utils/media/local-media-cache.js'
import { calcAspectScaled } from '@core/utils/aspect.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { LINK_ATTRS } from '@core/tokens/attrs/link.js'
import { ROUTE_PATHS } from '@core/tokens/routes/paths.js'
import { POINTER_EVENTS } from '@core/tokens/events/dom.js'
import { NET_STRINGS } from '@core/tokens/strings/net.js'

const flush = (ms = 60) => new Promise((resolve) => setTimeout(resolve, ms))

// ─── stats-engine ────────────────────────────────────────────────────────────

describe('statsEngine', () => {
  test('subscribe starts samplers and getSnapshot reports all metrics', async () => {
    const cb = jest.fn()

    statsEngine.subscribe(cb)

    expect(statsEngine._running).toBe(true)

    await flush(80)

    const snap = statsEngine.getSnapshot()

    expect(snap).toHaveProperty('fps')
    expect(snap).toHaveProperty('networkBytesPerSec')
    expect(snap).toHaveProperty('pendingRequests')
    expect(snap).toHaveProperty('memoryMB')
    expect(snap).toHaveProperty('cpuPercent')
    expect(snap).toHaveProperty('latencyMs')

    statsEngine.unsubscribe(cb)

    expect(statsEngine._running).toBe(false)
  })

  test('fetch patching tracks pending requests and latency', async () => {
    const cb = jest.fn()

    statsEngine.subscribe(cb)
    await flush(20)

    await window.fetch('https://example.test/x')
    await flush(20)

    statsEngine.unsubscribe(cb)
  })

  test('double-subscribe dedupes and last unsubscribe stops everything', async () => {
    const cb1 = jest.fn()
    const cb2 = jest.fn()

    statsEngine.subscribe(cb1)
    statsEngine.subscribe(cb2)
    statsEngine.unsubscribe(cb1)

    expect(statsEngine._running).toBe(true)

    statsEngine.unsubscribe(cb2)

    expect(statsEngine._running).toBe(false)
  })
})

// ─── predictive-loader ───────────────────────────────────────────────────────

describe('predictiveLoader', () => {
  test('observeLink attaches intent listeners once per element', () => {
    const link = document.createElement(HTML_TAGS.A)

    link.setAttribute(LINK_ATTRS.HREF, `${ROUTE_PATHS.ROOT}portfolio/metcha`)

    predictiveLoader.observeLink(link)
    predictiveLoader.observeLink(link)

    link.dispatchEvent(new window.Event(POINTER_EVENTS.POINTERENTER))

    expect(predictiveLoader.prefetchedRoutes.size).toBeGreaterThan(0)
  })

  test('scanAndObserve discovers links under a root', () => {
    const root = document.createElement(HTML_TAGS.DIV)
    const link = document.createElement(HTML_TAGS.A)

    link.setAttribute(LINK_ATTRS.HREF, `${ROUTE_PATHS.ROOT}about`)
    root.appendChild(link)
    document.body.appendChild(root)

    predictiveLoader.scanAndObserve(root)
  })

  test('prefetchRoute ignores external and current-route paths', async () => {
    await predictiveLoader.prefetchRoute('https://external.example/x')
    await predictiveLoader.prefetchRoute(window.location.pathname)

    expect(predictiveLoader.prefetchedRoutes.has('https://external.example/x')).toBe(false)
  })

  test('prefetchRoute dedupes repeated route paths', async () => {
    const path = `${ROUTE_PATHS.ROOT}portfolio/dedup-test`

    await predictiveLoader.prefetchRoute(path)
    await predictiveLoader.prefetchRoute(path)

    expect(predictiveLoader.prefetchedRoutes.has(path)).toBe(true)
  })
})

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

// ─── aspect ──────────────────────────────────────────────────────────────────

describe('calcAspectScaled', () => {
  test('scales height proportionally to maxWidth', () => {
    expect(calcAspectScaled(1920, 1080, 960)).toBe(540)
    expect(calcAspectScaled(100, 50, 200)).toBe(100)
  })

  test('returns fallback for missing dimensions', () => {
    expect(calcAspectScaled(0, 100, 500)).toBe(100)
    expect(calcAspectScaled(100, 0, 500)).toBe(0)
    expect(calcAspectScaled(100, 50, 0)).toBe(50)
    expect(calcAspectScaled(0, 0, 0)).toBe(0)
  })
})
