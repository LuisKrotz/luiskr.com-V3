/**
 * @file stats/flush.ts
 * @description Flush interval for the stats engine: every INTERVAL_MS it
 * calculates rolling network bytes/sec, snaps memory (Chrome-only
 * performance.memory), CPU % from long-task busy time, and the rolling
 * fetch latency average — then pushes the snapshot to subscribers.
 */

import type { StatsEngine } from '../stats-engine.js'

/**
 * The INTERVAL_MS constant.
 */
export const INTERVAL_MS = 500

/** Chrome-only `performance.memory` extension. */
interface PerformanceWithMemory extends Performance {
  memory?: { usedJSHeapSize: number; totalJSHeapSize: number; jsHeapSizeLimit: number }
}

/** Starts the interval that aggregates samples and notifies subscribers. */
export function startFlushInterval(engine: StatsEngine): void {
  engine._flushId = setInterval(() => {
    if (!engine._running) return

    const now = performance.now()

    const windowSec = (now - engine._networkWindowStart) / 1000 || 1

    engine._networkBytesPerSec = Math.round(engine._networkBytesWindow / windowSec)

    engine._networkBytesWindow = 0

    engine._networkWindowStart = now

    // CPU% from long-task busy time in last INTERVAL_MS window
    const busyRatio = engine._longTaskBusyMs / INTERVAL_MS

    engine._cpuPercent = Math.min(99, Math.round(busyRatio * 100))

    engine._longTaskBusyMs = 0

    // Rolling latency average (last 10 samples)
    if (engine._latencySamples.length > 0) {
      const sum = engine._latencySamples.reduce((a, b) => a + b, 0)

      engine._latencyMs = Math.round(sum / engine._latencySamples.length)

      engine._latencySamples = []
    }

    // Memory (Chrome only)
    const memory = (performance as PerformanceWithMemory).memory

    if (memory) {
      engine._memoryMB = Math.round(memory.usedJSHeapSize / 1_048_576)
    }

    const snap = engine.getSnapshot()

    engine._observers.forEach((fn) => fn(snap))
  }, INTERVAL_MS)
}
