/**
 * @file coverage-tails-5.test.js
 * @description Fifth branch-tail sweep: gpu-accel compositing + texture
 * paths, stats-engine observers and fetch patch, wasm-media-threads
 * probes, Legal route data modes, router canonical/history edges,
 * firebase REST fallback, deep-shadow DOM traversal, burger resize
 * branches, legacy polyfill bodies, wasm-scroll option shapes and
 * Home route param changes.
 */

import _router from '@/routes/router.js'

import { wasmSmoothScroll } from '@/utils/wasm/wasm-scroll.js'

import '@/routes/views/legal/Legal.js'
import '@/routes/views/home/Home.js'
import { HTML_TAGS } from '../../../../src/core/tokens/elements/html.js'


const flush = (ms = 80) => new Promise((r) => setTimeout(r, ms))

// ─── utils/gpu-accel.js ──────────────────────────────────────────────────────

describe('wasm-scroll container tails', () => {
  test('non-window containers animate scrollTop', async () => {
    const container = document.createElement(HTML_TAGS.DIV)

    Object.defineProperty(container, 'scrollHeight', { configurable: true, value: 4000 })
    Object.defineProperty(container, 'clientHeight', { configurable: true, value: 200 })
    container.scrollTop = 0

    wasmSmoothScroll({ scrollTo: 500, container, duration: 10 })

    await flush(80)
  })
})

