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

import '@/components/feedback/CookieBanner.js'
import '@/components/home/ContactSection.js'
import '@/routes/views/not-found/NotFound.js'
import { PREF_STORAGE_KEYS } from '../../../../src/core/tokens/data/storage.js'
import { COMPONENT_TAGS } from '../../../../src/core/tokens/elements/components.js'



const flush = (ms = 80) => new Promise((r) => setTimeout(r, ms))

// ─── core/locale/ui-text.js ──────────────────────────────────────────────────

describe('CookieBanner tails', () => {
  test('accept + refuse persist the answer and hide the banner', async () => {
    localStorage.removeItem(PREF_STORAGE_KEYS.COOKIE)

    const el = document.createElement(COMPONENT_TAGS.COOKIE_BANNER)

    document.body.appendChild(el)
    await flush()

    el.handleAction(true)

    expect(JSON.parse(localStorage.getItem(PREF_STORAGE_KEYS.COOKIE))).toBe(true)
    expect(el.hidden).toBe(true)

    el.handleAction(false)

    expect(JSON.parse(localStorage.getItem(PREF_STORAGE_KEYS.COOKIE))).toBe(false)

    el.remove()
  })
})

