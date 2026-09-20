// Multi-Threaded WebAssembly Worker Pool Dispatcher
//
// LAZY INITIALISATION: workers are spawned only on the first dispatch() call,
// not at module-evaluation time. This avoids blocking the iOS/Android main
// thread on page load (spawning 6–8 Workers synchronously caused page freezes).
//
// Worker count caps:
//   mobile (iOS / Android)  → max 2 workers
//   desktop                 → max 4 workers

const _isMobile =
  typeof navigator !== 'undefined' &&
  /iPhone|iPad|iPod|Android|Mobile/i.test(navigator.userAgent)

class WasmWorkerPool {
  constructor() {
    const cores = (typeof navigator !== 'undefined' && navigator.hardwareConcurrency) || 2
    this.size = _isMobile ? Math.min(2, cores) : Math.min(4, Math.max(2, cores))
    this.workers = []
    this.nextWorkerIdx = 0
    this.pendingTasks = new Map()
    this.taskIdSeq = 0
    this._poolReady = false
    // Lazy init: do NOT spawn workers here — wait until first dispatch()
  }

  // Spawn workers on first use so module evaluation never blocks the main thread
  _ensurePool() {
    if (this._poolReady) return
    this._poolReady = true

    if (typeof window === 'undefined' || typeof Worker === 'undefined') return

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

  handleMessage(e) {
    const data = e.data || {}
    const { id } = data
    if (id && this.pendingTasks.has(id)) {
      const { resolve } = this.pendingTasks.get(id)
      this.pendingTasks.delete(id)
      resolve(data)
    }
  }

  // Scan payload shallowly for ArrayBuffer / ImageBitmap transferables
  _extractTransferables(payload) {
    const list = []
    if (!payload || typeof payload !== 'object') return list
    const scan = (val) => {
      if (val instanceof ArrayBuffer) { list.push(val); return }
      if (typeof ImageBitmap !== 'undefined' && val instanceof ImageBitmap) { list.push(val); return }
    }
    for (const val of Object.values(payload)) {
      scan(val)
      // One level deep for array items (e.g. batch payloads)
      if (Array.isArray(val)) val.forEach(scan)
    }
    return list
  }

  dispatch(type, payload, transferables = []) {
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

      if (effectiveTransferables.length === 0 && payload !== null && typeof payload === 'object') {
        const autoTransfer = this._extractTransferables(payload)
        if (autoTransfer.length > 0) {
          // Zero-copy transfer for ArrayBuffer / ImageBitmap
          effectiveTransferables = autoTransfer
          safePayload = payload
        } else {
          // structuredClone correctly handles Blobs, Maps, Sets, typed arrays —
          // unlike JSON.parse/JSON.stringify which silently drops Blobs to {}
          try {
            safePayload = structuredClone(payload)
          } catch {
            try {
              safePayload = JSON.parse(JSON.stringify(payload))
            } catch {
              safePayload = payload
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

export const wasmPool = new WasmWorkerPool()
