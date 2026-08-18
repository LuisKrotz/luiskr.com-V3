// Multi-Threaded WebAssembly Worker Pool Dispatcher
class WasmWorkerPool {
  constructor(
    size = Math.max(2, (typeof navigator !== 'undefined' && navigator.hardwareConcurrency) || 4)
  ) {
    this.size = Math.min(8, size)
    this.workers = []
    this.nextWorkerIdx = 0
    this.pendingTasks = new Map()
    this.taskIdSeq = 0
    this.initPool()
  }

  initPool() {
    if (typeof window === 'undefined' || typeof Worker === 'undefined') return
    for (let i = 0; i < this.size; i++) {
      try {
        const worker = new Worker('/workers/wasm-worker.js')
        worker.onmessage = (e) => this.handleMessage(e)
        this.workers.push(worker)
      } catch {
        // Worker fallback
      }
    }
  }

  handleMessage(e) {
    const { id, results } = e.data
    if (id && this.pendingTasks.has(id)) {
      const { resolve } = this.pendingTasks.get(id)
      this.pendingTasks.delete(id)
      resolve(results)
    }
  }

  dispatch(type, payload, transferables = []) {
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

      let safePayload = payload
      if (transferables.length === 0 && payload !== null && typeof payload === 'object') {
        try {
          safePayload = JSON.parse(JSON.stringify(payload))
        } catch {
          // Fallback if stringify fails
        }
      }

      try {
        if (transferables && transferables.length > 0) {
          worker.postMessage({ id, type, payload: safePayload }, transferables)
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
