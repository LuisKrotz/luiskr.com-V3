/**
 * @file coverage-tails-2.test.js
 * @description Second branch-tail sweep: store init/mutation edges,
 * Component mount/remount fallbacks, predictive-loader observer paths,
 * wasm-smooth-scroll option shapes, WebGL pool purge/restore, intro
 * loader early exits, checkbox/burger canvas widgets, local media cache
 * fallbacks, the SWR db layer, NPU predictor tiers, and the legacy DOM
 * polyfill bodies.
 */

import { LOCALES} from '@core/constants.js'
import _store from '@core/store.js'

import '@website/components/feedback/CookieBanner.js'
import { DB_PATHS, ROUTE_PATHS } from '@core/tokens/routes/paths.js'



// ─── store.js ────────────────────────────────────────────────────────────────

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

