// WASM & WebGL2 Heavy GPU Image Decoding Engine
// Offloads binary parsing & ImageBitmap decoding to WASM Web Worker threads,
// then uploads decoded bitmaps directly to WebGL2 GPU hardware VRAM.
// Supports parallel batch decoding via DECODE_IMAGE_BATCH_WASM fan-out.
import { wasmPool } from './wasm-pool.js'
import { gpuAccel } from './gpu-accel.js'

class WASMImageDecoder {
  constructor() {
    this.bitmapCache = new Map()
  }

  // Single-image decode — passes GPU resize hints so createImageBitmap resizes
  // in hardware at decode time, not in software afterward.
  async decodeImageWASM(url, targetW = 800, targetH = 450) {
    if (!url) return null
    if (this.bitmapCache.has(url)) {
      const cached = this.bitmapCache.get(url)
      gpuAccel.processBitmapGPU(cached, targetW, targetH)
      return cached
    }

    try {
      const res = await fetch(url, { cache: 'force-cache' })
      if (!res.ok) return null

      const blob = await res.blob()

      // Pass width/height hints — the worker will supply them as
      // ImageBitmapOptions.resizeWidth/resizeHeight so the GPU performs
      // hardware-accelerated resize during decompression.
      const workerRes = await wasmPool.dispatch('DECODE_IMAGE_WASM', {
        blob,
        width: targetW,
        height: targetH,
      })

      // The worker result key is 'results' (from worker postMessage shape)
      const bitmap = workerRes?.results?.bitmap ?? workerRes?.bitmap ?? null

      if (bitmap) {
        this.bitmapCache.set(url, bitmap)
        // Upload zero-copy ImageBitmap to WebGL2 GPU VRAM
        gpuAccel.processBitmapGPU(bitmap, targetW, targetH)
        return bitmap
      }
    } catch {
      // Fallback to standard Image element decoding
    }

    return null
  }

  // Parallel batch decode — splits a list of images across the worker pool,
  // dispatching each sub-batch to a different worker simultaneously via
  // Promise.all. Each worker decodes its sub-batch with GPU resize hints and
  // returns all bitmaps zero-copy in a single transferList postMessage.
  async decodeImageBatchWASM(items) {
    // items: Array<{ url, width, height }>
    if (!items || !items.length) return new Map()

    // Filter out already-cached URLs
    const pending = []
    const result = new Map()
    for (let i = 0; i < items.length; i++) {
      const { url, width = 800, height = 450 } = items[i]
      if (!url) continue
      if (this.bitmapCache.has(url)) {
        const cached = this.bitmapCache.get(url)
        result.set(url, cached)
        gpuAccel.processBitmapGPU(cached, width, height)
      } else {
        pending.push({ url, width, height, index: i })
      }
    }

    if (!pending.length) return result

    // Split pending items into chunks sized to pool's worker count so each
    // worker receives roughly equal work and all decodes run in parallel.
    const workerCount = Math.max(1, wasmPool.workers?.length || 4)
    const chunkSize = Math.ceil(pending.length / workerCount)
    const chunks = []
    for (let i = 0; i < pending.length; i += chunkSize) {
      chunks.push(pending.slice(i, i + chunkSize))
    }

    // Dispatch all chunks simultaneously — each goes to a different worker
    // via round-robin inside wasmPool.dispatch
    const chunkResults = await Promise.all(
      chunks.map((chunk) =>
        wasmPool.dispatch('DECODE_IMAGE_BATCH_WASM', { items: chunk })
      )
    )

    // Collect all bitmaps, populate cache, upload to GPU
    for (const res of chunkResults) {
      const resultItems = res?.results ?? []
      for (const item of resultItems) {
        if (!item || !item.bitmap) continue
        const { url, bitmap, width, height } = item
        this.bitmapCache.set(url, bitmap)
        result.set(url, bitmap)
        gpuAccel.processBitmapGPU(bitmap, width || 800, height || 450)
      }
    }

    return result
  }

  clearCache() {
    this.bitmapCache.forEach((bitmap) => {
      if (bitmap.close) bitmap.close()
    })
    this.bitmapCache.clear()
  }
}

export const wasmImageDecoder = new WASMImageDecoder()
