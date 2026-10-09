/**
 * @file coverage/starfield/star/star-boot-tails.test.js
 * @description Coverage tails for star/boot.ts — the engine-event wiring
 * arms the real engine can't reach under test: every event arrow firing
 * (progress/select/approach/hover), the onReady body on success and on
 * failed boot (fallback class + re-render), and the init() rejection
 * catch path. StarFieldEngine is mocked so init() resolves/rejects on cue.
 */
import { describe, test, expect, jest, beforeEach } from '@jest/globals'

import { STATE_CLASSES } from '@core/tokens/classes/state.js'

const mockCtl = { failInit: false, failed: false, events: null, destroyed: false, reduced: null }

jest.unstable_mockModule('../../../../starfield-engine.js', () => ({
  StarFieldEngine: class MockStarFieldEngine {
    constructor(canvas, events) {
      mockCtl.events = events
      this.canvas = canvas
    }

    init() {
      const ev = mockCtl.events

      if (mockCtl.failInit) return Promise.reject(new Error('boot-fail'))

      ev.onProgress('mock-stage', 42)
      ev.onHover('mars')
      ev.onHover(null)
      ev.onSelect('earth')
      ev.onApproach('moon')
      ev.onReady()

      return Promise.resolve()
    }

    selectBody() {}
    flyHome() {}
    takeScreenshot() {}
    setReducedMotion(v) {
      mockCtl.reduced = v
    }

    destroy() {
      mockCtl.destroyed = true
    }

    get failed() {
      return mockCtl.failed
    }
  },
}))

const { initStarFieldEngine, updateStarLoader, dismissStarLoader } = await import(
  '../../../../star/boot.js'
)

const makeHost = (overrides = {}) => {
  const c = {
    _canvasEl: null,
    _engine: null,
    _isInitializing: false,
    _sfReady: false,
    _sfFailed: false,
    _selectedId: null,
    _dossierLoading: false,
    _liveText: '',
    _navOpen: false,
    _getCanvasEl: jest.fn(() => null),
    _updateLoader: jest.fn(),
    _selectBody: jest.fn(),
    _handleHover: jest.fn(),
    _updateDom: jest.fn(),
    _dismissLoader: jest.fn(),
    $: jest.fn(() => null),
  }

  return Object.assign(c, overrides)
}

beforeEach(() => {
  mockCtl.failInit = false
  mockCtl.failed = false
  mockCtl.events = null
  mockCtl.destroyed = false
  mockCtl.reduced = null
})

describe('star boot tails', () => {
  test('init() success fires every wired event into the host', async () => {
    const c = makeHost({ _getCanvasEl: jest.fn(() => ({})) })

    initStarFieldEngine(c)
    await Promise.resolve()

    expect(c._engine).toBeTruthy()
    expect(c._isInitializing).toBe(false)
    expect(c._sfReady).toBe(true)
    expect(c._sfFailed).toBe(false)
    expect(c._updateLoader).toHaveBeenCalledWith('mock-stage', 42)
    expect(c._handleHover).toHaveBeenCalledWith('mars')
    expect(c._handleHover).toHaveBeenCalledWith(null)
    expect(c._selectBody).toHaveBeenCalledWith('earth')
    expect(mockCtl.reduced !== null).toBe(true)
    expect(c._dismissLoader).toHaveBeenCalled()
  })

  test('onReady with a failed engine flags the fallback surface', async () => {
    const classList = { add: jest.fn() }
    const c = makeHost({
      _getCanvasEl: jest.fn(() => ({})),
      _canvasEl: { classList },
    })

    mockCtl.failed = true
    initStarFieldEngine(c)
    await Promise.resolve()

    expect(c._sfFailed).toBe(true)
    expect(classList.add).toHaveBeenCalledWith(STATE_CLASSES.IS_FALLBACK)
    expect(c._updateDom).toHaveBeenCalled()
  })

  test('init() rejection routes through the catch arm', async () => {
    const classList = { add: jest.fn() }
    const c = makeHost({
      _getCanvasEl: jest.fn(() => ({})),
      _canvasEl: { classList },
    })

    mockCtl.failInit = true
    initStarFieldEngine(c)
    await flush()

    expect(c._isInitializing).toBe(false)
    expect(c._sfReady).toBe(true)
    expect(c._sfFailed).toBe(true)
    expect(classList.add).toHaveBeenCalledWith(STATE_CLASSES.IS_FALLBACK)
    expect(c._updateDom).toHaveBeenCalled()
    expect(c._dismissLoader).toHaveBeenCalled()
  })

  test('early return when a canvas/engine/init is already in place', () => {
    const c = makeHost()

    initStarFieldEngine(c)

    expect(c._engine).toBeNull()

    c._getCanvasEl = jest.fn(() => ({}))
    c._engine = {}
    initStarFieldEngine(c)

    c._engine = null
    c._isInitializing = true
    initStarFieldEngine(c)

    expect(c._engine).toBeNull()
  })

  test('updateStarLoader + dismissStarLoader tolerate missing nodes', () => {
    const c = makeHost()

    updateStarLoader(c, 'msg', 33)
    dismissStarLoader(c)

    const loader = { style: {}, remove: jest.fn() }

    c.$ = jest.fn(() => loader)
    dismissStarLoader(c)

    expect(loader.style.opacity).toBeDefined()
  })
})

const flush = (ms = 0) => new Promise((r) => setTimeout(r, ms))
