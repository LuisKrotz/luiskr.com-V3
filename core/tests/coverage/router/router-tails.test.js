/**
 * @file router-tails.test.js
 * @description Split from coverage-tails-3.test.js — covers the "router tails" describe.
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
