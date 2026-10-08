/**
 * @file utils-deep-coverage-wasm-layout.test.js
 * @description Split from utils-deep-coverage.test.js — covers the "wasm-layout" describe.
 */
import { describe, test, expect, jest } from '@jest/globals'

const flush = (ms = 0) => new Promise((r) => setTimeout(r, ms))

// ─── wasm-layout.js ──────────────────────────────────────────────────────────
describe('wasm-layout', () => {
  test('dispatches to the WASM exports when instantiation succeeds', async () => {
    jest.resetModules()

    const exports = {
      calc_column_width: () => 42,
      calc_card_height: () => 43,
      calc_carousel_ring_offset: () => 44,
      calc_carousel_scroll_target: () => 45,
      calc_ease_out_cubic: () => 46,
      calc_draw_text_delay: () => 47,
      calc_draw_text_offset: () => 48,
    }

    const origFetch = globalThis.fetch

    globalThis.fetch = jest.fn(async () => ({
      ok: true,
      arrayBuffer: async () => new ArrayBuffer(8),
    }))

    const origInstantiate = WebAssembly.instantiate

    WebAssembly.instantiate = jest.fn(async () => ({ instance: { exports } }))
    window.WebAssembly = WebAssembly

    const mod = await import('@core/utils/wasm/wasm-layout.js')

    await flush(10)

    expect(mod.calcColumnWidth(3, 300, 10)).toBe(42)
    expect(mod.calcCardHeight(100, 1.5)).toBe(43)
    expect(mod.calcCarouselRingOffset(1, 2, 100)).toBe(44)
    expect(mod.calcCarouselScrollTarget(2, 100, 10)).toBe(45)
    expect(mod.calcEaseOutCubic(0.5)).toBe(46)
    expect(mod.calcDrawTextDelay(10, 1000)).toBe(22) // clamped to 22ms max
    expect(mod.calcDrawTextOffset(1, 2, 3)).toBe(48)
    expect(mod.calcDrawTextOrderedOffset(2, 500)).toBe(48) // same WASM op, delay=1 passthrough

    WebAssembly.instantiate = origInstantiate
    globalThis.fetch = origFetch
  })

  test('falls back to the JS formulas when WASM fails to load', async () => {
    jest.resetModules()

    const origFetch = globalThis.fetch

    globalThis.fetch = jest.fn(async () => {
      throw new Error('no wasm')
    })

    const mod = await import('@core/utils/wasm/wasm-layout.js')

    await flush(10)

    expect(mod.calcColumnWidth(3, 300, 10)).toBeCloseTo((300 - 2 * 10) / 3)
    expect(mod.calcCardHeight(100, 2, 5)).toBeCloseTo(100 / 2 + 5)
    expect(mod.calcCardHeight(100, 0)).toBeCloseTo(100 / 1.777)
    expect(mod.calcCarouselRingOffset(1, 2, 100)).toBeCloseTo(50)
    expect(mod.calcCarouselScrollTarget(2, 100, 10)).toBe(220)
    expect(mod.calcEaseOutCubic(0)).toBe(0)
    expect(mod.calcEaseOutCubic(1)).toBe(1)
    expect(mod.calcDrawTextDelay(0, 1000)).toBe(22)
    expect(mod.calcDrawTextDelay(1000, 1000)).toBe(1)
    expect(mod.calcDrawTextOffset(2, 3, 10)).toBe(3 * 10 + 2 * 30)
    expect(mod.calcDrawTextOrderedOffset(2, 500)).toBe(500 + 2 * 30)
    expect(mod.calcColsForWidth(300)).toBe(1)
    expect(mod.calcColsForWidth(700)).toBe(2)
    expect(mod.calcColsForWidth(1200)).toBe(3)
    expect(mod.calcColsForWidth(1800)).toBe(4)
    expect(mod.calcColsForWidth(2000)).toBe(5)
    expect(mod.calcColsForWidth(2400)).toBe(6)
    expect(mod.calcColsForWidth(3000)).toBe(7)
    expect(mod.calcMosaicCols(300)).toBeDefined()
    expect(mod.calcMosaicCols(9999)).toBeDefined()
    expect(mod.calcMosaicGap(100)).toBe(0)
    expect(mod.calcMosaicGap(1000)).toBe(13)
    expect(mod.calcResponsivePadding(100)).toBe(13)
    expect(mod.calcResponsivePadding(400)).toBe(21)
    expect(mod.calcResponsivePadding(600)).toBe(34)
    expect(mod.calcResponsivePadding(900)).toBe(55)
    expect(mod.calcResponsivePadding(1200)).toBe(89)
    expect(mod.calcResponsivePadding(2000)).toBe(144)
    expect(mod.calcAspectScaled(0, 100)).toBe(100)
    expect(mod.calcAspectScaled(500, 100)).toBe(100)
    expect(mod.calcAspectScaled(4000, 1000, 2000)).toBe(500)

    globalThis.fetch = origFetch
  })
})
