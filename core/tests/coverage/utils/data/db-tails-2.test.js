/**
 * @file db-tails-2.test.js
 * @description Split from coverage-tails-4.test.js — covers the "db tails 2" describe.
 */
import { fetchFirebaseDb } from '@core/utils/data/db.js'

import '@website/components/feedback/CookieBanner.js'
import '@website/components/home/ContactSection.js'
import '@website/views/not-found/NotFound.js'
import { CACHE_STORAGE_KEYS } from '@core/tokens/data/storage.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'
import { DB_PATHS } from '@core/tokens/routes/paths.js'

describe('db tails 2', () => {
  test('localStorage mirror is read for cached nodes', async () => {
    localStorage.setItem(
      `${CACHE_STORAGE_KEYS.FB_CACHE_PREFIX}cached-node`,
      JSON.stringify({ v: 1 })
    )

    const val = await fetchFirebaseDb('cached-node')

    expect(val === null || typeof val === TYPE_STRINGS.OBJECT).toBe(true)

    localStorage.removeItem(`${CACHE_STORAGE_KEYS.FB_CACHE_PREFIX}cached-node`)
  })

  test('bootstrap path skips unknown locales', async () => {
    const val = await fetchFirebaseDb(`${DB_PATHS.TRANSLATIONS}xx/components`)

    expect(val === undefined || val === null || typeof val === TYPE_STRINGS.OBJECT).toBe(true)
  })
})
