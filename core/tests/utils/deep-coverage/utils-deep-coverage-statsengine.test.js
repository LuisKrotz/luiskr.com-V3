/**
 * @file utils-deep-coverage-statsengine.test.js
 * @description Split from utils-deep-coverage.test.js — covers the "statsEngine" describe.
 */
import { describe, test, expect, jest } from '@jest/globals'
import { statsEngine } from '@core/utils/perf/stats-engine.js'

const flush = (ms = 0) => new Promise((r) => setTimeout(r, ms))

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
