/**
 * @file wasm-utils-wasm-image-decoder.test.js
 * @description Split from wasm-utils.test.js — covers the "wasm-image-decoder" describe.
 */
import { jest } from '@jest/globals'

import { TEST_URLS } from '@tests/fixtures/test-constants.js'

import { wasmPool } from '@core/utils/wasm/wasm-pool.js'
import { wasmImageDecoder } from '@core/utils/wasm/wasm-image-decoder.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'

// The shared setup rAF stub calls cb() with no timestamp — wasm-scroll's
// easing math needs `now`. Re-stub here to pass monotonic timestamps.
const _raf = globalThis.requestAnimationFrame

const _installTimedRaf = () => {
  globalThis.requestAnimationFrame = (cb) => {
    const id = setTimeout(() => cb(performance.now() + 30), 5)

    if (id && typeof id.unref === TYPE_STRINGS.FUNCTION) id.unref()

    return id
  }
}

// ─── wasm-image-decoder ──────────────────────────────────────────────────────
describe('wasm-image-decoder', () => {
  test('decodeImageWASM fetches, dispatches, and caches the bitmap', async () => {
    const bitmap = { close: jest.fn() }

    wasmPool.dispatch = jest.fn(async () => ({ results: { bitmap } }))
    globalThis.fetch = jest.fn(async () => ({
      ok: true,
      blob: async () => new Blob(['x']),
    }))

    const res = await wasmImageDecoder.decodeImageWASM(TEST_URLS.IMG)

    expect(res).toBe(bitmap)
    expect(wasmImageDecoder.bitmapCache.has(TEST_URLS.IMG)).toBe(true)
  })

  test('decodeImageBatchWASM chunks pending items across workers', async () => {
    wasmImageDecoder.bitmapCache.clear()

    const bitmap = { close: jest.fn() }

    wasmPool.workers = [1, 2]
    wasmPool.dispatch = jest.fn(async (_action, { items }) => ({
      results: items.map((it) => ({ url: it.url, bitmap, width: it.width, height: it.height })),
    }))

    const res = await wasmImageDecoder.decodeImageBatchWASM([
      { url: TEST_URLS.A },
      { url: TEST_URLS.B },
      { url: TEST_URLS.IMG },
    ])

    expect(res.size).toBe(3)
    expect(wasmPool.dispatch.mock.calls.length).toBeGreaterThanOrEqual(1)
  })

  test('decodeImageBatchWASM tolerates nullish chunk results', async () => {
    wasmImageDecoder.bitmapCache.clear()

    wasmPool.dispatch = jest.fn(async () => null)

    const res = await wasmImageDecoder.decodeImageBatchWASM([{ url: TEST_URLS.A }])

    expect(res).toBeTruthy()
  })

  test('clearCache closes every cached bitmap', () => {
    const bitmap = { close: jest.fn() }

    wasmImageDecoder.bitmapCache.set(TEST_URLS.A, bitmap)
    wasmImageDecoder.clearCache()

    expect(bitmap.close).toHaveBeenCalled()
    expect(wasmImageDecoder.bitmapCache.size).toBe(0)
  })
})
