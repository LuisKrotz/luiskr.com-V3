/**
 * @file webgl-pool-tails-2.test.js
 * @description Split from coverage-tails-4.test.js — covers the "webgl-pool tails 2" describe.
 */
import { webglPool } from '@core/utils/canvas/webgl-pool.js'

import '@website/components/feedback/CookieBanner.js'
import '@website/components/home/ContactSection.js'
import '@website/views/not-found/NotFound.js'

describe('webgl-pool tails 2', () => {
  test('initObserver early-returns without IntersectionObserver', () => {
    const IO = globalThis.IntersectionObserver

    delete globalThis.IntersectionObserver
    delete window.IntersectionObserver
    webglPool.initObserver()

    globalThis.IntersectionObserver = IO
    window.IntersectionObserver = IO
    webglPool.initObserver()
  })
})
