/**
 * @file utils-deep-coverage-wasmpool.test.js
 * @description Split from utils-deep-coverage.test.js — covers the "wasmPool" describe.
 */
import { describe, test, expect, jest } from '@jest/globals'
import { wasmPool } from '@core/utils/wasm/wasm-pool.js'
import { WASM_POOL } from '@core/tokens/data/wasm.js'

const _flush = (ms = 0) => new Promise((r) => setTimeout(r, ms))

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

  test('a dead worker resolves its pending tasks and is spliced from the pool', async () => {
    const dead = { postMessage: jest.fn(), terminate: jest.fn() }
    const aliveMsgs = []
    const alive = {
      postMessage: (m) => aliveMsgs.push(m),
      terminate: jest.fn(),
    }
    const savedIdx = wasmPool.nextWorkerIdx

    wasmPool.workers.push(dead, alive)
    wasmPool.nextWorkerIdx = 0 // deterministic — first dispatch lands on `dead`

    const pDead = wasmPool.dispatch('T', { a: 1 })
    const pAlive = wasmPool.dispatch('T', { b: 2 })

    // Script parse failure / CSP block surfaces asynchronously as onerror
    // on a real spawn — _dropWorker resolves its tasks and ejects it.
    wasmPool._dropWorker(dead)

    await expect(pDead).resolves.toBe(null)
    expect(dead.terminate).toHaveBeenCalled()
    expect(wasmPool.workers).toEqual([alive])

    // The surviving worker still owns its task — reply resolves normally.
    wasmPool.handleMessage({ data: { id: aliveMsgs[0].id, results: { ok: true } } })
    await expect(pAlive).resolves.toMatchObject({ results: { ok: true } })

    wasmPool.workers.length = 0
    wasmPool.nextWorkerIdx = savedIdx
  })

  test('_dropWorker tolerates a terminate() throw and re-arms an emptied pool', () => {
    const alien = {
      terminate: () => {
        throw new Error('wedged')
      },
    }
    const savedReady = wasmPool._poolReady

    wasmPool.workers.length = 0
    wasmPool._poolReady = true

    // Not in the pool at all → indexOf miss arm + terminate catch arm.
    wasmPool._dropWorker(alien)

    expect(wasmPool._poolReady).toBe(false)

    wasmPool._poolReady = savedReady
  })

  test('a worker that never replies resolves null at the reply deadline', async () => {
    jest.useFakeTimers()

    const silent = { postMessage: jest.fn(), terminate: jest.fn() }

    wasmPool.workers.push(silent)

    const p = wasmPool.dispatch('T', {})

    jest.advanceTimersByTime(WASM_POOL.REPLY_TIMEOUT_MS + 1)

    await expect(p).resolves.toBe(null)
    expect(silent.terminate).toHaveBeenCalled()
    expect(wasmPool.workers).toEqual([])

    wasmPool._poolReady = true
    jest.useRealTimers()
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
