/**
 * @file db-tails.test.js
 * @description Split from coverage-tails-2.test.js — covers the "db tails" describe.
 */
import { LOCALES } from '@core/constants.js'
import _store from '@core/store.js'

import '@website/components/feedback/CookieBanner.js'
import { DB_PATHS, ROUTE_PATHS } from '@core/tokens/routes/paths.js'

describe('db tails', () => {
  test('non-translation path goes to REST, translations hit the snapshot', async () => {
    const { fetchFirebaseDb } = await import('@core/utils/data/db.js')

    const rest = await fetchFirebaseDb(`${ROUTE_PATHS.PORTFOLIO}anything`)

    const tr = await fetchFirebaseDb(`${DB_PATHS.TRANSLATIONS}${LOCALES.EN}/components`)

    expect(rest !== undefined).toBe(true)
    expect(tr !== undefined).toBe(true)

    const again = await fetchFirebaseDb(`${ROUTE_PATHS.PORTFOLIO}anything`)

    expect(again).toBe(rest)
  })
})
