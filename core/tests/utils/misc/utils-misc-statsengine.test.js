/**
 * @file utils-misc-statsengine.test.js
 * @description Split from utils-misc.test.js — covers the "statsEngine" describe.
 */
import { describe, test, expect, jest } from '@jest/globals'
import { statsEngine } from '@core/utils/perf/stats-engine.js'

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
