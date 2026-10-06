/**
 * @file wasm-pool.ts
 * @description Round-robin dispatcher over a lazily-spawned pool of
 * /workers/wasm-worker.js Web Workers. Payloads are zero-copy when
 * transferables (ArrayBuffer/ImageBitmap) are detected, structuredClone'd
 * otherwise, with a JSON fallback. Resolves null on every failure path so
 * callers can degrade to main-thread behavior without try/catch.
 */
import { TYPE_STRINGS } from '@/core/tokens/strings/types.js'
import { UA_PATTERNS } from '@/core/tokens/motion/gpu.js'

// Multi-Threaded WebAssembly Worker Pool Dispatcher
//
// LAZY INITIALISATION: workers are spawned only on the first dispatch() call,
// not at module-evaluation time. This avoids blocking the iOS/Android main
// thread on page load (spawning 6–8 Workers synchronously caused page freezes).
//
// Worker count caps:
//   mobile (iOS / Android)  → max 2 workers
//   desktop                 → max 4 workers

interface PendingTask {
  resolve: (_data: unknown) => void
}

const _isMobile =
  typeof navigator !== TYPE_STRINGS.UNDEFINED && UA_PATTERNS.MOBILE_UA.test(navigator.userAgent)

/**
 * Round-robin pool of WASM workers — `size` is picked from hardware
 * concurrency (halved on mobile SoCs where thermal throttling makes wide
 * pools slower than narrow ones).
 */
class WasmWorkerPool {
  size: number
  workers: Worker[]
  nextWorkerIdx: number
  pendingTasks: Map<number, PendingTask>
  taskIdSeq: number
  private _poolReady: boolean

  constructor() {
    const cores =
      (typeof navigator !== TYPE_STRINGS.UNDEFINED && navigator.hardwareConcurrency) || 2

    this.size = _isMobile ? Math.min(2, cores) : Math.min(4, Math.max(2, cores))

    this.workers = []

    this.nextWorkerIdx = 0

    this.pendingTasks = new Map()

    this.taskIdSeq = 0

    this._poolReady = false
    // Lazy init: do NOT spawn workers here — wait until first dispatch()
  }

  // Spawn workers on first use so module evaluation never blocks the main thread
  private _ensurePool(): void {
    if (this._poolReady) return

    this._poolReady = true

    if (typeof window === TYPE_STRINGS.UNDEFINED || typeof Worker === TYPE_STRINGS.UNDEFINED) return

    for (let i = 0; i < this.size; i++) {
      try {
        const worker = new Worker('/workers/wasm-worker.js')

        worker.onmessage = (e) => this.handleMessage(e)

        this.workers.push(worker)
      } catch {
        // Worker not available — dispatch() will resolve(null) gracefully
      }
    }
  }

  /** Resolves the pending task matching the worker's reply id. */
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

  // Scan payload shallowly for ArrayBuffer / ImageBitmap transferables
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
 * The wasmPool constant.
 */
export const wasmPool = new WasmWorkerPool()
