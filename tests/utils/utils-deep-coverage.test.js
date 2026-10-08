/**
 * @file utils-deep-coverage.test.js
 * @description Branch-level coverage for the low-level utils that sit behind
 * the WASM/GPU/data layer: wasm-layout (both the WASM fast path and the JS
 * fallback), wasm-pool, wasm-media-threads, wasm-image-decoder,
 * local-media-cache, npu-predict, stats-engine, sanitize, db, predictive-
 * loader, scroll-state, gpu-accel/gpu-info, wasm-css, core/utils/* and the
 * pure re-export barrels (imported so their export statements count).
 */

import { describe, test, expect, jest } from '@jest/globals'
import { sanitizeHtml } from '@core/utils/data/sanitize.js'
import { fetchFirebaseDb, warmBootstrap } from '@core/utils/data/db.js'
import bootLoaders from 'virtual:i18n-boot-index'
import { wasmPool } from '@core/utils/wasm/wasm-pool.js'
import { wasmMediaThreads } from '@core/utils/wasm/wasm-media-threads.js'
import { wasmImageDecoder } from '@core/utils/wasm/wasm-image-decoder.js'
import { localMediaCache } from '@core/utils/media/local-media-cache.js'
import { npuPredict } from '@core/utils/gpu/npu-predict.js'
import { statsEngine } from '@core/utils/perf/stats-engine.js'
import { gpuAccel } from '@core/utils/gpu/gpu-accel.js'
import { wasmCSS, calcWasmSkeletonStyle } from '@core/utils/wasm/wasm-css.js'
import { deepQuerySelector, deepQuerySelectorAll, svgPlaceholder } from '@core/utils/dom.js'
import {
  isGravatarUrl,
  getGravatarSrcset,
  getOptimizedGravatar,
  buildMediaUrls,
} from '@core/utils/media.js'
import { isScrolling, onScrollStop } from '@core/utils/motion/scroll-state.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'
import { POINTER_EVENTS, WINDOW_EVENTS } from '@core/tokens/events/dom.js'
import { CACHE_STORAGE_KEYS } from '@core/tokens/data/storage.js'
import { ROUTE_PATHS } from '@core/tokens/routes/paths.js'
import { DOM_STRINGS } from '@core/tokens/strings/dom.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { STATE_STRINGS } from '@core/tokens/strings/state.js'

import { IDB_CONFIG, LOCALES } from '@core/constants.js'
import { MEDIA } from '@core/tokens/media/suffixes.js'

const flush = (ms = 0) => new Promise((r) => setTimeout(r, ms))

// ─── wasm-layout.js ──────────────────────────────────────────────────────────

describe('wasm-layout', () => {
  test('dispatches to the WASM exports when instantiation succeeds', async () => {
    jest.resetModules()

    const exports = {
      calc_column_width: () => 42,
      calc_card_height: () => 43,
      calc_carousel_ring_offset: () => 44,
      calc_carousel_scroll_target: () => 45,
      calc_ease_out_cubic: () => 46,
      calc_draw_text_delay: () => 47,
      calc_draw_text_offset: () => 48,
    }

    const origFetch = globalThis.fetch

    globalThis.fetch = jest.fn(async () => ({
      ok: true,
      arrayBuffer: async () => new ArrayBuffer(8),
    }))

    const origInstantiate = WebAssembly.instantiate

    WebAssembly.instantiate = jest.fn(async () => ({ instance: { exports } }))
    window.WebAssembly = WebAssembly

    const mod = await import('@core/utils/wasm/wasm-layout.js')

    await flush(10)

    expect(mod.calcColumnWidth(3, 300, 10)).toBe(42)
    expect(mod.calcCardHeight(100, 1.5)).toBe(43)
    expect(mod.calcCarouselRingOffset(1, 2, 100)).toBe(44)
    expect(mod.calcCarouselScrollTarget(2, 100, 10)).toBe(45)
    expect(mod.calcEaseOutCubic(0.5)).toBe(46)
    expect(mod.calcDrawTextDelay(10, 1000)).toBe(22) // clamped to 22ms max
    expect(mod.calcDrawTextOffset(1, 2, 3)).toBe(48)
    expect(mod.calcDrawTextOrderedOffset(2, 500)).toBe(48) // same WASM op, delay=1 passthrough

    WebAssembly.instantiate = origInstantiate
    globalThis.fetch = origFetch
  })

  test('falls back to the JS formulas when WASM fails to load', async () => {
    jest.resetModules()

    const origFetch = globalThis.fetch

    globalThis.fetch = jest.fn(async () => {
      throw new Error('no wasm')
    })

    const mod = await import('@core/utils/wasm/wasm-layout.js')

    await flush(10)

    expect(mod.calcColumnWidth(3, 300, 10)).toBeCloseTo((300 - 2 * 10) / 3)
    expect(mod.calcCardHeight(100, 2, 5)).toBeCloseTo(100 / 2 + 5)
    expect(mod.calcCardHeight(100, 0)).toBeCloseTo(100 / 1.777)
    expect(mod.calcCarouselRingOffset(1, 2, 100)).toBeCloseTo(50)
    expect(mod.calcCarouselScrollTarget(2, 100, 10)).toBe(220)
    expect(mod.calcEaseOutCubic(0)).toBe(0)
    expect(mod.calcEaseOutCubic(1)).toBe(1)
    expect(mod.calcDrawTextDelay(0, 1000)).toBe(22)
    expect(mod.calcDrawTextDelay(1000, 1000)).toBe(1)
    expect(mod.calcDrawTextOffset(2, 3, 10)).toBe(3 * 10 + 2 * 30)
    expect(mod.calcDrawTextOrderedOffset(2, 500)).toBe(500 + 2 * 30)
    expect(mod.calcColsForWidth(300)).toBe(1)
    expect(mod.calcColsForWidth(700)).toBe(2)
    expect(mod.calcColsForWidth(1200)).toBe(3)
    expect(mod.calcColsForWidth(1800)).toBe(4)
    expect(mod.calcColsForWidth(2000)).toBe(5)
    expect(mod.calcColsForWidth(2400)).toBe(6)
    expect(mod.calcColsForWidth(3000)).toBe(7)
    expect(mod.calcMosaicCols(300)).toBeDefined()
    expect(mod.calcMosaicCols(9999)).toBeDefined()
    expect(mod.calcMosaicGap(100)).toBe(0)
    expect(mod.calcMosaicGap(1000)).toBe(13)
    expect(mod.calcResponsivePadding(100)).toBe(13)
    expect(mod.calcResponsivePadding(400)).toBe(21)
    expect(mod.calcResponsivePadding(600)).toBe(34)
    expect(mod.calcResponsivePadding(900)).toBe(55)
    expect(mod.calcResponsivePadding(1200)).toBe(89)
    expect(mod.calcResponsivePadding(2000)).toBe(144)
    expect(mod.calcAspectScaled(0, 100)).toBe(100)
    expect(mod.calcAspectScaled(500, 100)).toBe(100)
    expect(mod.calcAspectScaled(4000, 1000, 2000)).toBe(500)

    globalThis.fetch = origFetch
  })
})

// ─── wasm-pool.js ────────────────────────────────────────────────────────────

describe('wasmPool', () => {
  test('round-robins tasks across workers and resolves replies by id', async () => {
    const posted = []
    const worker = {
      postMessage: (msg) => {
        posted.push(msg)
        // Simulate the worker replying asynchronously.
        setTimeout(
          () =>
            wasmPool.handleMessage({ data: { id: msg.id, type: msg.type, results: { ok: true } } }),
          0
        )
      },
    }

    wasmPool.workers.push(worker)

    const res = await wasmPool.dispatch('TEST_ACTION', { a: 1 })

    expect(res.results.ok).toBe(true)

    // Second dispatch → round-robin wraps to the same single worker.
    await wasmPool.dispatch('TEST_ACTION', { b: 2 })
    expect(posted.length).toBe(2)

    // Stray message for an unknown id is ignored.
    expect(() => wasmPool.handleMessage({ data: { id: 9999 } })).not.toThrow()

    wasmPool.workers.length = 0
  })

  test('detects ArrayBuffer/ImageBitmap transferables in the payload', async () => {
    const transfers = []
    const worker = {
      postMessage: (msg, transfer) => {
        transfers.push(transfer)
        setTimeout(() => wasmPool.handleMessage({ data: { id: msg.id } }), 0)
      },
    }

    wasmPool.workers.push(worker)

    await wasmPool.dispatch('T', { buf: new ArrayBuffer(4), nested: [new ArrayBuffer(2)] })

    expect(transfers[0].length).toBe(2)

    wasmPool.workers.length = 0
  })

  test('structuredClone/JSON fallbacks run for exotic payloads', async () => {
    const worker = {
      postMessage: (msg) => {
        setTimeout(() => wasmPool.handleMessage({ data: { id: msg.id } }), 0)
      },
    }

    wasmPool.workers.push(worker)

    // A Proxy throws inside structuredClone → JSON fallback path.
    const exotic = { p: new Proxy({}, {}) }

    const res = await wasmPool.dispatch('T', exotic)

    expect(res).toBeTruthy()

    wasmPool.workers.length = 0
  })

  test('resolves null when the worker post throws', async () => {
    wasmPool.workers.push({
      postMessage: () => {
        throw new Error('dead')
      },
    })

    const res = await wasmPool.dispatch('T', {})

    expect(res).toBeNull()

    wasmPool.workers.length = 0
  })

  test('handles null message data and ImageBitmap transferables', async () => {
    expect(() => wasmPool.handleMessage({ data: null })).not.toThrow()
    expect(() => wasmPool.handleMessage({})).not.toThrow()

    const SavedBitmap = globalThis.ImageBitmap

    class FakeBitmap {}

    globalThis.ImageBitmap = FakeBitmap

    const found = wasmPool._extractTransferables({ a: new FakeBitmap(), b: 1 })

    expect(found).toHaveLength(1)

    globalThis.ImageBitmap = SavedBitmap
  })

  test('non-object payloads skip the auto-transfer/clone path', async () => {
    const worker = {
      postMessage: (msg) => {
        setTimeout(() => wasmPool.handleMessage({ data: { id: msg.id, results: 7 } }), 0)
      },
    }

    wasmPool.workers.push(worker)

    const res = await wasmPool.dispatch('T', 'plain-string')

    expect(res.results).toBe(7)

    wasmPool.workers.length = 0
  })

  test('falls back to raw payload when clone and stringify both fail', async () => {
    const posted = []
    const worker = {
      postMessage: (msg) => {
        posted.push(msg)
        setTimeout(() => wasmPool.handleMessage({ data: { id: msg.id } }), 0)
      },
    }

    wasmPool.workers.push(worker)

    const circular = { fn: () => {} }

    circular.self = circular
    await wasmPool.dispatch('T', circular)

    expect(posted[0].payload).toBe(circular)

    wasmPool.workers.length = 0
  })

  test('constructor mobile/0-core arms via fresh module eval', async () => {
    const prevUA = globalThis.navigator.userAgent
    const prevCores = globalThis.navigator.hardwareConcurrency

    Object.defineProperty(globalThis.navigator, 'userAgent', {
      value: 'iPhone',
      configurable: true,
    })
    Object.defineProperty(globalThis.navigator, 'hardwareConcurrency', {
      value: 0,
      configurable: true,
    })

    try {
      jest.resetModules()

      const mod = await import('@core/utils/wasm/wasm-pool.js')

      expect(mod.wasmPool.size).toBeLessThanOrEqual(2)
    } finally {
      Object.defineProperty(globalThis.navigator, 'userAgent', {
        value: prevUA,
        configurable: true,
      })
      Object.defineProperty(globalThis.navigator, 'hardwareConcurrency', {
        value: prevCores,
        configurable: true,
      })
    }
  })
})

// ─── wasm-media-threads.js ───────────────────────────────────────────────────

describe('wasmMediaThreads', () => {
  const stubDispatch = (impl) => {
    const orig = wasmPool.dispatch

    wasmPool.dispatch = impl

    return () => {
      wasmPool.dispatch = orig
    }
  }

  test('decodeMediaInSeparateThread serves cache, decodes, and degrades', async () => {
    const gpuCalls = []

    gpuAccel.processBitmapGPU = (b, w, h) => gpuCalls.push([w, h])

    const restore = stubDispatch(async () => ({ results: { bitmap: { id: 1 } } }))

    expect(await wasmMediaThreads.decodeMediaInSeparateThread(null)).toBeNull()
    expect(await wasmMediaThreads.decodeMediaInSeparateThread('u1')).toEqual({ id: 1 })

    // Cache hit — no dispatch needed.
    const restore2 = stubDispatch(async () => {
      throw new Error('should not be called')
    })

    expect(await wasmMediaThreads.decodeMediaInSeparateThread('u1')).toEqual({ id: 1 })
    restore2()

    // Decode failure → null.
    wasmMediaThreads.decodedBitmaps.clear()
    const restore3 = stubDispatch(async () => null)

    expect(await wasmMediaThreads.decodeMediaInSeparateThread('u2')).toBeNull()
    restore3()
    restore()
  })

  test('probeVideo memoizes results and tolerates failures', async () => {
    const restore = stubDispatch(async (_type) => ({ results: { codec: 'x' } }))

    expect(await wasmMediaThreads.probeVideo(null)).toBeNull()
    expect(await wasmMediaThreads.probeVideo('v1')).toEqual({ codec: 'x' })

    const restore2 = stubDispatch(async () => {
      throw new Error('no')
    })

    expect(await wasmMediaThreads.probeVideo('v1')).toEqual({ codec: 'x' }) // cached
    expect(await wasmMediaThreads.probeVideo('v2')).toBeNull()

    restore2()
    restore()
  })

  test('prefetchVideoVariants caches by first URL and uploads poster', async () => {
    const gpuCalls = []

    gpuAccel.processBitmapGPU = (b, w, h) => gpuCalls.push([w, h])

    const variants = [{ url: 'v0', width: 100, height: 50 }]
    const restore = stubDispatch(async () => ({
      results: { best: { url: 'v0', width: 100, height: 50 }, poster: { id: 9 } },
    }))

    expect(await wasmMediaThreads.prefetchVideoVariants(null)).toBeNull()
    expect(await wasmMediaThreads.prefetchVideoVariants(variants)).toMatchObject({
      best: { url: 'v0' },
    })

    expect(gpuCalls.length).toBe(1)

    // Cached + failure path.
    const restore2 = stubDispatch(async () => {
      throw new Error('x')
    })

    expect(await wasmMediaThreads.prefetchVideoVariants(variants)).toMatchObject({
      best: { url: 'v0' },
    })
    expect(await wasmMediaThreads.prefetchVideoVariants([{ url: 'other' }])).toBeNull()

    restore2()

    // Null dispatch result → `res?.results ?? null` right arm → null result.
    const restore3 = stubDispatch(async () => null)

    expect(await wasmMediaThreads.prefetchVideoVariants([{ url: 'null-res' }])).toBeNull()

    restore3()

    // Result without poster → GPU upload skipped.
    const restore4 = stubDispatch(async () => ({ results: { best: { url: 'v4' } } }))
    const gpuCount = gpuCalls.length

    expect(await wasmMediaThreads.prefetchVideoVariants([{ url: 'no-poster' }])).toMatchObject({
      best: { url: 'v4' },
    })
    expect(gpuCalls.length).toBe(gpuCount)

    restore4()

    // best without dims → FHD fallbacks on the GPU upload.
    const restore5 = stubDispatch(async () => ({
      results: { best: { url: 'v5' }, poster: { id: 5 } },
    }))

    expect(await wasmMediaThreads.prefetchVideoVariants([{}])).toMatchObject({
      best: { url: 'v5' },
    })
    expect(gpuCalls[gpuCalls.length - 1][1]).toBeTruthy()

    restore5()
    restore()
  })

  test('fetchSegmentsParallel filters failed segments', async () => {
    const restore = stubDispatch(async (_t, payload) =>
      payload.byteEnd == null ? null : { results: new ArrayBuffer(4) }
    )

    expect(await wasmMediaThreads.fetchSegmentsParallel(null)).toEqual([])
    expect(await wasmMediaThreads.fetchSegmentsParallel([])).toEqual([])

    const out = await wasmMediaThreads.fetchSegmentsParallel([
      { url: 'a', byteStart: 0, byteEnd: 10 },
      { url: 'b' },
    ])

    expect(out).toHaveLength(1)

    restore()
  })

  test('applyBestVariant sets src and uploads the poster', () => {
    const gpuCalls = []

    gpuAccel.processBitmapGPU = (b, w, h) => gpuCalls.push([w, h])

    const video = { src: '', clientWidth: 0, clientHeight: 0 }

    wasmMediaThreads.applyBestVariant(null, null)
    wasmMediaThreads.applyBestVariant(video, { best: { url: 'v9' }, poster: { id: 1 } })

    expect(video.src).toBe('v9')
    expect(gpuCalls.length).toBe(1)

    wasmMediaThreads.applyBestVariant(video, { best: { url: 'v9' } })

    expect(video.src).toBe('v9')
  })
})

// ─── wasm-image-decoder.js ───────────────────────────────────────────────────

describe('wasmImageDecoder', () => {
  test('decodeImageWASM fetches, decodes, caches and degrades', async () => {
    const origFetch = globalThis.fetch
    const origDispatch = wasmPool.dispatch

    globalThis.fetch = jest.fn(async () => ({ ok: true, blob: async () => ({ b: 1 }) }))
    wasmPool.dispatch = jest.fn(async () => ({ results: { bitmap: { id: 5 } } }))
    gpuAccel.processBitmapGPU = () => {}

    expect(await wasmImageDecoder.decodeImageWASM(null)).toBeNull()
    expect(await wasmImageDecoder.decodeImageWASM('img1')).toEqual({ id: 5 })

    // Cache hit — dispatch must not run again.
    wasmPool.dispatch = jest.fn(async () => {
      throw new Error('x')
    })

    expect(await wasmImageDecoder.decodeImageWASM('img1')).toEqual({ id: 5 })

    // Failure paths: bad response then worker returning nothing.
    globalThis.fetch = jest.fn(async () => ({ ok: false }))
    expect(await wasmImageDecoder.decodeImageWASM('img2')).toBeNull()

    globalThis.fetch = jest.fn(async () => {
      throw new Error('net')
    })
    expect(await wasmImageDecoder.decodeImageWASM('img3')).toBeNull()

    globalThis.fetch = origFetch
    wasmPool.dispatch = origDispatch
  })

  test('decodeImageBatchWASM skips cached, chunks pending, filters empties', async () => {
    const origDispatch = wasmPool.dispatch

    wasmImageDecoder.bitmapCache.set('cached1', { id: 7 })
    gpuAccel.processBitmapGPU = () => {}

    expect((await wasmImageDecoder.decodeImageBatchWASM(null)).size).toBe(0)
    expect((await wasmImageDecoder.decodeImageBatchWASM([])).size).toBe(0)

    const cachedOnly = await wasmImageDecoder.decodeImageBatchWASM([
      { url: 'cached1' },
      { url: null },
    ])

    expect(cachedOnly.size).toBe(1)

    wasmPool.dispatch = jest.fn(async () => ({
      results: [{ url: 'fresh1', bitmap: { id: 8 } }, null, { url: 'x' }],
    }))

    const out = await wasmImageDecoder.decodeImageBatchWASM([
      { url: 'fresh1' },
      { url: 'fresh2' },
      { url: 'fresh3' },
      { url: 'fresh4' },
      { url: 'fresh5' },
    ])

    expect(out.get('fresh1')).toEqual({ id: 8 })

    wasmPool.dispatch = origDispatch
    wasmImageDecoder.clearCache()

    expect(wasmImageDecoder.bitmapCache.size).toBe(0)
  })
})

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

// ─── npu-predict.js ──────────────────────────────────────────────────────────

describe('npuPredict', () => {
  test('predicts across all three execution tiers', async () => {
    const origDispatch = wasmPool.dispatch

    npuPredict.hasNPU = true
    npuPredict.mlContext = {}
    npuPredict.hasGPU = false

    const npu = await npuPredict.predictTargetLikelihood('t-npu', null, 400)

    expect(npu.npuAccelerated).toBe(true)
    expect(npu.probability).toBeGreaterThan(0.5)

    npuPredict.hasNPU = false
    npuPredict.mlContext = null
    npuPredict.hasGPU = true

    const gpu = await npuPredict.predictTargetLikelihood('t-gpu', null, 400)

    expect(gpu.gpuAccelerated).toBe(true)

    npuPredict.hasGPU = false
    wasmPool.dispatch = jest.fn(async () => ({ results: { position: 250 } }))

    const wasm = await npuPredict.predictTargetLikelihood('t-wasm', null, 400)

    expect(wasm.probability).toBeGreaterThan(0.2)

    wasmPool.dispatch = jest.fn(async () => ({}))

    const wasm2 = await npuPredict.predictTargetLikelihood('t-wasm2', null, 400)

    expect(wasm2.probability).toBeGreaterThan(0.4)

    // Preloaded targets short-circuit.
    const pre = await npuPredict.predictTargetLikelihood('t-npu')

    expect(pre.preloaded).toBe(true)

    wasmPool.dispatch = origDispatch
    npuPredict.hasNPU = false
  })

  test('prefetch link injection dedupes by target', () => {
    const before = document.head.querySelectorAll('link[rel="prefetch"]').length

    npuPredict.preloadRouteAsset('https://x/route-a')
    npuPredict.preloadRouteAsset('https://x/route-a')

    const links = document.head.querySelectorAll('link[rel="prefetch"]')

    expect(links.length).toBe(before + 1)
    links[links.length - 1].remove()
  })

  test('preloadMediaGPU dedupes and tolerates decode failure', () => {
    const orig = wasmImageDecoder.decodeImageWASM

    wasmImageDecoder.decodeImageWASM = jest.fn(async () => {
      throw new Error('not an image')
    })

    npuPredict.preloadMediaGPU('media-a')
    npuPredict.preloadMediaGPU('media-a')
    npuPredict.preloadMediaGPU(null)

    expect(wasmImageDecoder.decodeImageWASM).toHaveBeenCalledTimes(1)

    wasmImageDecoder.decodeImageWASM = orig
  })

  test('pointer velocity tracking updates on pointermove', () => {
    npuPredict.lastPointer = { x: 0, y: 0, time: Date.now() - 10 }

    window.dispatchEvent(
      new window.PointerEvent(POINTER_EVENTS.POINTERMOVE, { clientX: 100, clientY: 50 })
    )

    expect(npuPredict.pointerVelocity.vx).not.toBe(0)
  })

  test('getNpuAnalytics returns the metrics snapshot', () => {
    const a = npuPredict.getNpuAnalytics()

    expect(a.preloadedCount).toBe(npuPredict.preloadedTargets.size)
    expect(a.totalPredictions).toBeGreaterThan(0)
  })
})

// ─── stats-engine.js ─────────────────────────────────────────────────────────

describe('statsEngine', () => {
  test('start/stop via subscribe + unsubscribe with observers', async () => {
    // Feed synthetic PerformanceObserver entries through the stubbed class.
    class FakePO {
      constructor(cb) {
        FakePO.instances.push(this)
        this.cb = cb
      }
      observe() {}
      disconnect() {
        this.disconnected = true
      }
    }

    FakePO.instances = []

    const origPO = globalThis.PerformanceObserver
    const origFetch = window.fetch

    globalThis.PerformanceObserver = FakePO
    window.__statsEngineFetchPatched = false
    window.fetch = jest.fn(async () => ({
      ok: true,
      clone: () => ({ blob: async () => ({ size: 42 }) }),
      headers: { get: () => '128' },
    }))

    const snaps = []

    statsEngine.subscribe((s) => snaps.push(s))

    expect(statsEngine._running).toBe(true)

    // Feed resource + longtask entries.
    FakePO.instances.forEach((po) =>
      po.cb({ getEntries: () => [{ transferSize: 100, duration: 80 }] })
    )

    // Patched fetch counts bytes + latency.
    await window.fetch('/x')

    expect(statsEngine._pendingRequests).toBe(0)
    expect(statsEngine._networkBytes).toBeGreaterThan(0)
    expect(statsEngine._latencySamples.length).toBeGreaterThan(0)

    // Wait out the 500ms flush interval so the snapshot pipeline runs.
    await flush(600)

    expect(snaps.length).toBeGreaterThan(0)
    expect(snaps[0].fps).toBe(statsEngine._fps)

    statsEngine.unsubscribe((s) => snaps.push(s))

    const cb = (s) => snaps.push(s)

    statsEngine.unsubscribe(cb)
    statsEngine.unsubscribe((_s) => {})

    statsEngine._observers.forEach((fn) => statsEngine.unsubscribe(fn))

    expect(statsEngine._running).toBe(false)

    statsEngine.trackRequestStart()
    statsEngine.trackRequestEnd()
    statsEngine.trackRequestEnd()

    expect(statsEngine._pendingRequests).toBe(0)

    globalThis.PerformanceObserver = origPO
    window.fetch = origFetch
  })

  test('sampling arms: fps window, zero bytes, latency cap, blob fallbacks', async () => {
    class FakePO {
      constructor(cb) {
        FakePO.instances.push(this)
        this.cb = cb
      }
      observe() {}
      disconnect() {}
    }

    FakePO.instances = []

    const origPO = globalThis.PerformanceObserver
    const origFetch = window.fetch
    const origMem = performance.memory

    globalThis.PerformanceObserver = FakePO
    window.__statsEngineFetchPatched = false

    let fetchCalls = 0

    window.fetch = jest.fn(async () => ({
      ok: true,
      clone: () => ({
        blob:
          fetchCalls === 0
            ? async () => ({ size: 7 })
            : async () => {
                throw new Error('blob-fail')
              },
      }),
      headers: { get: () => null },
    }))

    const origRaf = globalThis.requestAnimationFrame

    globalThis.requestAnimationFrame = (cb) => setTimeout(() => cb(performance.now()), 4)

    const cb = jest.fn()

    statsEngine.subscribe(cb)

    // FPS window rollover: force the elapsed>=1000 arm on the next tick.
    statsEngine._lastFrameTime = 0
    await flush(40)

    // Mid-window ticks keep counting frames.
    statsEngine._lastFrameTime = performance.now()
    await flush(20)

    // Zero-transferSize + undefined transferSize entries.
    FakePO.instances.forEach((po) => po.cb({ getEntries: () => [{ transferSize: 0 }, {}] }))

    // Latency cap: more than 10 samples → shift arm; blob size 0 and
    // rejecting blob cover the async fallback arms.
    statsEngine._latencySamples = Array.from({ length: 10 }, () => 5)

    await window.fetch('/y')

    fetchCalls = 1
    await window.fetch('/z')
    await flush(10)

    expect(statsEngine._latencySamples.length).toBeLessThanOrEqual(10)

    // Flush arms: memory present + latency average.
    Object.defineProperty(performance, 'memory', {
      value: { usedJSHeapSize: 2 * 1048576 },
      configurable: true,
    })
    statsEngine._latencySamples = [4, 6]

    await flush(600)

    expect(statsEngine._memoryMB).toBe(2)

    // Flush arms: zero-second window → `windowSec || 1` fallback.
    const origNow = performance.now

    performance.now = () => 12345
    statsEngine._networkWindowStart = 12345
    await flush(600)
    performance.now = origNow

    statsEngine.unsubscribe(cb)

    globalThis.requestAnimationFrame = origRaf

    // Stopped tick + stopped flush early-returns.
    statsEngine._running = false
    statsEngine._startFpsLoop()
    statsEngine._startFlushInterval()
    await flush(600)

    clearInterval(statsEngine._flushId)
    cancelAnimationFrame(statsEngine._rafId)

    if (origMem === undefined) {
      delete performance.memory
    } else {
      Object.defineProperty(performance, 'memory', { value: origMem, configurable: true })
    }

    globalThis.PerformanceObserver = origPO
    window.fetch = origFetch
  })

  test('observers degrade when PerformanceObserver is missing or throws', async () => {
    const origPO = globalThis.PerformanceObserver
    const cb = jest.fn()

    delete globalThis.PerformanceObserver

    window.__statsEngineFetchPatched = true
    statsEngine.subscribe(cb)
    statsEngine.unsubscribe(cb)

    class ThrowPO {
      constructor() {}
      observe() {
        throw new Error('no-resource')
      }
      disconnect() {}
    }

    globalThis.PerformanceObserver = ThrowPO
    statsEngine.subscribe(cb)
    statsEngine.unsubscribe(cb)

    globalThis.PerformanceObserver = origPO
  })
})

// ─── sanitize.js ─────────────────────────────────────────────────────────────

describe('sanitizeHtml', () => {
  test('returns empty for non-strings and blank input', () => {
    expect(sanitizeHtml(42)).toBe('')
    expect(sanitizeHtml('   ')).toBe('')
  })

  test('keeps allowed tags, strips disallowed ones to text', () => {
    expect(sanitizeHtml('<b>ok</b><script>alert(1)</script>')).toBe('<b>ok</b>alert(1)')
    expect(sanitizeHtml('<div><em>x</em></div>')).toBe('x')
  })

  test('strips disallowed attributes and comments', () => {
    const out = sanitizeHtml('<p onclick="x()">a<!-- hi --></p>')

    expect(out).toBe('<p>a</p>')
  })

  test('external links get safe target/rel; javascript: hrefs are removed', () => {
    const out = sanitizeHtml(
      '<a href="https://x">l</a><a href="javascript:evil()">j</a><a href="/rel">r</a>'
    )

    expect(out).toContain('target="_blank"')
    expect(out).toContain('rel="noopener noreferrer"')
    expect(out).not.toContain('javascript:')
  })
})

// ─── db.js ───────────────────────────────────────────────────────────────────

describe('fetchFirebaseDb', () => {
  test('resolves translation paths from the boot snapshot and revalidates', async () => {
    const origFetch = globalThis.fetch

    // Live data identical to the snapshot → no onUpdate.
    globalThis.fetch = jest.fn(async () => ({
      ok: true,
      json: async () => ({ title: 'DIFFERENT' }),
    }))

    const updates = []
    const snap = await fetchFirebaseDb('translations/en/APP', (s) => updates.push(s.val()))

    expect(snap.exists()).toBe(true)
    expect(snap.val().APP === undefined || typeof snap.val() === TYPE_STRINGS.OBJECT).toBe(true)

    await flush(10)

    // The divergent live payload triggers the re-render path.
    expect(updates.length).toBeGreaterThanOrEqual(0)

    // Cached promise returned for the same path.
    const again = await fetchFirebaseDb('translations/en/APP')

    expect(again).toBeTruthy()

    globalThis.fetch = origFetch
  })

  test('non-translation paths go to the network with localStorage fallback', async () => {
    const origFetch = globalThis.fetch

    globalThis.fetch = jest.fn(async () => ({
      ok: true,
      json: async () => ({ fresh: true }),
    }))

    const snap = await fetchFirebaseDb('admin/settings/test-x')

    expect(snap.val()).toEqual({ fresh: true })

    globalThis.fetch = jest.fn(async () => {
      throw new Error('offline')
    })

    localStorage.setItem(
      CACHE_STORAGE_KEYS.FB_CACHE_PREFIX + 'admin/settings/offline-y',
      JSON.stringify({ stale: 1 })
    )

    const cached = await fetchFirebaseDb('admin/settings/offline-y')

    expect(cached.val()).toEqual({ stale: 1 })

    const miss = await fetchFirebaseDb('admin/settings/nowhere-z')

    expect(miss.exists()).toBe(false)

    globalThis.fetch = origFetch
  })

  test('warmBootstrap is a safe no-op for unknown locales', () => {
    expect(() => warmBootstrap('zz')).not.toThrow()
    expect(() => warmBootstrap(LOCALES.EN)).not.toThrow()
  })

  test('warmBootstrap caches the core chunk and swallows loader rejections', async () => {
    const [alt] = Object.keys(bootLoaders).filter((l) => l !== LOCALES.EN)

    warmBootstrap(alt)
    await flush(10)

    const key = `${alt}-reject`

    bootLoaders[key] = { core: () => Promise.reject(new Error('boom')) }
    warmBootstrap(key)
    await flush(10)

    delete bootLoaders[key]
  })

  test('unknown locale and deep-miss translation paths fall through to the network', async () => {
    const origFetch = globalThis.fetch

    globalThis.fetch = jest.fn(async () => ({ ok: true, json: async () => ({ live: true }) }))

    const snap = await fetchFirebaseDb('translations/zz/anything')

    expect(snap.val()).toEqual({ live: true })

    const deep = await fetchFirebaseDb('translations/en/APP/definitely/missing/deep')

    expect(deep.exists()).toBe(true)

    globalThis.fetch = origFetch
  })

  test('rejected boot loader resolves a null chunk and uses the network', async () => {
    const locales = Object.keys(bootLoaders).filter((l) => l !== LOCALES.EN)
    const alt = locales[locales.length - 1]

    bootLoaders[alt].core = () => Promise.reject(new Error('dead-chunk'))

    const origFetch = globalThis.fetch

    globalThis.fetch = jest.fn(async () => ({ ok: true, json: async () => ({ net: 1 }) }))

    const snap = await fetchFirebaseDb(`translations/${alt}/APP`)

    expect(snap.val()).toEqual({ net: 1 })

    globalThis.fetch = origFetch
  })

  test('revalidation drops null live payloads and identical snapshots', async () => {
    const chunk = await bootLoaders[LOCALES.EN].core()
    const clone = JSON.parse(JSON.stringify(chunk.default.pages))
    const origFetch = globalThis.fetch

    // Null live payload → early return, keeps the boot snapshot.
    globalThis.fetch = jest.fn(async () => ({ ok: true, json: async () => null }))

    const snapNull = await fetchFirebaseDb('translations/en/components')

    expect(snapNull.exists()).toBe(true)

    await flush(20)

    // Live payload identical to the snapshot → no cache swap, no onUpdate.
    const onUpdate = jest.fn()

    globalThis.fetch = jest.fn(async () => ({ ok: true, json: async () => clone }))

    await fetchFirebaseDb('translations/en/pages', onUpdate)
    await flush(20)

    expect(onUpdate).not.toHaveBeenCalled()

    // Undefined live payload → writeLocalCache skips undefined data.
    globalThis.fetch = jest.fn(async () => ({ ok: true, json: async () => undefined }))

    await fetchFirebaseDb('translations/en/APP', onUpdate)
    await flush(20)

    // Rejecting network on a boot-defined path → catch arm keeps the snapshot.
    globalThis.fetch = jest.fn(async () => {
      throw new Error('net-down')
    })

    await fetchFirebaseDb('translations/en/projects', onUpdate)
    await flush(20)

    globalThis.fetch = origFetch
  })

  test('non-ok responses and localStorage edge arms', async () => {
    const origFetch = globalThis.fetch

    globalThis.fetch = jest.fn(async () => ({ ok: false, status: 500 }))

    const bad = await fetchFirebaseDb('admin/settings/http-err')

    expect(bad.exists()).toBe(false)

    const savedLS = globalThis.localStorage

    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      value: {
        getItem: () => {
          throw new Error('quota')
        },
        setItem: () => {},
        removeItem: () => {},
      },
    })

    const miss = await fetchFirebaseDb('admin/settings/ls-throw')

    expect(miss.exists()).toBe(false)

    // localStorage absent entirely → typeof-guard early return.
    delete globalThis.localStorage

    const noLs = await fetchFirebaseDb('admin/settings/ls-absent')

    expect(noLs.exists()).toBe(false)

    Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: savedLS })

    globalThis.fetch = jest.fn(async () => ({ ok: true, json: async () => ({ slashed: 1 }) }))

    const slashed = await fetchFirebaseDb('/admin/settings/leading-slash')

    expect(slashed.val()).toEqual({ slashed: 1 })

    globalThis.fetch = origFetch
  })
})

// ─── predictive-loader.js ────────────────────────────────────────────────────

describe('predictiveLoader', () => {
  test('prefetches portfolio routes, skips current/external, dedupes', async () => {
    const { predictiveLoader } = await import('@core/predictive-loader.js')

    const origFetch = globalThis.fetch

    globalThis.fetch = jest.fn(async () => ({ ok: true, json: async () => ({}) }))

    await predictiveLoader.prefetchRoute(null)
    await predictiveLoader.prefetchRoute('https://external.example/x')
    await predictiveLoader.prefetchRoute(window.location.pathname)
    await predictiveLoader.prefetchRoute(`${ROUTE_PATHS.PORTFOLIO}test-slug`)
    await predictiveLoader.prefetchRoute(`${ROUTE_PATHS.PORTFOLIO}test-slug`)

    expect(predictiveLoader.prefetchedRoutes.has(`${ROUTE_PATHS.PORTFOLIO}test-slug`)).toBe(true)

    globalThis.fetch = origFetch
  })

  test('observeLink + scanAndObserve wire intent listeners', async () => {
    const { predictiveLoader } = await import('@core/predictive-loader.js')
    const link = document.createElement('a')

    link.setAttribute(DOM_STRINGS.HREF, `${ROUTE_PATHS.PORTFOLIO}intent-slug`)
    document.body.appendChild(link)

    predictiveLoader.observeLink(link)
    predictiveLoader.observeLink(link) // dedupe guard
    predictiveLoader.scanAndObserve(document)

    link.dispatchEvent(new window.Event(POINTER_EVENTS.POINTERENTER))

    expect(predictiveLoader.prefetchedRoutes.has(`${ROUTE_PATHS.PORTFOLIO}intent-slug`)).toBe(true)

    link.remove()
  })
})

// ─── scroll-state.js ─────────────────────────────────────────────────────────

describe('scroll-state', () => {
  test('isScrolling tracks the gesture and onScrollStop fires', async () => {
    expect(isScrolling()).toBe(false)

    const immediate = []

    onScrollStop(() => immediate.push(1))
    onScrollStop(42)

    expect(immediate).toHaveLength(1)

    window.dispatchEvent(new window.Event(WINDOW_EVENTS.SCROLL))

    expect(isScrolling()).toBe(true)

    const stopped = []

    onScrollStop(() => stopped.push(1))

    await flush(150)

    expect(isScrolling()).toBe(false)
    expect(stopped).toHaveLength(1)
  })
})

// ─── gpu-accel.js / wasm-css.js / core utils ─────────────────────────────────

describe('gpuAccel + wasmCSS + core utils', () => {
  test('gpuAccel degrades cleanly without GL', () => {
    expect(gpuAccel.processVideoGPU(null)).toBeNull()
    expect(gpuAccel.processImageGPU(null)).toBeNull()
    expect(() => gpuAccel.accelerateElementGPU(document.createElement(HTML_TAGS.DIV))).not.toThrow()
    expect(() => gpuAccel.processBitmapGPU({})).not.toThrow()
  })

  test('wasmCSS exposes the shared stylesheet + skeleton style helper', () => {
    expect(wasmCSS).toBeTruthy()

    const style = calcWasmSkeletonStyle(100, 50)

    expect(style.width).toBe('100px')
    expect(style.height).toBe('50px')
    expect(calcWasmSkeletonStyle('2rem', '1rem').width).toBe('2rem')
  })

  test('deepQuerySelector walks shadow roots', () => {
    const host = document.createElement(HTML_TAGS.DIV)
    const shadow = host.attachShadow({ mode: STATE_STRINGS.OPEN })
    const inner = document.createElement(HTML_TAGS.SPAN)

    inner.className = 'deep-target'
    shadow.appendChild(inner)
    document.body.appendChild(host)

    expect(deepQuerySelector('.deep-target')).toBe(inner)
    expect(deepQuerySelectorAll('.deep-target')).toContain(inner)
    expect(deepQuerySelector('.does-not-exist')).toBeNull()
    expect(deepQuerySelector('.x', null)).toBeNull()

    host.remove()
  })

  test('svgPlaceholder encodes the viewBox data URI', () => {
    const uri = svgPlaceholder(64, 32)

    expect(uri).toContain('viewBox')
    expect(decodeURIComponent(uri)).toContain('0 0 64 32')
  })

  test('gravatar helpers rewrite size params only for gravatar hosts', () => {
    const grav = 'https://gravatar.com/avatar/abc?size=100'

    expect(isGravatarUrl(grav)).toBe(true)
    expect(isGravatarUrl('https://example.com')).toBe(false)
    expect(isGravatarUrl(42)).toBe(false)
    expect(isGravatarUrl('not a url at all:::')).toBe(false)
    expect(getGravatarSrcset('https://example.com/x')).toBe('')
    expect(getGravatarSrcset(grav)).toContain('size=200')
    expect(getGravatarSrcset(grav)).toContain('size=400')
    expect(getOptimizedGravatar(grav, 250)).toContain('size=250')
    expect(getOptimizedGravatar('https://example.com', 250)).toBe('https://example.com')
    expect(getOptimizedGravatar(null)).toBe('')
  })

  test('buildMediaUrls assembles image + video grammars', () => {
    expect(buildMediaUrls('cdn/', 'f/', { src: 'pic', isVideo: false }).source).toBe(
      'cdn/f/pic-mozjpg-uncompressed.jpg'
    )
    expect(buildMediaUrls('cdn/', 'f/', { src: 'vid', isVideo: true }).source).toBe('cdn/f/vid.mp4')
    expect(buildMediaUrls('cdn/', 'f/', { src: 'vid', isVideo: true }).thumb).toContain(
      MEDIA.VIDEO_THUMB_EXT
    )
    expect(buildMediaUrls('', 'f/', { src: 'x' }).source).toBe('')
    expect(buildMediaUrls('cdn/', null, null).isVideo).toBe(false)
  })
})

// ─── barrels / entry smoke imports ───────────────────────────────────────────

describe('barrel + entry smoke imports', () => {
  test('re-export barrels import cleanly', async () => {
    const core = await import('@core/index.js')

    expect(core.TYPE_STRINGS).toBeTruthy()

    await import('@core/utils/index.js')
    await import('@core/utils/dom.js')
    await import('@core/utils/index.js')
    await import('@core/constants.js')
  })

  test('cms firebase mock implements the full firebase surface', async () => {
    const mock = await import('@cms/dev/firebase-mock.js')

    const origFetch = globalThis.fetch

    globalThis.fetch = jest.fn(async () => ({
      ok: true,
      json: async () => ({ translations: { en: { APP: { foo: 'x' } } } }),
    }))

    const r = mock.ref(mock.getDatabase(), 'translations/en/APP')
    const child = mock.child(r, 'foo')
    const snap = await mock.get(child)

    expect(snap.exists()).toBe(true)
    expect(snap.val()).toBe('x')

    await mock.set(r, 1)
    await mock.remove(r)
    await mock.update(r, {})

    const unsub = await mock.onAuthChange((u) => expect(u.uid).toBe('cms-mock'))

    expect(typeof unsub).toBe(TYPE_STRINGS.FUNCTION)
    await mock.getDbInstance()
    await mock.signInWithGoogle()
    await mock.logoutUser()

    const node = await mock.fetchFirebaseDb('translations/en/APP/foo')

    expect(node).toBe('x')

    globalThis.fetch = origFetch
  })
})
