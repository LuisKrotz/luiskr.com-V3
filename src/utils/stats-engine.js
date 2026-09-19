// Stats Engine — singleton that collects live performance metrics off the
// main thread via PerformanceObserver + requestAnimationFrame. All reads are
// non-blocking; the engine never stalls rendering.

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
    }
  }

  // ── Lifecycle ──────────────────────────────────────────────────────────────
  _start() {
    if (this._running || typeof window === 'undefined') return
    this._running = true

    this._startFpsLoop()
    this._startNetworkObserver()
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
  _startNetworkObserver() {
    if (typeof PerformanceObserver === 'undefined') return

    try {
      this._observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const bytes = entry.transferSize || 0

          this._networkBytesWindow += bytes
          this._networkBytes += bytes

          if (entry.initiatorType === 'fetch' || entry.initiatorType === 'xmlhttprequest') {
            // Track request duration as a pending counter proxy
            this._pendingRequests = Math.max(0, this._pendingRequests - 1)
          }
        }
      })

      this._observer.observe({ type: 'resource', buffered: false })
    } catch {
      // PerformanceObserver may be blocked in certain environments
    }
  }

  // ── Flush interval ─────────────────────────────────────────────────────────
  // Calculates rolling network bytes/sec and snaps memory, then notifies subscribers.
  _startFlushInterval() {
    this._flushId = setInterval(() => {
      if (!this._running) return

      const now = performance.now()
      const windowSec = (now - this._networkWindowStart) / 1000 || 1

      this._networkBytesPerSec = Math.round(this._networkBytesWindow / windowSec)
      this._networkBytesWindow = 0
      this._networkWindowStart = now

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
