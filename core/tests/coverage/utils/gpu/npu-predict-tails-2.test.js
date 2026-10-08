/**
 * @file npu-predict-tails-2.test.js
 * @description Split from coverage-tails-4.test.js — covers the "npu-predict tails 2" describe.
 */
import { npuPredict } from '@core/utils/gpu/npu-predict.js'

import '@website/components/feedback/CookieBanner.js'
import '@website/components/home/ContactSection.js'
import '@website/views/not-found/NotFound.js'

describe('npu-predict tails 2', () => {
  test('initHardware without WebNN falls through to the GPU tier', async () => {
    delete navigator.ml
    npuPredict.hasNPU = false
    npuPredict.mlContext = null

    await npuPredict.initHardware()

    expect(npuPredict.hasNPU).toBe(false)
  })
})
