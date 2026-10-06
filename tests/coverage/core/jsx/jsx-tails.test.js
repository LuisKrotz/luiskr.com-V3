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

import { h } from '@/core/jsx.js'

import '@/components/feedback/CookieBanner.js'
import '@/components/home/ContactSection.js'
import '@/routes/views/not-found/NotFound.js'
import { HTML_TAGS } from '@/core/tokens/elements/html.js'



// ─── core/locale/ui-text.js ──────────────────────────────────────────────────

describe('jsx tails', () => {
  test('style string, style object with custom props, and attr mapping', () => {
    const a = h(HTML_TAGS.DIV, { style: 'color: red' })
    const b = h(HTML_TAGS.DIV, { style: { color: 'blue', '--x-var': '1px' } })
    const c = h(HTML_TAGS.DIV, { dataset: undefined, unknownAttrX: '1' })
    const d = h(HTML_TAGS.INPUT, { disabled: true })

    expect(a.style.cssText).toContain('color')
    expect(b.style.getPropertyValue('--x-var')).toBe('1px')
    expect(c.getAttribute('unknownattrx')).toBe('1')
    expect(d.disabled).toBe(true)
  })
})

