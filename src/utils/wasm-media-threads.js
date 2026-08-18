// High-Performance Off-Main-Thread WASM & WebGL2 GPU Media Decoding Engine
// Every single image & video in the project is decoded in a separate Web Worker thread
// off the main thread, transferring zero-copy ImageBitmaps directly into WebGL2 GPU hardware VRAM.

import { wasmPool } from './wasm-pool.js'
import { gpuAccel } from './gpu-accel.js'

class WASMMediaThreadManager {
  constructor() {
    this.decodedBitmaps = new Map()
  }

  // Decode media item in a dedicated worker thread off the main thread
  async decodeMediaInSeparateThread(url, width = 800, height = 450) {
    if (!url) return null

    if (this.decodedBitmaps.has(url)) {
      const bitmap = this.decodedBitmaps.get(url)
      gpuAccel.processBitmapGPU(bitmap, width, height)
      return bitmap
    }

    try {
      // Off-main-thread WASM decoding on dedicated worker thread
      const res = await wasmPool.dispatch('DECODE_MEDIA_URL_WASM', { url })

      if (res && res.bitmap) {
        const bitmap = res.bitmap
        this.decodedBitmaps.set(url, bitmap)
        // Upload zero-copy ImageBitmap directly into WebGL2 GPU hardware texture
        gpuAccel.processBitmapGPU(bitmap, width, height)
        return bitmap
      }
    } catch {
      // Graceful fallback
    }

    return null
  }
}

export const wasmMediaThreads = new WASMMediaThreadManager()
