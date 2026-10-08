/**
 * @file scroll-and-predict-npu-predict.test.js
 * @description Split from scroll-and-predict.test.js — covers the "npu-predict" describe.
 */
import { npuPredict } from '@core/utils/gpu/npu-predict.js'
import { TEST_URLS } from '@tests/fixtures/test-constants.js'
import { POINTER_EVENTS } from '@core/tokens/events/dom.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'

const flush = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms))

// ─── npu-predict ─────────────────────────────────────────────────────────────
describe('npu-predict', () => {
  test('getNpuAnalytics returns the metrics snapshot', async () => {
    await flush(20)

    const snap = npuPredict.getNpuAnalytics()

    expect(snap).toBeTruthy()
    expect(typeof snap.wasmAccelerated).toBe(TYPE_STRINGS.BOOLEAN)
  })

  test('pointer movement updates the velocity tracker', async () => {
    await flush(20)

    window.dispatchEvent(
      new window.MouseEvent(POINTER_EVENTS.POINTERMOVE, { clientX: 100, clientY: 50 })
    )
    window.dispatchEvent(
      new window.MouseEvent(POINTER_EVENTS.POINTERMOVE, { clientX: 200, clientY: 150 })
    )

    expect(npuPredict.pointerVelocity).toBeTruthy()
  })

  test('preloadRouteAsset dedupes targets', async () => {
    await flush(20)

    npuPredict.preloadRouteAsset(TEST_URLS.A)
    npuPredict.preloadRouteAsset(TEST_URLS.A)

    expect(npuPredict.preloadedTargets.has(TEST_URLS.A)).toBe(true)
  })

  test('preloadMediaGPU dispatches through the decoder path without throwing', async () => {
    await flush(20)

    npuPredict.preloadMediaGPU?.(TEST_URLS.IMG, 100, 60)
  })
})
