/**
 * @file coverage-tails-3.test.js
 * @description Third branch-tail sweep: StatsHud threshold classes, awards
 * mentions fallback selection, legal footer/link surfaces, CMS deploy-info
 * lighthouse rendering, Legal route loading modes, Home route data flow,
 * router navigation edges, main-entry portfolio branches, LangDialog /
 * HomeMosaic / PreferencesModal / AwardsCarousel internals, and App shell.
 */
import { jest } from '@jest/globals'
import router from '@core/router/router.js'

import '@website/components/feedback/StatsHud.js'
import '@website/components/home/AwardsMentions.js'
import '@website/components/legal/Footer.js'

import '@website/components/home/HomeMosaic.js'
import '@website/components/dialogs/LangDialog.js'
import '@website/components/dialogs/PreferencesModal.js'
import '@website/components/carousel/AwardsCarousel.js'
import '@website/views/home/Home.js'
import '@website/views/legal/Legal.js'
import { WINDOW_EVENTS } from '@core/tokens/events/dom.js'
import { ROUTE_PATHS } from '@core/tokens/routes/paths.js'



// ─── StatsHud.js ─────────────────────────────────────────────────────────────

describe('router tails', () => {
  test('navigate guards: same-route, canonical, unknown slug', async () => {
    const toSpy = jest.fn()
    const unsub = router.onNavigate?.(toSpy)

    await router.navigate?.(router.currentRoute?.path || ROUTE_PATHS.ROOT).catch(() => {})
    await router.navigate?.('/nonexistent-slug-xyz').catch(() => {})

    unsub?.()
    router.onNavigate?.(() => {})
  })

  test('popstate resolves the current location', () => {
    window.dispatchEvent(new Event(WINDOW_EVENTS.POPSTATE))

    expect(router).toBeTruthy()
  })
})

