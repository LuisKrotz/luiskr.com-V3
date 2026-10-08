/**
 * @file npu-predict-tails.test.js
 * @description Split from coverage-tails-2.test.js — covers the "npu-predict tails" describe.
 */
import _store from '@core/store.js'

import '@website/components/feedback/CookieBanner.js'

import { npuPredict } from '@core/utils/gpu/npu-predict.js'
import { gpuAccel } from '@core/utils/gpu/gpu-accel.js'

import { TEST_TEXT, TEST_PROJECTS } from '@tests/fixtures/test-constants.js'
import { ROUTE_PATHS } from '@core/tokens/routes/paths.js'
import { POINTER_EVENTS } from '@core/tokens/events/dom.js'

describe('npu-predict tails', () => {
  test('prediction tiers: preloaded, NPU, GPU and WASM fallback', async () => {
    const url = `${ROUTE_PATHS.PORTFOLIO}${TEST_PROJECTS.SAGE}`

    await npuPredict.predictTargetLikelihood(url)
    const again = await npuPredict.predictTargetLikelihood(url)

    expect(again.preloaded === true || again.probability > 0).toBe(true)

    npuPredict.hasNPU = true
    npuPredict.mlContext = {}

    const viaNpu = await npuPredict.predictTargetLikelihood(`${url}-npu`, null, 500)

    expect(viaNpu.probability).toBeGreaterThan(0)

    npuPredict.hasNPU = false
    npuPredict.hasGPU = true

    await npuPredict.predictTargetLikelihood(`${url}-gpu`, null, 10)

    npuPredict.hasGPU = false

    await npuPredict.predictTargetLikelihood(`${url}-wasm`, null, 10)
    await npuPredict.predictTargetLikelihood(null)

    const analytics = npuPredict.getNpuAnalytics()

    expect(analytics.totalPredictions).toBeGreaterThan(0)
  })

  test('initHardware with WebNN present and absent', async () => {
    await npuPredict.initHardware()

    navigator.ml = { createContext: async () => ({}) }
    await npuPredict.initHardware()

    expect(npuPredict.hasNPU).toBe(true)

    navigator.ml = {
      createContext: async () => {
        throw new Error(TEST_TEXT.SECOND)
      },
    }
    npuPredict.hasNPU = false
    await npuPredict.initHardware()

    expect(npuPredict.hasNPU).toBe(false)

    delete navigator.ml
    npuPredict.bindInteractionListeners()
    window.dispatchEvent(new MouseEvent(POINTER_EVENTS.POINTERMOVE, { clientX: 10, clientY: 10 }))
  })

  test('analytics observes a GPU context created after the initial hardware probe', () => {
    const prevGl = gpuAccel.gl
    const prevHasGPU = npuPredict.hasGPU

    gpuAccel.gl = {}
    npuPredict.hasGPU = false

    try {
      expect(npuPredict.gpuAvailable()).toBe(true)
      expect(npuPredict.getNpuAnalytics().hasGPU).toBe(true)
      expect(npuPredict.getNpuAnalytics().gpuAccelerated).toBe(true)
    } finally {
      gpuAccel.gl = prevGl
      npuPredict.hasGPU = prevHasGPU
    }
  })

  test('initHardware is a no-op without window and detects the GPU accel tier', async () => {
    const saved = globalThis.window

    delete globalThis.window

    try {
      await npuPredict.initHardware()
      npuPredict.bindInteractionListeners()
    } finally {
      globalThis.window = saved
    }

    const prevGl = gpuAccel.gl

    gpuAccel.gl = {}
    npuPredict.hasNPU = false
    delete navigator.ml

    try {
      await npuPredict.initHardware()

      expect(npuPredict.hasGPU).toBe(true)
    } finally {
      gpuAccel.gl = prevGl
      npuPredict.hasGPU = false
    }
  })
})
