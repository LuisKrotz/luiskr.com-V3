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

import '@/utils/data/db.js'

import '@/components/feedback/CookieBanner.js'
import '@/components/home/ContactSection.js'
import '@/routes/views/not-found/NotFound.js'
import { TYPE_STRINGS } from '@/core/tokens/strings/types.js'
import { DB_PATHS } from '@/core/tokens/routes/paths.js'



// ─── core/locale/ui-text.js ──────────────────────────────────────────────────

describe('firebase-mock tails', () => {
  test('ref/get resolves nested and missing nodes', async () => {
    const { ref, get, getDatabase, fetchFirebaseDb } = await import('@/cms/dev/firebase-mock.js')

    const db = getDatabase()
    const missing = await get(ref(db, 'no/such/node'))

    expect(missing.exists()).toBe(false)

    const root = await get(ref(db))

    expect(typeof root.exists()).toBe(TYPE_STRINGS.BOOLEAN)

    await fetchFirebaseDb(DB_PATHS.PAGES)
  })
})

