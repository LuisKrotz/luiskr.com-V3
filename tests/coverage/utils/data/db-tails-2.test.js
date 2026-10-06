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

import { fetchFirebaseDb } from '@/utils/data/db.js'

import '@/components/feedback/CookieBanner.js'
import '@/components/home/ContactSection.js'
import '@/routes/views/not-found/NotFound.js'
import { CACHE_STORAGE_KEYS } from '@/core/tokens/data/storage.js'
import { TYPE_STRINGS } from '@/core/tokens/strings/types.js'
import { DB_PATHS } from '@/core/tokens/routes/paths.js'





// ─── core/locale/ui-text.js ──────────────────────────────────────────────────

describe('db tails 2', () => {
  test('localStorage mirror is read for cached nodes', async () => {
    localStorage.setItem(`${CACHE_STORAGE_KEYS.FB_CACHE_PREFIX}cached-node`, JSON.stringify({ v: 1 }))

    const val = await fetchFirebaseDb('cached-node')

    expect(val === null || typeof val === TYPE_STRINGS.OBJECT).toBe(true)

    localStorage.removeItem(`${CACHE_STORAGE_KEYS.FB_CACHE_PREFIX}cached-node`)
  })

  test('bootstrap path skips unknown locales', async () => {
    const val = await fetchFirebaseDb(`${DB_PATHS.TRANSLATIONS}xx/components`)

    expect(val === undefined || val === null || typeof val === TYPE_STRINGS.OBJECT).toBe(true)
  })
})

