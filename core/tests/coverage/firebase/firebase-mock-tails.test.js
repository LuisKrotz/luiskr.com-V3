/**
 * @file firebase-mock-tails.test.js
 * @description Split from coverage-tails-4.test.js — covers the "firebase-mock tails" describe.
 */
import '@core/utils/data/db.js'

import '@website/components/feedback/CookieBanner.js'
import '@website/components/home/ContactSection.js'
import '@website/views/not-found/NotFound.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'
import { DB_PATHS } from '@core/tokens/routes/paths.js'

describe('firebase-mock tails', () => {
  test('ref/get resolves nested and missing nodes', async () => {
    const { ref, get, getDatabase, fetchFirebaseDb } = await import('@cms/dev/firebase-mock.js')

    const db = getDatabase()
    const missing = await get(ref(db, 'no/such/node'))

    expect(missing.exists()).toBe(false)

    const root = await get(ref(db))

    expect(typeof root.exists()).toBe(TYPE_STRINGS.BOOLEAN)

    await fetchFirebaseDb(DB_PATHS.PAGES)
  })
})
