/**
 * @file utils-deep-coverage-wasmimagedecoder.test.js
 * @description Split from utils-deep-coverage.test.js — covers the "wasmImageDecoder" describe.
 */
import { describe, test, expect, jest } from '@jest/globals'
import { wasmPool } from '@core/utils/wasm/wasm-pool.js'
import { wasmImageDecoder } from '@core/utils/wasm/wasm-image-decoder.js'
import { gpuAccel } from '@core/utils/gpu/gpu-accel.js'

const _flush = (ms = 0) => new Promise((r) => setTimeout(r, ms))

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
