/**
 * @file stats-engine.ts
 * @description Live performance-metrics collector behind the Stats-for-nerds
 * HUD. Polls FPS via rAF, network traffic via resource-timing entries + a
 * patched window.fetch (cross-origin transferSize is 0), main-thread CPU
 * pressure via longtask entries, JS heap size (Chrome), and rolling fetch
 * latency — flushed to subscribers every INTERVAL_MS on a non-blocking
 * path. Samplers live in stats/{fps,network,flush}.ts.
 */
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'
import { startFpsLoop } from './stats/fps.js'
import { startLongTaskObserver, startNetworkObserver } from './stats/network.js'
import { startFlushInterval } from './stats/flush.js'

// Stats Engine — singleton that collects live performance metrics off the
// main thread via PerformanceObserver + requestAnimationFrame. All reads are
// non-blocking; the engine never stalls rendering.

/** Point-in-time metrics frame pushed to Stats-for-nerds subscribers. */
export interface StatsSnapshot {
  /** Rolling frames-per-second over the last 1s window. */
  fps: number
  /** Rolling network throughput estimate in bytes/sec. */
  networkBytesPerSec: number
  /** Currently in-flight fetches. */
  pendingRequests: number
  /** JS heap size in MB (0 on engines without performance.memory). */
  memoryMB: number
  /** Main-thread busy fraction 0–100 estimated from longtasks. */
  cpuPercent: number
  /** Rolling mean fetch round-trip in ms. */
  latencyMs: number
}

/** Subscriber callback receiving each flushed snapshot. */
type StatsObserver = (_snap: StatsSnapshot) => void

/**
 * Metrics engine: starts observers lazily on first subscribe, stops them
 * when the last subscriber leaves (so the hidden HUD costs nothing).
 */
export class StatsEngine {
  /** Last computed FPS value. */
  _fps = 0
  /** Frames counted in the current rolling window. */
  _frameCount = 0
  /** Window start stamp for the FPS calc. */
  _lastFrameTime = performance.now()
  /** Bytes seen this window from resource-timing entries. */
  _networkBytes = 0
  /** Derived bytes/sec over the window. */
  _networkBytesPerSec = 0
  /** Byte counter for the current window. */
  _networkBytesWindow = 0
  /** Window start stamp for the network calc. */
  _networkWindowStart = performance.now()
  /** In-flight fetch counter (patched window.fetch drives it). */
  _pendingRequests = 0
  /** Lifetime fetch count. */
  _requestCount = 0
  /** Last read JS heap in MB. */
  _memoryMB = 0
  /** CPU load — estimated from long-task busy time in the flush window. */
  _cpuPercent = 0
  /** Accumulated longtask busy ms for the current flush window. */
  _longTaskBusyMs = 0
  /** The 'longtask' PerformanceObserver (null where unsupported). */
  _longTaskObserver: PerformanceObserver | null = null
  /** Latency — rolling average of fetch round-trip times (last 10 requests). */
  _latencyMs = 0
  /** Rolling latency samples feeding _latencyMs. */
  _latencySamples: number[] = []
  /** rAF handle for the FPS loop. */
  _rafId: number | null = null
  /** Subscribed metric callbacks. */
  _observers = new Set<StatsObserver>()
  /** The 'resource' PerformanceObserver (network sampler). */
  _observer: PerformanceObserver | null = null
  /** The aggregating flush setInterval handle. */
  _flushId: ReturnType<typeof setInterval> | null = null
  /** Whether samplers are currently live. */
  _running = false

  // ── Subscribe/unsubscribe ──────────────────────────────────────────────────
  /**
   * Registers a metrics callback and cold-starts the observers if needed —
   * lazy start keeps the engine free until the HUD opens.
   * @param fn Subscriber receiving each StatsSnapshot.
   */
  subscribe(fn: StatsObserver): void {
    this._observers.add(fn)

    if (!this._running) this._start()
  }

  /**
   * Removes a callback; tears down all sampling when the last one leaves
   * so a closed HUD leaves zero observers running.
   * @param fn The callback to remove.
   */
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
 * Shared stats singleton — one engine serves every consumer so observers
 * (rAF loop, PerformanceObservers, fetch patch) exist at most once.
 */
export const statsEngine = new StatsEngine()
