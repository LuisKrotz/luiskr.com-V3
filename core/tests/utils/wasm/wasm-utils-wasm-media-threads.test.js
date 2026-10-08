/**
 * @file wasm-utils-wasm-media-threads.test.js
 * @description Split from wasm-utils.test.js — covers the "wasm-media-threads" describe.
 */
import { jest } from '@jest/globals'

import { TEST_URLS } from '@tests/fixtures/test-constants.js'

import { wasmPool } from '@core/utils/wasm/wasm-pool.js'
import { wasmMediaThreads } from '@core/utils/wasm/wasm-media-threads.js'
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

// ─── wasm-media-threads ──────────────────────────────────────────────────────
describe('wasm-media-threads', () => {
  test('decodeMediaInSeparateThread caches bitmaps per URL', async () => {
    const bitmap = { close: jest.fn() }

    wasmPool.dispatch = jest.fn(async () => ({ results: { bitmap } }))

    const first = await wasmMediaThreads.decodeMediaInSeparateThread(TEST_URLS.A)
    const second = await wasmMediaThreads.decodeMediaInSeparateThread(TEST_URLS.A)

    expect(first).toBe(bitmap)
    expect(second).toBe(bitmap)
    expect(wasmPool.dispatch).toHaveBeenCalledTimes(1)
  })

  test('probeVideo caches results per URL', async () => {
    wasmPool.dispatch = jest.fn(async () => ({ results: { codec: 'h264' } }))

    await wasmMediaThreads.probeVideo(TEST_URLS.VIDEO)
    await wasmMediaThreads.probeVideo(TEST_URLS.VIDEO)

    expect(wasmPool.dispatch).toHaveBeenCalledTimes(1)
  })

  test('returns null for missing URLs', async () => {
    expect(await wasmMediaThreads.decodeMediaInSeparateThread(null)).toBeNull()
    expect(await wasmMediaThreads.probeVideo(null)).toBeNull()
  })
})
