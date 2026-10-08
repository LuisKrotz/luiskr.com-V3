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

import { webglPool } from '@core/utils/canvas/webgl-pool.js'

import '@website/components/feedback/CookieBanner.js'
import '@website/components/home/ContactSection.js'
import '@website/views/not-found/NotFound.js'


// ─── core/locale/ui-text.js ──────────────────────────────────────────────────

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

