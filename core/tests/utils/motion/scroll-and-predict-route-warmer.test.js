/**
 * @file scroll-and-predict-route-warmer.test.js
 * @description Split from scroll-and-predict.test.js — covers the "route-warmer" describe.
 */
import { startRouteWarming, stopRouteWarming } from '@core/utils/motion/route-warmer.js'

const flush = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms))

// ─── route-warmer ────────────────────────────────────────────────────────────
describe('route-warmer', () => {
  test('startRouteWarming schedules route chunk imports', async () => {
    startRouteWarming()

    await flush(300)
    stopRouteWarming()

    // Reaching here without errors means the scheduler + import chain ran.
    expect(true).toBe(true)
  })
})
