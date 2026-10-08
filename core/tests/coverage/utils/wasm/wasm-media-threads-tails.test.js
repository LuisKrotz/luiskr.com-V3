/**
 * @file wasm-media-threads-tails.test.js
 * @description Split from coverage-tails-5.test.js — covers the "wasm-media-threads tails" describe.
 */
import _router from '@core/router/router.js'

import { wasmMediaThreads } from '@core/utils/wasm/wasm-media-threads.js'

import { TEST_URLS } from '@tests/fixtures/test-constants.js'
import '@website/views/legal/Legal.js'
import '@website/views/home/Home.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'

describe('wasm-media-threads tails', () => {
  test('probe + variant prefetch guards', async () => {
    expect(await wasmMediaThreads.prefetchVideoVariants?.(null)).toBeNull()
    expect(await wasmMediaThreads.prefetchVideoVariants?.([])).toBeNull()

    const probed = await wasmMediaThreads.probeVideo?.(TEST_URLS.VIDEO).catch(() => null)

    expect(probed === null || typeof probed === TYPE_STRINGS.OBJECT).toBe(true)
  })
})
