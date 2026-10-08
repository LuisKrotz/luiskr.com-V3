/**
 * @file wasm-scroll-tails-2.test.js
 * @description Split from coverage-tails-5.test.js — covers the "wasm-scroll tails 2" describe.
 */
import { jest } from '@jest/globals'

import _router from '@core/router/router.js'

import { wasmSmoothScroll } from '@core/utils/wasm/wasm-scroll.js'

import '@website/views/legal/Legal.js'
import '@website/views/home/Home.js'

const flush = (ms = 80) => new Promise((r) => setTimeout(r, ms))

describe('wasm-scroll tails 2', () => {
  test('scrollTo shapes: negative y, element lookup failure, container scroll', async () => {
    window.scrollTo = jest.fn()

    wasmSmoothScroll({ scrollTo: -50 })
    wasmSmoothScroll({ element: '#missing-scroll-target-xyz', duration: 10 })
    wasmSmoothScroll({ scrollTo: { top: 0 } })

    await flush(60)
  })
})
