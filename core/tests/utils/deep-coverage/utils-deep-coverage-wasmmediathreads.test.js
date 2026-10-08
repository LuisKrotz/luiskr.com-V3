/**
 * @file utils-deep-coverage-wasmmediathreads.test.js
 * @description Split from utils-deep-coverage.test.js — covers the "wasmMediaThreads" describe.
 */
import { describe, test, expect } from '@jest/globals'
import { wasmPool } from '@core/utils/wasm/wasm-pool.js'
import { wasmMediaThreads } from '@core/utils/wasm/wasm-media-threads.js'
import { gpuAccel } from '@core/utils/gpu/gpu-accel.js'

const _flush = (ms = 0) => new Promise((r) => setTimeout(r, ms))

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
