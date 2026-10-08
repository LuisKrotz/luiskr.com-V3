/**
 * @file wasm-utils-wasm-layout-js-fallbacks.test.js
 * @description Split from wasm-utils.test.js — covers the "wasm-layout JS fallbacks" describe.
 */
import { jest } from '@jest/globals'

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
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'

// The shared setup rAF stub calls cb() with no timestamp — wasm-scroll's
// easing math needs `now`. Re-stub here to pass monotonic timestamps.
const _raf = globalThis.requestAnimationFrame

const _installTimedRaf = () => {
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
