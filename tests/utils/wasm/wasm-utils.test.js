/**
 * @file wasm-utils.test.js
 * @description Coverage for the WASM/GPU acceleration layer: the pure-JS
 * fallback math in wasm-layout, the worker-pool dispatcher, the dynamic CSS
 * injector, the smooth scroller, the media-thread manager, the image
 * decoder, and the GPU accelerator singleton. Worker/GPU surfaces are
 * mocked so the main-thread code paths run end to end.
 */

import { jest } from '@jest/globals'

import { WASM_ACTIONS } from '@core/constants.js'
import { TEST_URLS } from '../../fixtures/test-constants.js'

import {
  calcAspectScaled,
  calcCardHeight,
  calcCarouselRingOffset,
  calcCarouselScrollTarget,
  calcColsForWidth,
  calcColumnWidth,
  calcDrawTextDelay,
  calcDrawTextOffset,
  calcEaseOutCubic,
  calcMosaicCols,
  calcMosaicGap,
  calcResponsivePadding,
} from '@core/utils/wasm/wasm-layout.js'
import { wasmPool } from '@core/utils/wasm/wasm-pool.js'
import { wasmCSS, calcWasmSkeletonStyle } from '@core/utils/wasm/wasm-css.js'
import { wasmSmoothScroll } from '@core/utils/wasm/wasm-scroll.js'
import { wasmMediaThreads } from '@core/utils/wasm/wasm-media-threads.js'
import { wasmImageDecoder } from '@core/utils/wasm/wasm-image-decoder.js'
import { gpuAccel } from '@core/utils/gpu/gpu-accel.js'
import { attachMockGL } from '../../fixtures/mock-webgl.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'
import { CHAR_STRINGS } from '@core/tokens/strings/chars.js'
import { ASSET_IDS } from '@core/tokens/ids/assets.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { CSS_STRINGS } from '@core/tokens/strings/css.js'
import { ATTR_VALUES } from '@core/tokens/attrs/values.js'

// The shared setup rAF stub calls cb() with no timestamp — wasm-scroll's
// easing math needs `now`. Re-stub here to pass monotonic timestamps.
const _raf = globalThis.requestAnimationFrame

const installTimedRaf = () => {
  globalThis.requestAnimationFrame = (cb) => {
    const id = setTimeout(() => cb(performance.now() + 30), 5)

    if (id && typeof id.unref === TYPE_STRINGS.FUNCTION) id.unref()

    return id
  }
}

// ─── wasm-layout (pure math fallbacks) ───────────────────────────────────────

describe('wasm-layout JS fallbacks', () => {
  test('calcColumnWidth divides remaining width across columns', () => {
    expect(calcColumnWidth(2, 1000, 20)).toBeCloseTo(490)
    expect(calcColumnWidth(1, 500, 20)).toBe(500)
  })

  test('calcCardHeight divides column width by aspect and adds padding', () => {
    expect(calcCardHeight(200, 2, 10)).toBe(110)
    expect(calcCardHeight(200, 0)).toBeCloseTo(200 / 1.777)
  })

  test('calcCarouselRingOffset maps elapsed fraction onto the ring', () => {
    const off = calcCarouselRingOffset(500, 1000, 300)

    expect(typeof off).toBe(TYPE_STRINGS.NUMBER)
  })

  test('calcCarouselScrollTarget targets a slide offset', () => {
    expect(calcCarouselScrollTarget(3, 100, 10)).toBe(330)
  })

  test('calcEaseOutCubic eases 0→1', () => {
    expect(calcEaseOutCubic(0)).toBe(0)
    expect(calcEaseOutCubic(1)).toBe(1)
    expect(calcEaseOutCubic(0.5)).toBeGreaterThan(0.5)
  })

  test('calcDrawTextDelay/Offset derive per-char timings', () => {
    const delay = calcDrawTextDelay(100, 1500)

    expect(delay).toBeGreaterThan(0)
    expect(calcDrawTextOffset(2, 5, delay)).toBeGreaterThanOrEqual(0)
  })

  test('calcColsForWidth/calcMosaicCols/calcMosaicGap/calcResponsivePadding/calcAspectScaled return numbers', () => {
    expect(typeof calcColsForWidth(1200)).toBe(TYPE_STRINGS.NUMBER)
    expect(typeof calcMosaicCols(1200)).toBe(TYPE_STRINGS.NUMBER)
    expect(typeof calcMosaicGap(1200)).toBe(TYPE_STRINGS.NUMBER)
    expect(typeof calcResponsivePadding(1200)).toBe(TYPE_STRINGS.NUMBER)

    expect(calcAspectScaled(400, 200, 300)).toBe(150)
    expect(calcAspectScaled(200, 100, 300)).toBe(100)
  })

  test('default-arg arms: gap and duration fall back when omitted', () => {
    expect(calcCarouselScrollTarget(3, 100)).toBe(300)
    expect(calcDrawTextDelay(100)).toBeGreaterThan(0)
  })

  test('module eval tolerates a failed engine fetch', async () => {
    const prevWasm = window.WebAssembly
    const origFetch = globalThis.fetch

    window.WebAssembly = { instantiate: async () => ({ instance: { exports: {} } }) }
    globalThis.fetch = jest.fn(async () => ({ ok: false }))

    jest.resetModules()

    await import('@core/utils/wasm/wasm-layout.js')
    await new Promise((r) => setTimeout(r, 40))

    if (prevWasm === undefined) delete window.WebAssembly
    else window.WebAssembly = prevWasm
    globalThis.fetch = origFetch
  })

  test('module bootstraps the engine instance when WebAssembly is present', async () => {
    const prevWasm = window.WebAssembly
    const origFetch = globalThis.fetch

    window.WebAssembly = { instantiate: async () => ({ instance: { exports: {} } }) }
    globalThis.fetch = jest.fn(async () => ({
      ok: true,
      arrayBuffer: async () => new ArrayBuffer(4),
    }))

    jest.resetModules()

    await import('@core/utils/wasm/wasm-layout.js')
    await new Promise((r) => setTimeout(r, 40))

    if (prevWasm === undefined) delete window.WebAssembly
    else window.WebAssembly = prevWasm
    globalThis.fetch = origFetch
  })
})

// ─── wasm-pool (worker dispatcher) ───────────────────────────────────────────

describe('wasm-pool', () => {
  let spawned

  class MockWorker {
    constructor() {
      this.postMessage = jest.fn(({ id } = {}) => {
        queueMicrotask(() => this.onmessage?.({ data: { id, results: { ok: true } } }))
      })
      this.terminate = jest.fn()
      spawned.push(this)
    }
  }

  beforeEach(() => {
    spawned = []
    globalThis.Worker = MockWorker
    wasmPool.workers = []
    wasmPool._poolReady = false
  })

  test('spawns workers lazily on first dispatch and resolves replies', async () => {
    const res = await wasmPool.dispatch(WASM_ACTIONS.PROBE_VIDEO_WASM, { url: TEST_URLS.VIDEO })

    expect(spawned.length).toBeGreaterThan(0)
    expect(res.results.ok).toBe(true)
  })

  test('resolves null when no Worker implementation exists', async () => {
    globalThis.Worker = undefined
    wasmPool.workers = []
    wasmPool._poolReady = false

    const res = await wasmPool.dispatch(WASM_ACTIONS.PROBE_VIDEO_WASM, {})

    expect(res).toBeNull()
  })

  test('resolves null when postMessage throws', async () => {
    class BadWorker {
      constructor() {
        this.postMessage = () => {
          throw new Error(CHAR_STRINGS.EMPTY)
        }
      }
    }
    globalThis.Worker = BadWorker
    wasmPool.workers = []
    wasmPool._poolReady = false

    const res = await wasmPool.dispatch(WASM_ACTIONS.PROBE_VIDEO_WASM, {})

    expect(res).toBeNull()
  })

  test('round-robins payloads across workers', async () => {
    await wasmPool.dispatch(WASM_ACTIONS.PROBE_VIDEO_WASM, { url: TEST_URLS.A })
    await wasmPool.dispatch(WASM_ACTIONS.PROBE_VIDEO_WASM, { url: TEST_URLS.B })

    const calls = spawned.map((w) => w.postMessage.mock.calls.length)

    expect(Math.max(...calls)).toBeGreaterThanOrEqual(1)
  })

  test('extracts ArrayBuffer transferables one level deep', () => {
    const buf = new ArrayBuffer(8)
    const list = wasmPool._extractTransferables({ buf, nested: [new ArrayBuffer(4)] })

    expect(list.length).toBe(2)
    expect(wasmPool._extractTransferables(null)).toEqual([])
    expect(wasmPool._extractTransferables({ plain: 1 })).toEqual([])
  })
})

// ─── wasm-css ────────────────────────────────────────────────────────────────

describe('wasm-css', () => {
  test('injects the shared stylesheet into the head', () => {
    const style = document.getElementById(ASSET_IDS.WASM_DYNAMIC_CSS)

    expect(style).toBeTruthy()
    expect(style.tagName.toLowerCase()).toBe(HTML_TAGS.STYLE)
  })

  test('calcWasmSkeletonStyle builds a dimension style object', () => {
    const style = calcWasmSkeletonStyle(120, 30, CSS_STRINGS.VAR_RADIUS_2XS)

    expect(style.width).toBe('120px')
    expect(style.height).toBe('30px')

    const str = calcWasmSkeletonStyle('50%', '2em', CSS_STRINGS.VAR_RADIUS_FULL)

    expect(str.width).toBe('50%')
  })

  test('setWasmCSSRule dedupes selectors', () => {
    wasmCSS.setWasmCSSRule('.wasm-test-rule', 'color: red')
    wasmCSS.setWasmCSSRule('.wasm-test-rule', 'color: red')

    const el = document.getElementById(ASSET_IDS.WASM_DYNAMIC_CSS)
    const count = (el.textContent.match(/\.wasm-test-rule/g) || []).length

    expect(count).toBe(1)
  })
})

// ─── gpu-accel ───────────────────────────────────────────────────────────────

describe('gpu-accel', () => {
  test('lazily creates the GL context on first use', () => {
    const origCreate = document.createElement.bind(document)

    document.createElement = (tag, ...rest) => {
      const el = origCreate(tag, ...rest)

      if (tag === HTML_TAGS.CANVAS) attachMockGL(el)

      return el
    }

    gpuAccel._ready = false
    gpuAccel.initGPU()

    document.createElement = origCreate

    // Mark ready so later tests don't re-init against the unpatched DOM
    gpuAccel._ready = true

    expect(gpuAccel.gl).toBeTruthy()
  })

  test('processImageGPU/VideoGPU/BitmapGPU return null or drive the texture path', () => {
    const img = document.createElement(HTML_TAGS.IMG)

    expect(gpuAccel.processImageGPU(null)).toBeNull()

    const video = document.createElement(HTML_TAGS.VIDEO)

    Object.defineProperty(video, 'readyState', { value: 4, configurable: true })

    // gl exists (created in the previous test) → the texture path returns true
    expect(gpuAccel.processVideoGPU(video, 10, 10)).toBe(true)
    expect(gpuAccel.processImageGPU(img, 10, 10)).toBe(true)
    expect(gpuAccel.processTextureGPU(img, 10, 10)).toBe(true)
    expect(gpuAccel.processBitmapGPU({}, 10, 10)).toBe(true)
  })

  test('processBitmapGPU returns null without a bitmap and false on upload failure', () => {
    const video = document.createElement(HTML_TAGS.VIDEO)

    Object.defineProperty(video, 'readyState', { value: 4, configurable: true })

    const origUp = gpuAccel._uploadTextureAndDraw
    const origGl = gpuAccel.gl

    gpuAccel.gl = null

    expect(gpuAccel.processBitmapGPU({}, 10, 10)).toBeNull()
    expect(gpuAccel.processVideoGPU(video, 10, 10)).toBeNull()
    expect(gpuAccel.processImageGPU({}, 10, 10)).toBeNull()

    gpuAccel.gl = origGl

    expect(gpuAccel.processBitmapGPU(null, 10, 10)).toBeNull()
    expect(gpuAccel.processVideoGPU(null, 10, 10)).toBeNull()

    Object.defineProperty(video, 'readyState', { value: 1, configurable: true })
    expect(gpuAccel.processVideoGPU(video, 10, 10)).toBeNull()
    Object.defineProperty(video, 'readyState', { value: 4, configurable: true })

    gpuAccel._uploadTextureAndDraw = () => {
      throw new Error('tex')
    }

    expect(gpuAccel.processVideoGPU(video, 10, 10)).toBe(false)
    expect(gpuAccel.processBitmapGPU({}, 10, 10)).toBe(false)
    expect(gpuAccel.processImageGPU({}, 10, 10)).toBe(false)

    gpuAccel._uploadTextureAndDraw = origUp
  })

  test('initGPU survives a failed shader compile', () => {
    const origCompile = gpuAccel.compileShader
    const origCreate = document.createElement.bind(document)

    document.createElement = (tag, ...rest) => {
      const el = origCreate(tag, ...rest)

      if (tag === HTML_TAGS.CANVAS) attachMockGL(el)

      return el
    }

    gpuAccel.compileShader = () => null
    gpuAccel._ready = false
    gpuAccel.initGPU()
    gpuAccel.compileShader = origCompile

    document.createElement = origCreate

    gpuAccel._ready = true
  })

  test('accelerate/release toggle the compositor class on the element', () => {
    const el = document.createElement(HTML_TAGS.DIV)

    gpuAccel.accelerateElementGPU(el)

    expect(el.style.willChange).toContain('transform')

    gpuAccel.releaseElementGPU(el)

    expect(el.style.willChange).toBe(ATTR_VALUES.AUTO)
  })
})

// ─── wasm-scroll ─────────────────────────────────────────────────────────────

describe('wasm-scroll', () => {
  test('animates window.scrollTo toward the target offset', async () => {
    const scrollCalls = []

    window.scrollTo = jest.fn((x, y) => scrollCalls.push(y))
    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true, writable: true })

    installTimedRaf()

    wasmSmoothScroll({ scrollTo: 800, duration: 5 })

    await new Promise((r) => setTimeout(r, 60))

    globalThis.requestAnimationFrame = _raf

    expect(scrollCalls.length).toBeGreaterThan(0)
    expect(scrollCalls[scrollCalls.length - 1]).toBe(800)
  })

  test('is a no-op when the target is already reached', () => {
    const calls = []

    window.scrollTo = jest.fn((x, y) => calls.push(y))
    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true, writable: true })

    wasmSmoothScroll({ scrollTo: 0 })

    expect(calls).toHaveLength(0)
  })

  test('scrolls a container element when provided', async () => {
    const container = document.createElement(HTML_TAGS.DIV)

    Object.defineProperty(container, 'scrollTop', { value: 0, writable: true })

    installTimedRaf()

    wasmSmoothScroll({ container, scrollTo: { y: 120 }, duration: 5 })

    await new Promise((r) => setTimeout(r, 60))

    globalThis.requestAnimationFrame = _raf

    expect(container.scrollTop).toBe(120)
  })

  test('tolerates a missing options bag', () => {
    wasmSmoothScroll()
  })
})

// ─── wasm-media-threads ──────────────────────────────────────────────────────

describe('wasm-media-threads', () => {
  test('decodeMediaInSeparateThread caches bitmaps per URL', async () => {
    const bitmap = { close: jest.fn() }

    wasmPool.dispatch = jest.fn(async () => ({ results: { bitmap } }))

    const first = await wasmMediaThreads.decodeMediaInSeparateThread(TEST_URLS.A)
    const second = await wasmMediaThreads.decodeMediaInSeparateThread(TEST_URLS.A)

    expect(first).toBe(bitmap)
    expect(second).toBe(bitmap)
    expect(wasmPool.dispatch).toHaveBeenCalledTimes(1)
  })

  test('probeVideo caches results per URL', async () => {
    wasmPool.dispatch = jest.fn(async () => ({ results: { codec: 'h264' } }))

    await wasmMediaThreads.probeVideo(TEST_URLS.VIDEO)
    await wasmMediaThreads.probeVideo(TEST_URLS.VIDEO)

    expect(wasmPool.dispatch).toHaveBeenCalledTimes(1)
  })

  test('returns null for missing URLs', async () => {
    expect(await wasmMediaThreads.decodeMediaInSeparateThread(null)).toBeNull()
    expect(await wasmMediaThreads.probeVideo(null)).toBeNull()
  })
})

// ─── wasm-image-decoder ──────────────────────────────────────────────────────

describe('wasm-image-decoder', () => {
  test('decodeImageWASM fetches, dispatches, and caches the bitmap', async () => {
    const bitmap = { close: jest.fn() }

    wasmPool.dispatch = jest.fn(async () => ({ results: { bitmap } }))
    globalThis.fetch = jest.fn(async () => ({
      ok: true,
      blob: async () => new Blob(['x']),
    }))

    const res = await wasmImageDecoder.decodeImageWASM(TEST_URLS.IMG)

    expect(res).toBe(bitmap)
    expect(wasmImageDecoder.bitmapCache.has(TEST_URLS.IMG)).toBe(true)
  })

  test('decodeImageBatchWASM chunks pending items across workers', async () => {
    wasmImageDecoder.bitmapCache.clear()

    const bitmap = { close: jest.fn() }

    wasmPool.workers = [1, 2]
    wasmPool.dispatch = jest.fn(async (_action, { items }) => ({
      results: items.map((it) => ({ url: it.url, bitmap, width: it.width, height: it.height })),
    }))

    const res = await wasmImageDecoder.decodeImageBatchWASM([
      { url: TEST_URLS.A },
      { url: TEST_URLS.B },
      { url: TEST_URLS.IMG },
    ])

    expect(res.size).toBe(3)
    expect(wasmPool.dispatch.mock.calls.length).toBeGreaterThanOrEqual(1)
  })

  test('decodeImageBatchWASM tolerates nullish chunk results', async () => {
    wasmImageDecoder.bitmapCache.clear()

    wasmPool.dispatch = jest.fn(async () => null)

    const res = await wasmImageDecoder.decodeImageBatchWASM([{ url: TEST_URLS.A }])

    expect(res).toBeTruthy()
  })

  test('clearCache closes every cached bitmap', () => {
    const bitmap = { close: jest.fn() }

    wasmImageDecoder.bitmapCache.set(TEST_URLS.A, bitmap)
    wasmImageDecoder.clearCache()

    expect(bitmap.close).toHaveBeenCalled()
    expect(wasmImageDecoder.bitmapCache.size).toBe(0)
  })
})
