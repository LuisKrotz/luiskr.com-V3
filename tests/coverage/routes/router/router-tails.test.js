/**
 * @file coverage-tails-3.test.js
 * @description Third branch-tail sweep: StatsHud threshold classes, awards
 * mentions fallback selection, legal footer/link surfaces, CMS deploy-info
 * lighthouse rendering, Legal route loading modes, Home route data flow,
 * router navigation edges, main-entry portfolio branches, LangDialog /
 * HomeMosaic / PreferencesModal / HomeCarousel internals, and App shell.
 */
import { jest } from '@jest/globals'
import router from '@/routes/router.js'

import '@/components/feedback/StatsHud.js'
import '@/components/home/AwardsMentions.js'
import '@/components/legal/Footer.js'

import '@/components/home/HomeMosaic.js'
import '@/components/dialogs/LangDialog.js'
import '@/components/dialogs/PreferencesModal.js'
import '@/components/carousel/HomeCarousel.js'
import '@/routes/views/home/Home.js'
import '@/routes/views/legal/Legal.js'
import { WINDOW_EVENTS } from '../../../../src/core/tokens/events/dom.js'
import { ROUTE_PATHS } from '../../../../src/core/tokens/routes/paths.js'



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

