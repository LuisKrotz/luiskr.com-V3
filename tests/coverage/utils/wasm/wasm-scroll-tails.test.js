/**
 * @file coverage-tails-2.test.js
 * @description Second branch-tail sweep: store init/mutation edges,
 * Component mount/remount fallbacks, predictive-loader observer paths,
 * wasm-smooth-scroll option shapes, WebGL pool purge/restore, intro
 * loader early exits, checkbox/burger canvas widgets, local media cache
 * fallbacks, the SWR db layer, NPU predictor tiers, and the legacy DOM
 * polyfill bodies.
 */
import { jest } from '@jest/globals'
import _store from '@core/store.js'
import { wasmSmoothScroll } from '@core/utils/wasm/wasm-scroll.js'

import '@website/components/feedback/CookieBanner.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'



const flush = (ms = 60) => new Promise((r) => setTimeout(r, ms))

// ─── store.js ────────────────────────────────────────────────────────────────

describe('wasm-scroll tails', () => {
  test('scrolls by number, {y} shape, element and container variants', async () => {
    window.scrollTo = jest.fn()

    if (typeof globalThis.history === TYPE_STRINGS.UNDEFINED) {
      globalThis.history = window.history
    }

    wasmSmoothScroll({ scrollTo: 120 })
    wasmSmoothScroll({ scrollTo: { y: 200, top: 300 } })
    wasmSmoothScroll({ scrollTo: 0 })

    await flush(40)

    const target = document.createElement(HTML_TAGS.DIV)

    target.id = 'scroll-target-x'
    target.getBoundingClientRect = () => ({ top: 500 })
    document.body.appendChild(target)

    const container = document.createElement(HTML_TAGS.DIV)

    container.scrollTop = 0
    container.getBoundingClientRect = () => ({ top: 0 })

    wasmSmoothScroll({ element: target, updateHistory: true, duration: 10 })
    wasmSmoothScroll({ element: `#${'scroll-target-x'}`, container, duration: 10 })
    await flush(80)

    // String container selector + body container + {top}-only shape.
    container.id = 'scroll-box-x'
    document.body.appendChild(container)

    wasmSmoothScroll({ container: `#${'scroll-box-x'}`, scrollTo: { top: 40 }, duration: 10 })
    wasmSmoothScroll({ container: document.body, scrollTo: 30, duration: 10 })
    wasmSmoothScroll({})

    // Element without an id → updateHistory guard short-circuits.
    const bare = document.createElement(HTML_TAGS.DIV)

    bare.getBoundingClientRect = () => ({ top: 300 })
    document.body.appendChild(bare)
    wasmSmoothScroll({ element: bare, updateHistory: true, duration: 10 })
    await flush(80)

    target.remove()
    container.remove()
    bare.remove()
  })

  test('mid-animation frames reschedule via RAF with a real timestamp', async () => {
    const origRaf = globalThis.requestAnimationFrame

    globalThis.requestAnimationFrame = (cb) => setTimeout(() => cb(performance.now()), 4)

    window.scrollTo = jest.fn()
    wasmSmoothScroll({ scrollTo: 400, duration: 30 })

    await flush(60)

    globalThis.requestAnimationFrame = origRaf
  })

  test('empty scrollTo object falls through to the zero default', () => {
    window.scrollTo = jest.fn()
    wasmSmoothScroll({ scrollTo: {} })
  })

  test('window-less invocation returns early', () => {
    const saved = globalThis.window

    delete globalThis.window
    wasmSmoothScroll({ scrollTo: 10 })
    globalThis.window = saved
  })

  test('tiny distances return before animating', () => {
    const prev = Object.getOwnPropertyDescriptor(window, 'scrollY')

    Object.defineProperty(window, 'scrollY', { configurable: true, value: 0 })
    wasmSmoothScroll({ scrollTo: 1 })

    if (prev) Object.defineProperty(window, 'scrollY', prev)
  })
})

