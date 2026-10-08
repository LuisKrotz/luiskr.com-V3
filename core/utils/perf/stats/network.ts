/**
 * @file stats/network.ts
 * @description Network sampler for the stats engine: a resource-timing
 * PerformanceObserver for transferSize plus a patched window.fetch —
 * transferSize is 0 for cross-origin resources without
 * Timing-Allow-Origin (Firebase, GCS), so fetch is wrapped to count
 * pending requests, estimate bytes from Content-Length/blob size, and
 * measure round-trip latency.
 */

import { TYPE_STRINGS } from '@core/tokens/strings/types.js'
import type { StatsEngine } from '../stats-engine.js'

/** Resource-timing observer + global fetch patch. */
export function startNetworkObserver(engine: StatsEngine): void {
  if (typeof PerformanceObserver !== TYPE_STRINGS.UNDEFINED) {
    try {
      engine._observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          // transferSize > 0 only for same-origin or CORS-permissioned resources
          const bytes = (entry as PerformanceResourceTiming).transferSize || 0

          if (bytes > 0) {
            engine._networkBytesWindow += bytes

            engine._networkBytes += bytes
          }
        }
      })

      engine._observer.observe({ type: 'resource', buffered: false })
    } catch {
      // PerformanceObserver may be blocked in certain environments
    }
  }

  // Patch global fetch to count requests, estimate bytes, and measure latency.
  const win =
    typeof window !== TYPE_STRINGS.UNDEFINED
      ? (window as Window & { __statsEngineFetchPatched?: boolean })
      : null

  if (win && typeof win.fetch === TYPE_STRINGS.FUNCTION && !win.__statsEngineFetchPatched) {
    const origFetch = win.fetch.bind(win)

    win.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
      engine._pendingRequests++

      engine._requestCount = (engine._requestCount || 0) + 1

      const t0 = performance.now()

      try {
        const res = await origFetch(input, init)

        const clone = res.clone()

        // Track latency as round-trip time (time-to-first-byte)
        const elapsed = performance.now() - t0

        engine._latencySamples.push(elapsed)

        if (engine._latencySamples.length > 10) engine._latencySamples.shift()

        // Read Content-Length first (fast, synchronous header check)
        const contentLength = parseInt(res.headers.get('content-length') || '0', 10)

        if (contentLength > 0) {
          engine._networkBytesWindow += contentLength

          engine._networkBytes += contentLength
        } else {
          // No Content-Length: measure body blob size asynchronously
          clone
            .blob()
            .then((b) => {
              if (b.size > 0) {
                engine._networkBytesWindow += b.size

                engine._networkBytes += b.size
              }
            })
            .catch(() => {})
        }

        return res
      } finally {
        engine._pendingRequests = Math.max(0, engine._pendingRequests - 1)
      }
    }

    win.__statsEngineFetchPatched = true
  }
}

/**
 * Long-task CPU observer — measures main-thread blocking time (tasks
 * > 50ms). CPU% = busy_ms / window_ms * 100, clamped to [0, 99] at flush.
 */
export function startLongTaskObserver(engine: StatsEngine): void {
  if (typeof PerformanceObserver === TYPE_STRINGS.UNDEFINED) return

  try {
    engine._longTaskObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        engine._longTaskBusyMs += entry.duration
      }
    })

    engine._longTaskObserver.observe({
      type: 'longtask',
      buffered: false,
    } as PerformanceObserverInit)
  } catch {
    // longtask not supported in all browsers
  }
}
