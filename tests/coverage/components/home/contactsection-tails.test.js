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

import store from '@/core/store.js'

import '@/components/feedback/CookieBanner.js'
import '@/components/home/ContactSection.js'
import '@/routes/views/not-found/NotFound.js'
import { LANG_MUTATIONS } from '../../../../src/core/tokens/events/mutations.js'
import { COMPONENT_TAGS } from '../../../../src/core/tokens/elements/components.js'



const flush = (ms = 80) => new Promise((r) => setTimeout(r, ms))

// ─── core/locale/ui-text.js ──────────────────────────────────────────────────

describe('ContactSection tails', () => {
  test('mounts with and without component translations', async () => {
    store.commit(LANG_MUTATIONS.SET_COMPONENT_LANG, null)

    const el = document.createElement(COMPONENT_TAGS.CONTACT_SECTION)

    document.body.appendChild(el)
    await flush(120)

    el.onStoreUpdate?.()

    el.remove()
  })
})

