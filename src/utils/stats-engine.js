// Stats Engine — singleton that collects live performance metrics off the
// main thread via PerformanceObserver + requestAnimationFrame. All reads are
// non-blocking; the engine never stalls rendering.

import { STRINGS } from '../core/constants.js'

const INTERVAL_MS = 500

class StatsEngine {
  constructor() {
    this._fps = 0
    this._frameCount = 0
    this._lastFrameTime = performance.now()
    this._networkBytes = 0
    this._networkBytesPerSec = 0
    this._networkBytesWindow = 0
    this._networkWindowStart = performance.now()
    this._pendingRequests = 0
    this._memoryMB = 0
    // CPU load — estimated from long-task busy time in the flush window
    this._cpuPercent = 0
    this._longTaskBusyMs = 0
    this._longTaskObserver = null
    // Latency — rolling average of fetch round-trip times (last 10 requests)
    this._latencyMs = 0
    this._latencySamples = []
    this._rafId = null
    this._observers = new Set()
    this._observer = null
    this._running = false
  }

  // ── Subscribe/unsubscribe ──────────────────────────────────────────────────
  subscribe(fn) {
    this._observers.add(fn)

    if (!this._running) this._start()
  }

  unsubscribe(fn) {
    this._observers.delete(fn)

    if (!this._observers.size) this._stop()
  }

  // ── Public snapshot ────────────────────────────────────────────────────────
  getSnapshot() {
    return {
      fps: this._fps,
      networkBytesPerSec: this._networkBytesPerSec,
      pendingRequests: this._pendingRequests,
      memoryMB: this._memoryMB,
      cpuPercent: this._cpuPercent,
      latencyMs: this._latencyMs,
    }
  }

  // ── Lifecycle ──────────────────────────────────────────────────────────────
  _start() {
    if (this._running || typeof window === STRINGS.UNDEFINED) return
    this._running = true

    this._startFpsLoop()
    this._startNetworkObserver()
    this._startLongTaskObserver()
    this._startFlushInterval()
  }

  _stop() {
    this._running = false

    if (this._rafId != null) {
      cancelAnimationFrame(this._rafId)
      this._rafId = null
    }

    if (this._observer) {
      this._observer.disconnect()
      this._observer = null
    }

    if (this._longTaskObserver) {
      this._longTaskObserver.disconnect()
      this._longTaskObserver = null
    }

    if (this._flushId != null) {
      clearInterval(this._flushId)
      this._flushId = null
    }
  }

  // ── FPS counter ────────────────────────────────────────────────────────────
  _startFpsLoop() {
    const tick = (now) => {
      if (!this._running) return

      this._frameCount++
      const elapsed = now - this._lastFrameTime

      if (elapsed >= 1000) {
        this._fps = Math.round((this._frameCount * 1000) / elapsed)
        this._frameCount = 0
        this._lastFrameTime = now
      }

      this._rafId = requestAnimationFrame(tick)
    }

    this._rafId = requestAnimationFrame(tick)
  }

  // ── Network observer ───────────────────────────────────────────────────────
  // transferSize is 0 for cross-origin resources without Timing-Allow-Origin
  // (Firebase, GCS). We patch global fetch to measure actual byte traffic.
  _startNetworkObserver() {
    if (typeof PerformanceObserver !== STRINGS.UNDEFINED) {
      try {
        this._observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            // transferSize > 0 only for same-origin or CORS-permissioned resources
            const bytes = entry.transferSize || 0

            if (bytes > 0) {
              this._networkBytesWindow += bytes
              this._networkBytes += bytes
            }
          }
        })
        this._observer.observe({ type: 'resource', buffered: false })
      } catch {
        // PerformanceObserver may be blocked in certain environments
      }
    }

    // Patch global fetch to count requests, estimate bytes, and measure latency.
    if (typeof window !== STRINGS.UNDEFINED && typeof window.fetch === STRINGS.FUNCTION && !window.__statsEngineFetchPatched) {
      const origFetch = window.fetch.bind(window)

      window.fetch = async (input, init) => {
        this._pendingRequests++
        this._requestCount = (this._requestCount || 0) + 1

        const t0 = performance.now()

        try {
          const res = await origFetch(input, init)
          const clone = res.clone()

          // Track latency as round-trip time (time-to-first-byte)
          const elapsed = performance.now() - t0
          this._latencySamples.push(elapsed)
          if (this._latencySamples.length > 10) this._latencySamples.shift()

          // Read Content-Length first (fast, synchronous header check)
          const contentLength = parseInt(res.headers.get('content-length') || '0', 10)

          if (contentLength > 0) {
            this._networkBytesWindow += contentLength
            this._networkBytes += contentLength
          } else {
            // No Content-Length: measure body blob size asynchronously
            clone.blob().then((b) => {
              if (b.size > 0) {
                this._networkBytesWindow += b.size
                this._networkBytes += b.size
              }
            }).catch(() => {})
          }

          return res
        } finally {
          this._pendingRequests = Math.max(0, this._pendingRequests - 1)
        }
      }

      window.__statsEngineFetchPatched = true
    }
  }

  // ── Long-task CPU observer ──────────────────────────────────────────────────
  // Measures main-thread blocking time (tasks > 50ms) via PerformanceObserver.
  // CPU% = busy_ms / window_ms * 100, clamped to [0, 99].
  _startLongTaskObserver() {
    if (typeof PerformanceObserver === STRINGS.UNDEFINED) return

    try {
      this._longTaskObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this._longTaskBusyMs += entry.duration
        }
      })

      this._longTaskObserver.observe({ type: 'longtask', buffered: false })
    } catch {
      // longtask not supported in all browsers
    }
  }

  // ── Flush interval ─────────────────────────────────────────────────────────
  // Calculates rolling network bytes/sec, snaps memory, CPU %, and latency.
  _startFlushInterval() {
    this._flushId = setInterval(() => {
      if (!this._running) return

      const now = performance.now()
      const windowSec = (now - this._networkWindowStart) / 1000 || 1

      this._networkBytesPerSec = Math.round(this._networkBytesWindow / windowSec)
      this._networkBytesWindow = 0
      this._networkWindowStart = now

      // CPU% from long-task busy time in last INTERVAL_MS window
      const busyRatio = this._longTaskBusyMs / INTERVAL_MS
      this._cpuPercent = Math.min(99, Math.round(busyRatio * 100))
      this._longTaskBusyMs = 0

      // Rolling latency average (last 10 samples)
      if (this._latencySamples.length > 0) {
        const sum = this._latencySamples.reduce((a, b) => a + b, 0)
        this._latencyMs = Math.round(sum / this._latencySamples.length)
        this._latencySamples = []
      }

      // Memory (Chrome only)
      if (performance.memory) {
        this._memoryMB = Math.round(performance.memory.usedJSHeapSize / 1_048_576)
      }

      const snap = this.getSnapshot()

      this._observers.forEach((fn) => fn(snap))
    }, INTERVAL_MS)
  }

  // ── Request tracking helpers (call from fetch wrappers if needed) ──────────
  trackRequestStart() {
    this._pendingRequests++
  }

  trackRequestEnd() {
    this._pendingRequests = Math.max(0, this._pendingRequests - 1)
  }
}

export const statsEngine = new StatsEngine()
