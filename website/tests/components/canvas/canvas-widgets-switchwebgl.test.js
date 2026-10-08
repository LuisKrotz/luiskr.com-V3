/**
 * @file canvas-widgets-switchwebgl.test.js
 * @description Split from canvas-widgets.test.js — covers the "SwitchWebGL" describe.
 */
import { describe, test, expect, beforeEach } from '@jest/globals'
import { SwitchWebGL } from '@core/utils/canvas/widgets/switch-slider.js'
import { webglPool } from '@core/utils/canvas/webgl-pool.js'
import { attachMockGL, attachNoGL } from '@tests/fixtures/mock-webgl.js'
import store from '@core/store.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { PREF_MUTATIONS } from '@core/tokens/events/mutations.js'

import { SWITCH_TYPES } from '@core/constants.js'

const makeCanvas = () => document.createElement(HTML_TAGS.CANVAS)

const flushFrames = (ms = 80) => new Promise((resolve) => setTimeout(resolve, ms))

const _WebGLPoolManager = webglPool.constructor

const _makeRectCanvas = (width = 300) => {
  const canvas = makeCanvas()

  canvas.getBoundingClientRect = () => ({ left: 0, top: 0, width, height: 64 })

  return canvas
}

beforeEach(() => {
  store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, false)
})

// ─── SwitchWebGL ─────────────────────────────────────────────────────────────
describe('SwitchWebGL', () => {
  test('initialises WebGL for every context type', () => {
    ;[SWITCH_TYPES.STATS, SWITCH_TYPES.GRID, SWITCH_TYPES.MOTION, SWITCH_TYPES.CYAN].forEach(
      (ctx) => {
        const canvas = makeCanvas()

        attachMockGL(canvas)

        const sw = new SwitchWebGL(canvas, ctx, false)

        expect(sw.useWebGL).toBe(true)

        sw.destroy()
      }
    )
  })

  test('context code maps each context type to a shader constant', () => {
    const canvas = makeCanvas()

    attachMockGL(canvas)

    expect(new SwitchWebGL(makeCanvasWithGL(), SWITCH_TYPES.STATS)._contextCode()).toBe(0.0)
    expect(new SwitchWebGL(makeCanvasWithGL(), SWITCH_TYPES.GRID)._contextCode()).toBe(1.0)
    expect(new SwitchWebGL(makeCanvasWithGL(), SWITCH_TYPES.MOTION)._contextCode()).toBe(2.0)

    function makeCanvasWithGL() {
      const c = makeCanvas()

      attachMockGL(c)

      return c
    }
  })

  test('toggle flips state and invokes the callback', () => {
    const canvas = makeCanvas()

    attachMockGL(canvas)

    const toggles = []
    const sw = new SwitchWebGL(canvas, SWITCH_TYPES.STATS, false, () => toggles.push(1))

    sw.toggle()

    expect(sw.isActive).toBe(true)
    expect(toggles).toHaveLength(1)

    sw.toggle()

    expect(sw.isActive).toBe(false)

    sw.destroy()
  })

  test('setActive animates toward the new state', async () => {
    const canvas = makeCanvas()

    attachMockGL(canvas)

    const sw = new SwitchWebGL(canvas, SWITCH_TYPES.GRID, false)

    sw.setActive(true)

    expect(sw.targetP).toBe(1)

    await flushFrames()

    sw.destroy()
  })

  test('setReducedMotion renders statically without a rAF loop', () => {
    const canvas = makeCanvas()

    attachMockGL(canvas)

    const sw = new SwitchWebGL(canvas, SWITCH_TYPES.MOTION, true)

    sw.targetP = 0.4
    sw.setReducedMotion(true)

    // Static render snaps the position immediately instead of animating.
    expect(sw.currentP).toBe(0.4)

    sw.destroy()
  })

  test('falls back to the CSS class when GL is unavailable', () => {
    const canvas = makeCanvas()

    attachNoGL(canvas)

    const sw = new SwitchWebGL(canvas, SWITCH_TYPES.STATS, false)

    expect(sw.useWebGL).toBe(false)

    sw.destroy()
  })
})
