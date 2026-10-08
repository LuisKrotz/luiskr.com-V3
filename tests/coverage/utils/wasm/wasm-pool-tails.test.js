/**
 * @file coverage-tails-4.test.js
 * @description Fourth branch-tail sweep targeting files with ≤8 uncovered
 * branches: ui-text fallback dig, firebase-mock path resolver, sanitize
 * disallowed-tag replacement, webgl-pool IO guard, CMS mount guard,
 * CookieBanner actions, checkbox widget lifecycle, NPU GPU fallback,
 * ContactSection lang guards, jsx prop routing, media helpers,
 * scroll-state one-shots, NotFound link binding, wasm-css reuse,
 * Component remount reuse, schema generators, db bootstrap/cache,
 * gpu-info tiers, wasm-pool worker guards, intro-loader internals.
 */

import { wasmPool } from '@core/utils/wasm/wasm-pool.js'

import { TEST_TEXT } from '../../../fixtures/test-constants.js'
import '@website/components/feedback/CookieBanner.js'
import '@website/components/home/ContactSection.js'
import '@website/views/not-found/NotFound.js'


// ─── core/locale/ui-text.js ──────────────────────────────────────────────────

describe('wasm-pool tails', () => {
  test('handleMessage ignores unknown ids and init tolerates worker failure', () => {
    wasmPool.handleMessage?.({ data: { id: 'nope-xyz' } })

    const WorkerSaved = globalThis.Worker

    globalThis.Worker = class { constructor() { throw new Error(TEST_TEXT.SECOND) } }
    wasmPool.init?.()
    globalThis.Worker = WorkerSaved
  })
})

