/**
 * @file utils-deep-coverage-npupredict.test.js
 * @description Split from utils-deep-coverage.test.js — covers the "npuPredict" describe.
 */
import { describe, test, expect, jest } from '@jest/globals'
import { wasmPool } from '@core/utils/wasm/wasm-pool.js'
import { wasmImageDecoder } from '@core/utils/wasm/wasm-image-decoder.js'
import { npuPredict } from '@core/utils/gpu/npu-predict.js'
import { POINTER_EVENTS } from '@core/tokens/events/dom.js'

const _flush = (ms = 0) => new Promise((r) => setTimeout(r, ms))

// ─── npu-predict.js ──────────────────────────────────────────────────────────
describe('npuPredict', () => {
  test('predicts across all three execution tiers', async () => {
    const origDispatch = wasmPool.dispatch

    npuPredict.hasNPU = true
    npuPredict.mlContext = {}
    npuPredict.hasGPU = false

    const npu = await npuPredict.predictTargetLikelihood('t-npu', null, 400)

    expect(npu.npuAccelerated).toBe(true)
    expect(npu.probability).toBeGreaterThan(0.5)

    npuPredict.hasNPU = false
    npuPredict.mlContext = null
    npuPredict.hasGPU = true

    const gpu = await npuPredict.predictTargetLikelihood('t-gpu', null, 400)

    expect(gpu.gpuAccelerated).toBe(true)

    npuPredict.hasGPU = false
    wasmPool.dispatch = jest.fn(async () => ({ results: { position: 250 } }))

    const wasm = await npuPredict.predictTargetLikelihood('t-wasm', null, 400)

    expect(wasm.probability).toBeGreaterThan(0.2)

    wasmPool.dispatch = jest.fn(async () => ({}))

    const wasm2 = await npuPredict.predictTargetLikelihood('t-wasm2', null, 400)

    expect(wasm2.probability).toBeGreaterThan(0.4)

    // Preloaded targets short-circuit.
    const pre = await npuPredict.predictTargetLikelihood('t-npu')

    expect(pre.preloaded).toBe(true)

    wasmPool.dispatch = origDispatch
    npuPredict.hasNPU = false
  })

  test('prefetch link injection dedupes by target', () => {
    const before = document.head.querySelectorAll('link[rel="prefetch"]').length

    npuPredict.preloadRouteAsset('https://x/route-a')
    npuPredict.preloadRouteAsset('https://x/route-a')

    const links = document.head.querySelectorAll('link[rel="prefetch"]')

    expect(links.length).toBe(before + 1)
    links[links.length - 1].remove()
  })

  test('preloadMediaGPU dedupes and tolerates decode failure', () => {
    const orig = wasmImageDecoder.decodeImageWASM

    wasmImageDecoder.decodeImageWASM = jest.fn(async () => {
      throw new Error('not an image')
    })

    npuPredict.preloadMediaGPU('media-a')
    npuPredict.preloadMediaGPU('media-a')
    npuPredict.preloadMediaGPU(null)

    expect(wasmImageDecoder.decodeImageWASM).toHaveBeenCalledTimes(1)

    wasmImageDecoder.decodeImageWASM = orig
  })

  test('pointer velocity tracking updates on pointermove', () => {
    npuPredict.lastPointer = { x: 0, y: 0, time: Date.now() - 10 }

    window.dispatchEvent(
      new window.PointerEvent(POINTER_EVENTS.POINTERMOVE, { clientX: 100, clientY: 50 })
    )

    expect(npuPredict.pointerVelocity.vx).not.toBe(0)
  })

  test('getNpuAnalytics returns the metrics snapshot', () => {
    const a = npuPredict.getNpuAnalytics()

    expect(a.preloadedCount).toBe(npuPredict.preloadedTargets.size)
    expect(a.totalPredictions).toBeGreaterThan(0)
  })
})
