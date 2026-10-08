/**
 * @file canvas-2d-fallback-switchwebgl-canvas2d-fallback.test.js
 * @description Split from canvas-2d-fallback.test.js — covers the "SwitchWebGL — Canvas2D fallback" describe.
 */
import { describe, test, expect, beforeEach } from '@jest/globals'
import { SwitchWebGL } from '@core/utils/canvas/widgets/switch-slider.js'
import { attachMock2D } from '@tests/fixtures/mock-webgl.js'
import store from '@core/store.js'
import { SWITCH_TYPES } from '@core/constants.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { PREF_MUTATIONS } from '@core/tokens/events/mutations.js'

const makeCanvas = () => document.createElement(HTML_TAGS.CANVAS)
const flushFrames = (ms = 80) => new Promise((resolve) => setTimeout(resolve, ms))

beforeEach(() => {
  store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, false)
})

// ─── SwitchWebGL 2D path ─────────────────────────────────────────────────────
describe('SwitchWebGL — Canvas2D fallback', () => {
  test.each([SWITCH_TYPES.STATS, SWITCH_TYPES.GRID, SWITCH_TYPES.MOTION])(
    'renders the %s context through the 2D path',
    async (contextType) => {
      const canvas = makeCanvas()

      attachMock2D(canvas)

      const sw = new SwitchWebGL(canvas, contextType, false)

      expect(sw.useWebGL).toBe(false)
      expect(sw.ctx).toBeTruthy()

      await flushFrames()

      sw.toggle()
      sw.setActive(false)
      sw.setReducedMotion(true)
      sw.setReducedMotion(false)

      await flushFrames(40)

      sw.destroy()
    }
  )

  test('static render under reduced motion uses the 2D renderer', () => {
    const canvas = makeCanvas()

    attachMock2D(canvas)

    const sw = new SwitchWebGL(canvas, SWITCH_TYPES.MOTION, true)

    sw.targetP = 0.25
    sw._renderStatic()

    expect(sw.currentP).toBe(0.25)

    sw.destroy()
  })
})
