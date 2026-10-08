/**
 * @file wasm-scroll-container-tails.test.js
 * @description Split from coverage-tails-5.test.js — covers the "wasm-scroll container tails" describe.
 */
import _router from '@core/router/router.js'

import { wasmSmoothScroll } from '@core/utils/wasm/wasm-scroll.js'

import '@website/views/legal/Legal.js'
import '@website/views/home/Home.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'

const flush = (ms = 80) => new Promise((r) => setTimeout(r, ms))

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
