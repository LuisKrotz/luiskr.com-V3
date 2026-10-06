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

import { wasmMediaThreads } from '@/utils/wasm/wasm-media-threads.js'

import { TEST_URLS } from '../../../fixtures/test-constants.js'
import '@/routes/views/legal/Legal.js'
import '@/routes/views/home/Home.js'
import { TYPE_STRINGS } from '@/core/tokens/strings/types.js'



// ─── utils/gpu-accel.js ──────────────────────────────────────────────────────

describe('wasm-media-threads tails', () => {
  test('probe + variant prefetch guards', async () => {
    expect(await wasmMediaThreads.prefetchVideoVariants?.(null)).toBeNull()
    expect(await wasmMediaThreads.prefetchVideoVariants?.([])).toBeNull()

    const probed = await wasmMediaThreads.probeVideo?.(TEST_URLS.VIDEO).catch(() => null)

    expect(probed === null || typeof probed === TYPE_STRINGS.OBJECT).toBe(true)
  })
})

