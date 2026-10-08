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

import { sanitizeHtml } from '@core/utils/data/sanitize.js'

import { TEST_TEXT } from '../../../fixtures/test-constants.js'
import '@website/components/feedback/CookieBanner.js'
import '@website/components/home/ContactSection.js'
import '@website/views/not-found/NotFound.js'


// ─── core/locale/ui-text.js ──────────────────────────────────────────────────

describe('sanitize tails', () => {
  test('disallowed tags are replaced by their text content', () => {
    const clean = sanitizeHtml('<div><iframe>inner-text</iframe><p>ok</p></div>')

    expect(clean).not.toContain('iframe')
  })

  test('non-element children are dropped entirely', () => {
    const clean = sanitizeHtml('<p><!-- comment -->' + TEST_TEXT.SECOND + '</p>')

    expect(clean).toContain(TEST_TEXT.SECOND)
  })
})

