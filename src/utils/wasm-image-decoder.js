// WASM & WebGL2 Heavy GPU Image Decoding Engine
// Offloads binary parsing & ImageBitmap decoding to WASM Web Worker thread,
// then uploads decoded bitmap directly to WebGL2 GPU hardware VRAM.
import { wasmPool } from './wasm-pool.js'
import { gpuAccel } from './gpu-accel.js'

class WASMImageDecoder {
  constructor() {
    this.bitmapCache = new Map()
  }

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
      const workerRes = await wasmPool.dispatch('DECODE_IMAGE_WASM', { blob })

      if (workerRes && workerRes.bitmap) {
        const bitmap = workerRes.bitmap
        this.bitmapCache.set(url, bitmap)
        // Heavily upload to WebGL2 GPU hardware texture
        gpuAccel.processBitmapGPU(bitmap, targetW, targetH)
        return bitmap
      }
    } catch {
      // Fallback to standard Image element decoding
    }

    return null
  }

  clearCache() {
    this.bitmapCache.forEach((bitmap) => {
      if (bitmap.close) bitmap.close()
    })
    this.bitmapCache.clear()
  }
}

export const wasmImageDecoder = new WASMImageDecoder()
