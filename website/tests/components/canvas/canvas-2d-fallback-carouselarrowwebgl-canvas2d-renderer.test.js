/**
 * @file canvas-2d-fallback-carouselarrowwebgl-canvas2d-renderer.test.js
 * @description Split from canvas-2d-fallback.test.js — covers the "CarouselArrowWebGL — Canvas2D renderer" describe.
 */
import { describe, test, expect, jest, beforeEach } from '@jest/globals'
import { CarouselArrowWebGL } from '@core/utils/canvas/widgets/carousel-controls.js'
import { attachMock2D } from '@tests/fixtures/mock-webgl.js'
import store from '@core/store.js'
import { ARROW_TYPES } from '@core/constants.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { PREF_MUTATIONS } from '@core/tokens/events/mutations.js'
import { STATE_CLASSES } from '@core/tokens/classes/state.js'

const makeCanvas = () => document.createElement(HTML_TAGS.CANVAS)
const flushFrames = (ms = 80) => new Promise((resolve) => setTimeout(resolve, ms))

beforeEach(() => {
  store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, false)
})

// ─── CarouselArrowWebGL 2D path ──────────────────────────────────────────────
describe('CarouselArrowWebGL — Canvas2D renderer', () => {
  test.each([ARROW_TYPES.PREV, ARROW_TYPES.NEXT])(
    'renders %s arrows through the 2D path in every visual state',
    async (type) => {
      const canvas = makeCanvas()

      attachMock2D(canvas)

      const arrow = new CarouselArrowWebGL(canvas, type)

      expect(arrow.ctx).toBeTruthy()

      arrow.setHover(true)
      arrow.setPlaying(true)
      arrow.setProgress(0.4)
      arrow.triggerClick()

      await flushFrames()

      arrow.setHover(false)
      arrow.setPlaying(false)
      arrow.setReducedMotion(true)
      arrow.setReducedMotion(false)

      await flushFrames(40)

      arrow.destroy()
    }
  )

  test('static render + purge/restore run the 2D path', async () => {
    const canvas = makeCanvas()

    attachMock2D(canvas)

    const arrow = new CarouselArrowWebGL(canvas, ARROW_TYPES.PREV)

    arrow._renderStatic()
    arrow.purge?.()
    arrow.restore?.()

    await flushFrames(40)

    arrow.destroy()
  })

  test('default type, missing getContext and throwing getContext all fall back', () => {
    const canvas = makeCanvas()

    attachMock2D(canvas)

    const arrow = new CarouselArrowWebGL(canvas)

    expect(arrow.type).toBe(ARROW_TYPES.NEXT)

    arrow.destroy()

    // canvas-like object without getContext → early fallback return
    const fake = { style: {}, classList: { add: () => {} } }
    const noCtx = new CarouselArrowWebGL(fake)

    expect(noCtx.ctx).toBeUndefined()

    // getContext throwing → catch arm → fallback return
    const throwing = makeCanvas()

    throwing.getContext = () => {
      throw new Error('ctx-dead')
    }

    const arrowThrow = new CarouselArrowWebGL(throwing)

    expect(arrowThrow.ctx).toBeUndefined()
    expect(throwing.classList.contains(STATE_CLASSES.IS_FALLBACK)).toBe(true)

    // getContext returning null → `!this.ctx` guard arm
    const noCtx2 = makeCanvas()

    noCtx2.getContext = () => null

    const arrowNull = new CarouselArrowWebGL(noCtx2)

    expect(arrowNull.ctx).toBeNull()
    expect(noCtx2.classList.contains(STATE_CLASSES.IS_FALLBACK)).toBe(true)
  })

  test('fallback triggered while the rAF loop is live cancels it', async () => {
    const canvas = makeCanvas()

    attachMock2D(canvas)

    const arrow = new CarouselArrowWebGL(canvas)

    await flushFrames(30)

    arrow._triggerFallback()

    expect(canvas.classList.contains(STATE_CLASSES.IS_FALLBACK)).toBe(true)
  })

  test('rect sizing, window-less dpr and parent-target binding arms', () => {
    const canvas = makeCanvas()

    canvas.getBoundingClientRect = () => ({ width: 64 })
    attachMock2D(canvas)
    document.body.appendChild(canvas)

    const arrow = new CarouselArrowWebGL(canvas)

    expect(arrow.width).toBe(64)

    arrow.onMouseEnter()
    arrow.onMouseLeave()
    arrow.onClick()

    arrow.destroy()
    canvas.remove()

    // null rect → 44 fallback; no parentElement → canvas becomes boundTarget
    const orphan = makeCanvas()

    orphan.getBoundingClientRect = () => null
    attachMock2D(orphan)

    const action = jest.fn()
    const orphanArrow = new CarouselArrowWebGL(orphan, ARROW_TYPES.PREV, action)

    expect(orphanArrow.width).toBe(44)
    expect(orphanArrow.boundTarget).toBe(orphan)

    orphanArrow.onClick()

    expect(action).toHaveBeenCalled()

    orphanArrow.destroy()

    // `typeof window === 'undefined'` dpr arm — runtime check inside init()
    const prevWindow = globalThis.window

    delete globalThis.window

    const noWin = makeCanvas()

    attachMock2D(noWin)

    const arrowNoWin = new CarouselArrowWebGL(noWin)

    expect(arrowNoWin.dpr).toBe(1)

    arrowNoWin.destroy()
    globalThis.window = prevWindow

    // `devicePixelRatio || 1` arm — dpr present but falsy
    const prevDpr = window.devicePixelRatio

    window.devicePixelRatio = 0

    const noDpr = makeCanvas()

    attachMock2D(noDpr)

    const arrowNoDpr = new CarouselArrowWebGL(noDpr)

    expect(arrowNoDpr.dpr).toBe(1)

    arrowNoDpr.destroy()
    window.devicePixelRatio = prevDpr
  })

  test('setProgress with isPlaying, click window ripple and hover alpha arms', async () => {
    const canvas = makeCanvas()

    attachMock2D(canvas)

    const arrow = new CarouselArrowWebGL(canvas, ARROW_TYPES.PREV, () => {})

    arrow.setProgress(0.8)
    arrow.setProgress(0.6, true)
    arrow.setProgress(0)
    arrow.setHover(true)
    arrow.hoverLevel = 1
    arrow.triggerClick()
    arrow._renderCanvas2D(performance.now())

    await flushFrames(40)

    // stopped playing + positive progress → regressive drain each frame
    arrow.setPlaying(false)
    arrow._renderCanvas2D(performance.now())

    // fully settled: no ring track arm (isPlaying false, progress ≤ .005)
    arrow.progress = 0
    arrow._renderCanvas2D(performance.now())

    // `this.dpr || 2` arm — dpr cleared before render
    delete arrow.dpr
    arrow._renderCanvas2D(performance.now())

    // ctx cleared — animate/static guards take the no-ctx arm
    arrow.ctx = null
    arrow._renderStatic()

    await flushFrames(40)

    arrow.destroy()
  })

  test('animate early-return arms and purge/restore variants', async () => {
    const canvas = makeCanvas()

    attachMock2D(canvas)

    const arrow = new CarouselArrowWebGL(canvas)

    // purge with a live rAF → cancel arm; purge again → animId-null arm
    await flushFrames(30)
    arrow.purge()
    arrow.purge()

    // restore resumes the loop only when animId is null and ctx exists
    arrow.restore()
    arrow.restore()

    await flushFrames(30)

    // `else if (!this.animId)` arm — resumed via setReducedMotion while paused
    arrow.purge()
    arrow.setReducedMotion(false)

    // paused-gate arm + restart the live loop
    arrow.restore()

    await flushFrames(30)

    // reduced-motion gate inside animate() cancels a pending rAF
    store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, true)

    arrow.animate()

    // same gate with no pending rAF → the animId-null arm
    arrow.animate()

    store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, false)

    arrow.destroy()
  })

  test('destroy releases gl resources and bound listeners', async () => {
    const canvas = makeCanvas()

    attachMock2D(canvas)
    document.body.appendChild(canvas)

    const arrow = new CarouselArrowWebGL(canvas)

    arrow.gl = {
      deleteBuffer: jest.fn(),
      deleteProgram: jest.fn(),
      getExtension: () => ({ loseContext: jest.fn() }),
    }
    arrow.quadBuffer = {}
    arrow.program = {}

    arrow.destroy()

    expect(arrow.gl).toBeNull()

    // gl without getExtension → `?.` short-circuit arm
    const canvas2 = makeCanvas()

    attachMock2D(canvas2)

    const arrow2 = new CarouselArrowWebGL(canvas2)

    arrow2.gl = { getExtension: null }
    arrow2.destroy()

    canvas.remove()
  })
})
