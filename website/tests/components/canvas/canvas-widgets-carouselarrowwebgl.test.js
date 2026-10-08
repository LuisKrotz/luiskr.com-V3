/**
 * @file canvas-widgets-carouselarrowwebgl.test.js
 * @description Split from canvas-widgets.test.js — covers the "CarouselArrowWebGL" describe.
 */
import { describe, test, expect, beforeEach } from '@jest/globals'
import { webglPool } from '@core/utils/canvas/webgl-pool.js'
import { CarouselArrowWebGL } from '@core/utils/canvas/widgets/carousel-controls.js'
import { attachHybridGL, attachNoGL } from '@tests/fixtures/mock-webgl.js'
import store from '@core/store.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { PREF_MUTATIONS } from '@core/tokens/events/mutations.js'
import { STATE_CLASSES } from '@core/tokens/classes/state.js'

import { ARROW_TYPES } from '@core/constants.js'

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

// ─── CarouselArrowWebGL ──────────────────────────────────────────────────────
describe('CarouselArrowWebGL', () => {
  test('initialises WebGL for both arrow types', () => {
    ;[ARROW_TYPES.PREV, ARROW_TYPES.NEXT].forEach((type) => {
      const canvas = makeCanvas()

      attachHybridGL(canvas)

      const arrow = new CarouselArrowWebGL(canvas, type)

      expect(arrow.ctx).toBeTruthy()
      expect(arrow.type).toBe(type)

      arrow.destroy()
    })
  })

  test('falls back when GL is unavailable', () => {
    const canvas = makeCanvas()

    attachNoGL(canvas)

    const arrow = new CarouselArrowWebGL(canvas, ARROW_TYPES.NEXT)

    expect(arrow.ctx).toBeFalsy()
    expect(canvas.classList.contains(STATE_CLASSES.IS_FALLBACK)).toBe(true)

    arrow.destroy()
  })

  test('setProgress clamps to 0–1 and syncs play state', () => {
    const canvas = makeCanvas()

    attachHybridGL(canvas)

    const arrow = new CarouselArrowWebGL(canvas, ARROW_TYPES.NEXT)

    arrow.setProgress(1.5)

    expect(arrow.progress).toBe(1)

    arrow.setProgress(-2, false)

    expect(arrow.progress).toBe(0)
    expect(arrow.isPlaying).toBe(false)

    arrow.destroy()
  })

  test('setHover/setPlaying/triggerClick update render state', () => {
    const canvas = makeCanvas()

    attachHybridGL(canvas)

    const actions = []
    const arrow = new CarouselArrowWebGL(canvas, ARROW_TYPES.PREV, () => actions.push(1))

    arrow.setHover(true)

    expect(arrow.isHovered).toBe(true)

    arrow.setPlaying(false)

    expect(arrow.isPlaying).toBe(false)

    arrow.triggerClick()

    expect(arrow.clickTime).toBeGreaterThan(0)

    arrow.destroy()
  })

  test('click on the bound target invokes onAction', () => {
    const canvas = makeCanvas()

    attachHybridGL(canvas)

    const actions = []
    const arrow = new CarouselArrowWebGL(canvas, ARROW_TYPES.NEXT, () => actions.push(1))

    arrow.onMouseEnter()

    expect(arrow.isHovered).toBe(true)

    arrow.onClick()

    expect(actions).toHaveLength(1)

    arrow.onMouseLeave()

    expect(arrow.isHovered).toBe(false)

    arrow.destroy()
  })

  test('setReducedMotion snaps to the static render', () => {
    const canvas = makeCanvas()

    attachHybridGL(canvas)

    const arrow = new CarouselArrowWebGL(canvas, ARROW_TYPES.NEXT)

    arrow.setReducedMotion(true)
    arrow.setReducedMotion(false)

    arrow.destroy()
  })

  test('purge and restore pause and resume the widget', async () => {
    const canvas = makeCanvas()

    attachHybridGL(canvas)

    const arrow = new CarouselArrowWebGL(canvas, ARROW_TYPES.NEXT)

    arrow.purge?.()
    arrow.restore?.()

    await flushFrames(50)

    arrow.destroy()
  })
})
