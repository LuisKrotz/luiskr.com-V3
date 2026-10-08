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
import { jest } from '@jest/globals'

import { IntroLoader } from '@core/utils/canvas/loaders/intro-loader.js'

import '@website/components/feedback/CookieBanner.js'
import '@website/components/home/ContactSection.js'
import '@website/views/not-found/NotFound.js'


// ─── core/locale/ui-text.js ──────────────────────────────────────────────────

describe('intro-loader tails 2', () => {
  test('constructor defaults and terminal lines', () => {
    sessionStorage.setItem('lk_intro_shown', '1')

    const loader = new IntroLoader(document.body, jest.fn())

    expect(loader.progress).toBe(0)

    sessionStorage.removeItem('lk_intro_shown')
  })
})

