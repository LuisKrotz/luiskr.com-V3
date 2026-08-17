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

  dispatch(type, payload) {
    return new Promise((resolve) => {
      if (!this.workers.length) {
        resolve(null)
        return
      }
      const id = ++this.taskIdSeq
      this.pendingTasks.set(id, { resolve })
      const worker = this.workers[this.nextWorkerIdx]
      this.nextWorkerIdx = (this.nextWorkerIdx + 1) % this.workers.length
      worker.postMessage({ id, type, payload })
    })
  }
}

export const wasmPool = new WasmWorkerPool()
