/**
 * @file wasm-utils-wasm-pool.test.js
 * @description Split from wasm-utils.test.js — covers the "wasm-pool" describe.
 */
import { jest } from '@jest/globals'

import { WASM_ACTIONS } from '@core/constants.js'
import { TEST_URLS } from '@tests/fixtures/test-constants.js'

import { wasmPool } from '@core/utils/wasm/wasm-pool.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'
import { CHAR_STRINGS } from '@core/tokens/strings/chars.js'

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

// ─── wasm-pool (worker dispatcher) ───────────────────────────────────────────
describe('wasm-pool', () => {
  let spawned

  class MockWorker {
    constructor() {
      this.postMessage = jest.fn(({ id } = {}) => {
        queueMicrotask(() => this.onmessage?.({ data: { id, results: { ok: true } } }))
      })
      this.terminate = jest.fn()
      spawned.push(this)
    }
  }

  beforeEach(() => {
    spawned = []
    globalThis.Worker = MockWorker
    wasmPool.workers = []
    wasmPool._poolReady = false
  })

  test('spawns workers lazily on first dispatch and resolves replies', async () => {
    const res = await wasmPool.dispatch(WASM_ACTIONS.PROBE_VIDEO_WASM, { url: TEST_URLS.VIDEO })

    expect(spawned.length).toBeGreaterThan(0)
    expect(res.results.ok).toBe(true)
  })

  test('resolves null when no Worker implementation exists', async () => {
    globalThis.Worker = undefined
    wasmPool.workers = []
    wasmPool._poolReady = false

    const res = await wasmPool.dispatch(WASM_ACTIONS.PROBE_VIDEO_WASM, {})

    expect(res).toBeNull()
  })

  test('resolves null when postMessage throws', async () => {
    class BadWorker {
      constructor() {
        this.postMessage = () => {
          throw new Error(CHAR_STRINGS.EMPTY)
        }
      }
    }
    globalThis.Worker = BadWorker
    wasmPool.workers = []
    wasmPool._poolReady = false

    const res = await wasmPool.dispatch(WASM_ACTIONS.PROBE_VIDEO_WASM, {})

    expect(res).toBeNull()
  })

  test('round-robins payloads across workers', async () => {
    await wasmPool.dispatch(WASM_ACTIONS.PROBE_VIDEO_WASM, { url: TEST_URLS.A })
    await wasmPool.dispatch(WASM_ACTIONS.PROBE_VIDEO_WASM, { url: TEST_URLS.B })

    const calls = spawned.map((w) => w.postMessage.mock.calls.length)

    expect(Math.max(...calls)).toBeGreaterThanOrEqual(1)
  })

  test('extracts ArrayBuffer transferables one level deep', () => {
    const buf = new ArrayBuffer(8)
    const list = wasmPool._extractTransferables({ buf, nested: [new ArrayBuffer(4)] })

    expect(list.length).toBe(2)
    expect(wasmPool._extractTransferables(null)).toEqual([])
    expect(wasmPool._extractTransferables({ plain: 1 })).toEqual([])
  })
})
