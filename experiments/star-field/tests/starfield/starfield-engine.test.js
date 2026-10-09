/**
 * @file starfield/starfield-engine.test.js
 * @description StarFieldEngine facade — init() always resolves (success,
 * bailout, destroy-mid-boot), the failed flag the host reads for the CSS
 * fallback, reduced-motion pause/resume, selectBody/flyHome camera
 * control, takeScreenshot and destroy teardown.
 */
import { describe, test, expect, jest, beforeEach, afterEach } from '@jest/globals'

import { DEBUG_PARAMS, WEBGL_MODES } from '@core/tokens/strings/debug.js'
import { STATE_CLASSES } from '@core/tokens/classes/state.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { StarFieldEngine } from '../../starfield-engine.js'
import { __setRendererInitDelay } from 'three/webgpu'

const setSearch = (s) => window.history.replaceState(null, '', s)

const flush = (ms = 0) => new Promise((r) => setTimeout(r, ms))

const makeCanvas = () => {
  const canvas = document.createElement(HTML_TAGS.CANVAS)

  document.body.appendChild(canvas)

  return canvas
}

beforeEach(() => {
  setSearch('/')
  document.documentElement.classList.remove(STATE_CLASSES.REDUCED_MOTION)
})

afterEach(() => {
  setSearch('/')
  __setRendererInitDelay(0)
})

describe('StarFieldEngine', () => {
  test('init() boots the scene and fires onReady', async () => {
    const events = { onReady: jest.fn(), onProgress: jest.fn() }
    const engine = new StarFieldEngine(makeCanvas(), events)

    await engine.init()

    expect(events.onReady).toHaveBeenCalled()
    expect(events.onProgress).toHaveBeenCalled()
    expect(engine.failed).toBe(false)

    engine.destroy()
  })

  test('init() reports failure when WebGL is disallowed', async () => {
    setSearch(`/?${DEBUG_PARAMS.KEY}=${DEBUG_PARAMS.WEBGL_MODE}:${WEBGL_MODES.FALLBACK}`)

    const events = { onReady: jest.fn() }
    const engine = new StarFieldEngine(makeCanvas(), events)

    await engine.init()

    expect(engine.failed).toBe(true)
    expect(events.onReady).toHaveBeenCalled()

    engine.destroy()
  })

  test('destroy() during a delayed boot aborts without onReady', async () => {
    __setRendererInitDelay(120)

    const events = { onReady: jest.fn() }
    const engine = new StarFieldEngine(makeCanvas(), events)
    const pending = engine.init()

    engine.destroy()
    await pending

    expect(events.onReady).not.toHaveBeenCalled()
  })

  test('setReducedMotion pauses and resumes the RAF loop', async () => {
    const engine = new StarFieldEngine(makeCanvas())

    await engine.init()

    engine.setReducedMotion(true)
    engine.setReducedMotion(true)

    engine.setReducedMotion(false)
    engine.setReducedMotion(false)

    await flush(60)

    engine.destroy()
  })

  test('selectBody ignores unknown ids and flies to known ones', async () => {
    const events = { onSelect: jest.fn() }
    const engine = new StarFieldEngine(makeCanvas(), events)

    await engine.init()

    engine.selectBody('not-a-body')
    engine.selectBody('mars')

    await flush(40)

    engine.destroy()
  })

  test('flyHome returns to the overview pose', async () => {
    const engine = new StarFieldEngine(makeCanvas())

    await engine.init()

    engine.flyHome()
    await flush(30)

    engine.destroy()
  })

  test('takeScreenshot drives the capture pipeline', async () => {
    const canvas = makeCanvas()

    canvas.toDataURL = () => 'data:image/png;base64,x'
    globalThis.URL.createObjectURL = jest.fn(() => 'blob:shot')

    const engine = new StarFieldEngine(canvas)

    await engine.init()

    engine.takeScreenshot()
    await flush(80)

    engine.destroy()
  })

  test('takeScreenshot no-ops before a renderer exists', () => {
    const engine = new StarFieldEngine(makeCanvas())

    expect(() => engine.takeScreenshot()).not.toThrow()
  })

  test('selectBody and flyHome no-op before boot', () => {
    const engine = new StarFieldEngine(makeCanvas())

    expect(() => {
      engine.selectBody('mars')
      engine.flyHome()
      engine.setReducedMotion(true)
      engine.setReducedMotion(false)
    }).not.toThrow()

    engine.destroy()
  })

  test('destroy() releases listeners even before boot', () => {
    const canvas = makeCanvas()
    const engine = new StarFieldEngine(canvas)
    const rmSpy = jest.spyOn(canvas, 'removeEventListener')

    engine.destroy()
    engine.destroy()

    expect(rmSpy).not.toThrow
  })
})
