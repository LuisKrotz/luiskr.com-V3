/**
 * @file stats-engine.ts
 * @description Live performance-metrics collector behind the Stats-for-nerds
 * HUD. Polls FPS via rAF, network traffic via resource-timing entries + a
 * patched window.fetch (cross-origin transferSize is 0), main-thread CPU
 * pressure via longtask entries, JS heap size (Chrome), and rolling fetch
 * latency — flushed to subscribers every INTERVAL_MS on a non-blocking
 * path. Samplers live in stats/{fps,network,flush}.ts.
 */
import { TYPE_STRINGS } from '@/core/tokens/strings/types.js'
import { startFpsLoop } from './stats/fps.js'
import { startLongTaskObserver, startNetworkObserver } from './stats/network.js'
import { startFlushInterval } from './stats/flush.js'

// Stats Engine — singleton that collects live performance metrics off the
// main thread via PerformanceObserver + requestAnimationFrame. All reads are
// non-blocking; the engine never stalls rendering.

/**
 * The StatsSnapshot value.
 */
export interface StatsSnapshot {
  fps: number
  networkBytesPerSec: number
  pendingRequests: number
  memoryMB: number
  cpuPercent: number
  latencyMs: number
}

type StatsObserver = (_snap: StatsSnapshot) => void

/**
 * Metrics engine: starts observers lazily on first subscribe, stops them
 * when the last subscriber leaves (so the hidden HUD costs nothing).
 */
export class StatsEngine {
  _fps = 0
  _frameCount = 0
  _lastFrameTime = performance.now()
  _networkBytes = 0
  _networkBytesPerSec = 0
  _networkBytesWindow = 0
  _networkWindowStart = performance.now()
  _pendingRequests = 0
  _requestCount = 0
  _memoryMB = 0
  // CPU load — estimated from long-task busy time in the flush window
  _cpuPercent = 0
  _longTaskBusyMs = 0
  _longTaskObserver: PerformanceObserver | null = null
  // Latency — rolling average of fetch round-trip times (last 10 requests)
  _latencyMs = 0
  _latencySamples: number[] = []
  _rafId: number | null = null
  _observers = new Set<StatsObserver>()
  _observer: PerformanceObserver | null = null
  _flushId: ReturnType<typeof setInterval> | null = null
  _running = false

  // ── Subscribe/unsubscribe ──────────────────────────────────────────────────
  /** Registers a metrics callback and cold-starts the observers if needed. */
  subscribe(fn: StatsObserver): void {
    this._observers.add(fn)

    if (!this._running) this._start()
  }

  /** Removes a callback; tears down all sampling when the last one leaves. */
  unsubscribe(fn: StatsObserver): void {
    this._observers.delete(fn)

    if (!this._observers.size) this._stop()
  }

  // ── Public snapshot ────────────────────────────────────────────────────────
  /** Point-in-time metrics object the HUD renders (fps, net, cpu, mem, latency). */
  getSnapshot(): StatsSnapshot {
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
  /** Boots all four samplers (FPS loop, network, longtask, flush timer). */
  _start(): void {
    if (this._running || typeof window === TYPE_STRINGS.UNDEFINED) return

    this._running = true

    this._startFpsLoop()

    this._startNetworkObserver()

    this._startLongTaskObserver()

    this._startFlushInterval()
  }

  /** Counts rAF ticks and derives frames/second on a rolling 1s window. */
  _startFpsLoop(): void {
    startFpsLoop(this)
  }

  /** Resource-timing observer + global fetch patch (see stats/network.ts). */
  _startNetworkObserver(): void {
    startNetworkObserver(this)
  }

  /** Long-task CPU observer (see stats/network.ts). */
  _startLongTaskObserver(): void {
    startLongTaskObserver(this)
  }

  /** Aggregating flush interval (see stats/flush.ts). */
  _startFlushInterval(): void {
    startFlushInterval(this)
  }

  /** Cancels the rAF loop, disconnects observers, clears the flush timer. */
  _stop(): void {
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

  // ── Request tracking helpers (call from fetch wrappers if needed) ──────────
  /** Manual in-flight counter increment for non-fetch request paths. */
  trackRequestStart(): void {
    this._pendingRequests++
  }

  /** Manual in-flight counter decrement (floor at 0). */
  trackRequestEnd(): void {
    this._pendingRequests = Math.max(0, this._pendingRequests - 1)
  }
}

/**
 * The statsEngine constant.
 */
export const statsEngine = new StatsEngine()
