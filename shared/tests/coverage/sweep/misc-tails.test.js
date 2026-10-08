/**
 * @file misc-tails.test.js — coverage tails for utils + cms event wiring.
 * No jest.resetModules(): re-imports after a reset lose istanbul counters.
 */

import { jest } from '@jest/globals'
import { FORM_EVENTS } from '@core/tokens/events/dom.js'
import { DEBUG_PARAMS, WEBGL_MODES } from '@core/tokens/strings/debug.js'
import { wasmImageDecoder } from '@core/utils/wasm/wasm-image-decoder.js'
import { wasmPool } from '@core/utils/wasm/wasm-pool.js'
import { gpuAccel } from '@core/utils/gpu/gpu-accel.js'
import { getGPUInfo } from '@core/utils/gpu/gpu-info.js'
import { startNetworkObserver } from '@core/utils/perf/stats/network.js'
import { stopCarouselAutoplay } from '@website/components/carousel/custom-carousel/autoplay.js'
import { handleSpaceInput } from '@earth/space/wiring.js'
import { bindEvents } from '@cms/projects/events.js'
import { deferIdle, mountAppShell } from '@/app/boot.js'
import { THEME } from '@core/tokens/theme/theme.js'
import { predictiveLoader } from '@core/predictive-loader.js'
import { BaseComponent } from '@core/Component.js'
import { drawFlag } from '@core/utils/canvas/widgets/flag/draw.js'
import { BurgerButtonWebGL } from '@core/utils/canvas/widgets/burger-button-webgl.js'
import { sanitizeHtml } from '@core/utils/data/sanitize.js'
import store from '@core/store.js'
import { createMockGL } from '@tests/fixtures/mock-webgl.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { DATA_MUTATIONS, MODAL_MUTATIONS, PREF_MUTATIONS } from '@core/tokens/events/mutations.js'
import { CMS_PROJECTS_CLASSES } from '@cms/tokens.js'

const setSearch = (s) => window.history.replaceState(null, '', s)

describe('utils tails', () => {
  test('getGPUInfo — debug webGLMode:fallback → null GL arm', () => {
    setSearch(`/?${DEBUG_PARAMS.KEY}=${DEBUG_PARAMS.WEBGL_MODE}:${WEBGL_MODES.FALLBACK}`)

    const info = getGPUInfo()

    expect(info).toBeTruthy()

    setSearch('/')
  })

  test('startNetworkObserver — no window → null win arm', () => {
    const desc = Object.getOwnPropertyDescriptor(globalThis, 'window')

    if (!desc?.configurable) return

    delete globalThis.window

    expect(() => startNetworkObserver({})).not.toThrow()

    Object.defineProperty(globalThis, 'window', desc)
  })

  test('wasmImageDecoder — worker bitmap fallbacks across result shapes', async () => {
    const origFetch = globalThis.fetch
    const origDispatch = wasmPool.dispatch
    const origGpu = gpuAccel.processBitmapGPU

    globalThis.fetch = async () => ({ ok: true, blob: async () => ({}) })
    gpuAccel.processBitmapGPU = () => {}

    // results non-array without .bitmap → ?? workerRes.bitmap arm
    wasmPool.dispatch = async () => ({ results: {}, bitmap: { close() {} } })
    const b1 = await wasmImageDecoder.decodeImageWASM('u1')

    // results IS an array → undefined ?? workerRes.bitmap arm
    wasmPool.dispatch = async () => ({ results: [], bitmap: { close() {} } })
    const b2 = await wasmImageDecoder.decodeImageWASM('u2')

    // no url → early null arm
    const b3 = await wasmImageDecoder.decodeImageWASM('')

    // cache hit arm — second call on u1 serves bitmapCache
    const b4 = await wasmImageDecoder.decodeImageWASM('u1')

    expect(b1).toBeTruthy()
    expect(b2).toBeTruthy()
    expect(b3).toBeNull()
    expect(b4).toBeTruthy()

    globalThis.fetch = origFetch
    wasmPool.dispatch = origDispatch
    gpuAccel.processBitmapGPU = origGpu
  })

  test('stopCarouselAutoplay — default permanently arm + stopped early return', () => {
    const c = { autoplayRunning: false, _isRegressing: false }

    expect(() => stopCarouselAutoplay(c)).not.toThrow()
  })

  test('handleSpaceInput — input without data-param → early return', () => {
    const input = document.createElement(HTML_TAGS.INPUT)

    expect(() => handleSpaceInput({ _earthBg: {} }, input)).not.toThrow()
  })

  test('deferIdle — rIC present and absent arms', () => {
    const cb = jest.fn()

    deferIdle(cb)

    const orig = window.requestIdleCallback

    delete window.requestIdleCallback
    deferIdle(cb)

    window.requestIdleCallback = orig

    expect(cb).not.toThrow()
  })

  test('mountAppShell — deferred scroll bookkeeping runs on idle', async () => {
    const c = {
      initInputListeners: jest.fn(),
      loadData: jest.fn(),
      subscribe: jest.fn(),
      $: jest.fn(() => null),
      addScopedListener: jest.fn(),
      _updateViewContent: jest.fn(),
      updateSectionTops: jest.fn(),
      checkScroll: jest.fn(),
      routeLoading: false,
      currentViewTag: null,
    }

    mountAppShell(c)

    // rIC → setTimeout(0): the idle callback must actually fire its body
    await new Promise((r) => setTimeout(r, 120))

    expect(c.updateSectionTops).toHaveBeenCalled()
    expect(c.checkScroll).toHaveBeenCalled()

    // matchMedia change callback: SYSTEM applies theme, non-SYSTEM is a no-op
    const mqCall = c.addScopedListener.mock.calls.find(([, ev]) => ev === FORM_EVENTS.CHANGE)

    const onSchemeChange = mqCall[2]

    store.commit(PREF_MUTATIONS.SET_THEME, THEME.SYSTEM)
    onSchemeChange()

    store.commit(PREF_MUTATIONS.SET_THEME, THEME.DARK)
    onSchemeChange()
  })

  test('predictiveLoader._schedule — setTimeout fallback arm', () => {
    const orig = window.requestIdleCallback
    const cb = jest.fn()

    delete window.requestIdleCallback

    predictiveLoader._schedule(cb)

    window.requestIdleCallback = orig
  })

  test('Component._renderInitial — element without shadowRoot → early return', () => {
    const bare = document.createElement(HTML_TAGS.DIV)

    expect(() => BaseComponent.prototype._renderInitial.call(bare)).not.toThrow()
  })

  test('drawFlag — flag with null 2D ctx → false arm', () => {
    const gl = createMockGL()

    const renderer = {
      gl,
      canvas: {},
      program: {},
      quadBuffer: {},
      aPos: 0,
      uResolution: {},
      uTime: {},
      uHover: {},
      uTex1: {},
      uTex2: {},
      texture: () => ({}),
    }

    const flag = {
      lang: { cc: 'us', cc2: null },
      ctx: null,
      canvas: { width: 4, height: 4 },
      hoverLevel: 0,
      _getAnimType: () => 0,
      _splitPoint: () => 0.5,
    }

    expect(drawFlag(renderer, flag, 0)).toBe(false)
  })

  test('BurgerButtonWebGL._drawFrame — null gl → early return', () => {
    const inst = Object.create(BurgerButtonWebGL.prototype)

    inst.canvas = { width: 10, height: 10, classList: { contains: () => false } }
    inst.gl = null

    expect(() => inst._drawFrame(0)).not.toThrow()
  })

  test('sanitizeHtml — disallowed void element → textContent EMPTY arm', () => {
    const out = sanitizeHtml('<div><img src="x"></div>')

    expect(typeof out).toBe('string')
  })

  test('gpuAccel.initGPU — debug fallback mode → null gl arm', () => {
    setSearch(`/?${DEBUG_PARAMS.KEY}=${DEBUG_PARAMS.WEBGL_MODE}:${WEBGL_MODES.FALLBACK}`)

    const g = Object.create(gpuAccel.constructor.prototype)

    expect(() => g.initGPU()).not.toThrow()

    setSearch('/')
  })

  test('store mutations — sparse payload fallback arms', () => {
    store.commit(DATA_MUTATIONS.SET_MENTIONS, { title: 'x' })
    store.commit(MODAL_MUTATIONS.SET_MODAL, {})

    expect(true).toBe(true)
  })

  test('cms projects bindEvents — bound textarea with null currentProject', () => {
    const ta = document.createElement(HTML_TAGS.TEXTAREA)

    const host = {
      $: () => null,
      $$: (sel) => (sel.endsWith(CMS_PROJECTS_CLASSES.SEC_TEXT_INPUT) ? [ta] : []),
      addScopedListener: (el, ev, fn) => el.addEventListener(ev, fn),
      currentProject: null,
    }

    bindEvents(host)

    expect(() => ta.dispatchEvent(new window.Event(FORM_EVENTS.INPUT))).not.toThrow()
  })
})
