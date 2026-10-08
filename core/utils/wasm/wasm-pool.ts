/**
 * @file wasm-pool.ts
 * @description Round-robin dispatcher over a lazily-spawned pool of
 * /workers/wasm-worker.js Web Workers. Payloads are zero-copy when
 * transferables (ArrayBuffer/ImageBitmap) are detected, structuredClone'd
 * otherwise, with a JSON fallback. Resolves null on every failure path so
 * callers can degrade to main-thread behavior without try/catch.
 */
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'
import { UA_PATTERNS } from '@core/tokens/motion/gpu.js'
import { WASM_POOL } from '@core/tokens/data/wasm.js'

// Multi-Threaded WebAssembly Worker Pool Dispatcher
//
// LAZY INITIALISATION: workers are spawned only on the first dispatch() call,
// not at module-evaluation time. This avoids blocking the iOS/Android main
// thread on page load (spawning 6–8 Workers synchronously caused page freezes).
//
// Worker count caps:
//   mobile (iOS / Android)  → max 2 workers
//   desktop                 → max 4 workers

/** In-flight dispatch entry — the resolve that completes the caller's Promise. */
interface PendingTask {
  resolve: (_data: unknown) => void
}

/** Coarse mobile detection — UA regex suffices here; precision isn't worth the parser. */
const _isMobile =
  typeof navigator !== TYPE_STRINGS.UNDEFINED && UA_PATTERNS.MOBILE_UA.test(navigator.userAgent)

/**
 * Round-robin pool of WASM workers — `size` is picked from hardware
 * concurrency (halved on mobile SoCs where thermal throttling makes wide
 * pools slower than narrow ones).
 */
class WasmWorkerPool {
  /** Pool width — clamped cores (mobile ≤2, desktop 2–4). */
  size: number
  /** Spawned Worker instances — populated lazily by _ensurePool. */
  workers: Worker[]
  /** Round-robin cursor into `workers`. */
  nextWorkerIdx: number
  /** Dispatch id → pending resolver. */
  pendingTasks: Map<number, PendingTask>
  /** Monotonically increasing dispatch id — correlates replies to tasks. */
  taskIdSeq: number
  /** One-shot latch so _ensurePool spawns at most once. */
  private _poolReady: boolean

  constructor() {
    const cores =
      (typeof navigator !== TYPE_STRINGS.UNDEFINED && navigator.hardwareConcurrency) ||
      WASM_POOL.FALLBACK_CORES

    this.size = _isMobile
      ? Math.min(WASM_POOL.MOBILE_MAX, cores)
      : Math.min(WASM_POOL.DESKTOP_MAX, Math.max(WASM_POOL.DESKTOP_MIN, cores))

    this.workers = []

    this.nextWorkerIdx = 0

    this.pendingTasks = new Map()

    this.taskIdSeq = 0

    this._poolReady = false
    // Lazy init: do NOT spawn workers here — wait until first dispatch()
  }

  /**
   * Lazily spawns `size` workers on first dispatch — module eval stays
   * free of Worker construction (mobile page-load freeze fix). SSR /
   * no-Worker engines leave the pool empty; dispatch then resolves null.
   */
  private _ensurePool(): void {
    if (this._poolReady) return

    this._poolReady = true

    if (typeof window === TYPE_STRINGS.UNDEFINED || typeof Worker === TYPE_STRINGS.UNDEFINED) return

    for (let i = 0; i < this.size; i++) {
      try {
        const worker = new Worker(WASM_POOL.WORKER_URL)

        worker.onmessage = (e) => this.handleMessage(e)

        this.workers.push(worker)
      } catch {
        // Worker not available — dispatch() will resolve(null) gracefully
      }
    }
  }

  /**
   * Worker `message` handler — resolves the pending task matching the
   * reply's correlation id and drops it from the map. Replies without an
   * id are ignored (broadcast/telemetry messages).
   * @param e The worker MessageEvent.
   */
  handleMessage(e: MessageEvent): void {
    const data = (e.data || {}) as { id?: number }

    const id = data.id

    if (id) {
      const task = this.pendingTasks.get(id)

      if (task) {
        this.pendingTasks.delete(id)

        task.resolve(data)
      }
    }
  }

  /**
   * Scans a payload shallowly (top-level values + one array level deep)
   * for ArrayBuffer / ImageBitmap instances — those can cross the worker
   * boundary by ownership transfer instead of structured-clone copy, so
   * large media payloads move zero-copy.
   * @param payload The dispatch payload object.
   * @returns Transferable instances found.
   */
  private _extractTransferables(payload: unknown): Transferable[] {
    const list: Transferable[] = []

    if (!payload || typeof payload !== TYPE_STRINGS.OBJECT) return list

    const scan = (val: unknown) => {
      if (val instanceof ArrayBuffer) {
        list.push(val)
        return
      }

      if (typeof ImageBitmap !== TYPE_STRINGS.UNDEFINED && val instanceof ImageBitmap) {
        list.push(val)
      }
    }

    for (const val of Object.values(payload as Record<string, unknown>)) {
      scan(val)

      // One level deep for array items (e.g. batch payloads)
      if (Array.isArray(val)) val.forEach(scan)
    }

    return list
  }

  /**
   * Posts { id, type, payload } to the next worker in round-robin order.
   * Serializes the payload safely (zero-copy transferables → structuredClone
   * → JSON fallback) and resolves the worker's reply — or null when no
   * worker exists or posting throws.
   * @param type WASM_ACTIONS message type the worker dispatches on.
   * @param payload Serializable body — transferables are auto-extracted.
   * @param transferables Explicit transfer list; auto-scan only runs when empty.
   * @returns The worker's reply message data, or null on any failure.
   */
  dispatch(type: string, payload: unknown, transferables: Transferable[] = []): Promise<unknown> {
    // Lazy-spawn workers on first call — never during module evaluation
    this._ensurePool()

    return new Promise((resolve) => {
      if (!this.workers.length) {
        resolve(null)

        return
      }

      const id = ++this.taskIdSeq

      this.pendingTasks.set(id, { resolve })

      // Round-robin load balance across multi-threaded WASM workers
      const worker = this.workers[this.nextWorkerIdx]

      this.nextWorkerIdx = (this.nextWorkerIdx + 1) % this.workers.length

      // Determine transferables and serialization strategy
      let safePayload = payload

      let effectiveTransferables = transferables

      if (
        effectiveTransferables.length === 0 &&
        payload !== null &&
        typeof payload === TYPE_STRINGS.OBJECT
      ) {
        const autoTransfer = this._extractTransferables(payload)

        if (autoTransfer.length > 0) {
          // Zero-copy transfer for ArrayBuffer / ImageBitmap
          effectiveTransferables = autoTransfer
        } else {
          // structuredClone correctly handles Blobs, Maps, Sets, typed arrays —
          // unlike JSON.parse/JSON.stringify which silently drops Blobs to {}
          try {
            safePayload = structuredClone(payload)
          } catch {
            try {
              safePayload = JSON.parse(JSON.stringify(payload))
            } catch {
              // Payload survives as-is; postMessage may still clone it.
            }
          }
        }
      }

      try {
        if (effectiveTransferables && effectiveTransferables.length > 0) {
          worker.postMessage({ id, type, payload: safePayload }, effectiveTransferables)
        } else {
          worker.postMessage({ id, type, payload: safePayload })
        }
      } catch {
        this.pendingTasks.delete(id)

        resolve(null)
      }
    })
  }
}

/**
 * Shared pool singleton — all WASM dispatch callers funnel through one
 * instance so workers are spawned once and round-robin state is global.
 */
export const wasmPool = new WasmWorkerPool()
