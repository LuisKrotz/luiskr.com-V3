/**
 * @file starfield/star-boot.test.js
 * @description StarField boot helpers — loader progress mirroring, engine
 * construction + lifecycle wiring (progress/ready/failure), early-return
 * guards, the failed-boot fallback arm and loader dismissal.
 */
import { describe, test, expect, jest, beforeEach, afterEach } from '@jest/globals'

import { SF_CLASSES } from '@core/tokens/classes/starfield.js'
import { STATE_CLASSES } from '@core/tokens/classes/state.js'
import { DEBUG_PARAMS, WEBGL_MODES } from '@core/tokens/strings/debug.js'
import { ANIMATION_DURATIONS } from '@core/tokens/motion/animation.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { dismissStarLoader, initStarFieldEngine, updateStarLoader } from '../../star/boot.js'

const setSearch = (s) => window.history.replaceState(null, '', s)

const flush = (ms = 0) => new Promise((r) => setTimeout(r, ms))

const waitFor = (pred, timeout = 8000) =>
  new Promise((resolve, reject) => {
    const t0 = Date.now()
    const tick = () => {
      if (pred()) return resolve()
      if (Date.now() - t0 > timeout) return reject(new Error('waitFor timeout'))

      setTimeout(tick, 30)
    }
    tick()
  })

const makeHost = (overrides = {}) => {
  const canvas = document.createElement(HTML_TAGS.CANVAS)

  document.body.appendChild(canvas)

  return {
    _engine: null,
    _canvasEl: canvas,
    _isInitializing: false,
    _sfReady: false,
    _sfFailed: false,
    _liveText: '',
    _getCanvasEl: () => canvas,
    $: () => null,
    _updateLoader: jest.fn(),
    _updateDom: jest.fn(),
    _dismissLoader: jest.fn(),
    _selectBody: jest.fn(),
    _handleHover: jest.fn(),
    ...overrides,
  }
}

beforeEach(() => {
  setSearch('/')
  document.documentElement.classList.remove(STATE_CLASSES.REDUCED_MOTION)
})

afterEach(() => {
  setSearch('/')
})

describe('star boot', () => {
  test('updateStarLoader mirrors message, percent and bar width', () => {
    const msg = document.createElement(HTML_TAGS.DIV)
    const val = document.createElement(HTML_TAGS.SPAN)
    const bar = document.createElement(HTML_TAGS.DIV)
    const nodes = {
      [SF_CLASSES.SF_LOADER_MSG]: msg,
      [SF_CLASSES.SF_LOADER_VAL]: val,
      [SF_CLASSES.SF_LOADER_BAR_FILL]: bar,
    }
    const c = { $: (sel) => nodes[sel.slice(1)] ?? null }

    updateStarLoader(c, 'Charting', 42.4)

    expect(msg.textContent).toBe('Charting')
    expect(val.textContent).toBe('42')
    expect(bar.style.width).toBe('42.4%')

    updateStarLoader({ $: () => null }, 'skip', 10)
  })

  test('initStarFieldEngine early-returns without canvas, engine or while busy', () => {
    const noCanvas = makeHost({ _getCanvasEl: () => null })

    initStarFieldEngine(noCanvas)

    expect(noCanvas._engine).toBeNull()

    const hasEngine = makeHost({ _engine: {} })

    initStarFieldEngine(hasEngine)

    const busy = makeHost({ _isInitializing: true })

    initStarFieldEngine(busy)

    expect(busy._engine).toBeNull()
  })

  test('boots the engine and fires onReady → ready + loader dismissed', async () => {
    const c = makeHost()

    initStarFieldEngine(c)

    expect(c._engine).toBeTruthy()
    expect(c._isInitializing).toBe(true)

    await waitFor(() => c._dismissLoader.mock.calls.length > 0)

    expect(c._isInitializing).toBe(false)
    expect(c._sfReady).toBe(true)
    expect(c._sfFailed).toBe(false)

    c._engine.destroy()
  })

  test('progress and hover callbacks reach the host', async () => {
    const c = makeHost()

    initStarFieldEngine(c)
    await waitFor(() => c._dismissLoader.mock.calls.length > 0)

    expect(c._updateLoader).toHaveBeenCalled()

    c._engine.destroy()
  })

  test('webGLMode:fallback marks the host failed and flags the canvas', async () => {
    setSearch(`/?${DEBUG_PARAMS.KEY}=${DEBUG_PARAMS.WEBGL_MODE}:${WEBGL_MODES.FALLBACK}`)

    const c = makeHost()

    initStarFieldEngine(c)
    await waitFor(() => c._dismissLoader.mock.calls.length > 0)

    expect(c._sfFailed).toBe(true)
    expect(c._canvasEl.classList.contains(STATE_CLASSES.IS_FALLBACK)).toBe(true)
    expect(c._updateDom).toHaveBeenCalled()

    c._engine?.destroy()
  })

  test('onSelect routes through the host selection path', async () => {
    const c = makeHost()

    initStarFieldEngine(c)
    await waitFor(() => c._dismissLoader.mock.calls.length > 0)

    c._engine.selectBody('mars')

    expect(c._selectBody).not.toHaveBeenCalled()

    c._engine.destroy()
  })

  test('dismissStarLoader fades then removes the overlay', async () => {
    const loader = document.createElement(HTML_TAGS.DIV)

    document.body.appendChild(loader)

    const c = { $: () => loader }

    dismissStarLoader(c)

    expect(loader.style.opacity).toBe('0')

    await flush(ANIMATION_DURATIONS.LOADER_FADE_MS + 50)

    expect(loader.isConnected).toBe(false)

    expect(() => dismissStarLoader({ $: () => null })).not.toThrow()
  })
})
