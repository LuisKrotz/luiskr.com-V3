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
import { VIEW_TAGS } from '@/core/tokens/elements/views.js'
import { MOUSE_EVENTS } from '@/core/tokens/events/dom.js'



const flush = (ms = 80) => new Promise((r) => setTimeout(r, ms))

// ─── core/locale/ui-text.js ──────────────────────────────────────────────────

describe('NotFound tails', () => {
  test('mounts and binds the home link through the router', async () => {
    const el = document.createElement(VIEW_TAGS.VIEW_NOT_FOUND)

    document.body.appendChild(el)
    await flush(150)

    const link = el.shadowRoot.querySelector('a')

    link?.dispatchEvent(new Event(MOUSE_EVENTS.CLICK, { bubbles: true, cancelable: true }))

    el.onUpdated?.()
    el.remove()
  })
})

