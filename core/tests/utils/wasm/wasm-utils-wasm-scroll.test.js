/**
 * @file wasm-utils-wasm-scroll.test.js
 * @description Split from wasm-utils.test.js — covers the "wasm-scroll" describe.
 */
import { jest } from '@jest/globals'

import { wasmSmoothScroll } from '@core/utils/wasm/wasm-scroll.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'

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
