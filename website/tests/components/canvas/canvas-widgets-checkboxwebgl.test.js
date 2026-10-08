/**
 * @file canvas-widgets-checkboxwebgl.test.js
 * @description Split from canvas-widgets.test.js — covers the "CheckboxWebGL" describe.
 */
import { describe, test, expect, beforeEach } from '@jest/globals'
import { CheckboxWebGL } from '@earth/space/checkbox-webgl.js'
import { webglPool } from '@core/utils/canvas/webgl-pool.js'
import { attachMock2D, attachNoGL } from '@tests/fixtures/mock-webgl.js'
import store from '@core/store.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { PREF_MUTATIONS } from '@core/tokens/events/mutations.js'

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

// ─── CheckboxWebGL ───────────────────────────────────────────────────────────
describe('CheckboxWebGL', () => {
  test('initialises with a 2D context and draws the unchecked state', () => {
    const canvas = makeCanvas()

    attachMock2D(canvas)

    const box = new CheckboxWebGL(canvas, false)

    expect(box.ctx2d).toBeTruthy()
    expect(box.isChecked).toBe(false)

    box.destroy()
  })

  test('setChecked animates progress toward the target', async () => {
    const canvas = makeCanvas()

    attachMock2D(canvas)

    const box = new CheckboxWebGL(canvas, false)

    box.setChecked(true)

    expect(box.targetP).toBe(1)

    await flushFrames(300)

    box.destroy()
  })

  test('handles a missing 2D context gracefully', () => {
    const canvas = makeCanvas()

    attachNoGL(canvas)

    const box = new CheckboxWebGL(canvas, true)

    expect(box.ctx2d).toBeNull()

    box.destroy()
  })

  test('destroy cancels the animation loop', async () => {
    const canvas = makeCanvas()

    attachMock2D(canvas)

    const box = new CheckboxWebGL(canvas, false)

    box.setChecked(true)
    box.destroy()

    expect(box.animId).toBeNull()
  })

  test('init defaults missing devicePixelRatio and _startLoop is re-entry safe', () => {
    const canvas = makeCanvas()

    attachMock2D(canvas)

    const origDpr = window.devicePixelRatio

    window.devicePixelRatio = 0

    try {
      const box = new CheckboxWebGL(canvas, false)

      box.setChecked(true)
      box._startLoop()
      box._startLoop()

      expect(box.animId).toBeTruthy()

      box.destroy()
    } finally {
      window.devicePixelRatio = origDpr
    }
  })
})
