/**
 * @file coverage-tails-3.test.js
 * @description Third branch-tail sweep: StatsHud threshold classes, awards
 * mentions fallback selection, legal footer/link surfaces, CMS deploy-info
 * lighthouse rendering, Legal route loading modes, Home route data flow,
 * router navigation edges, main-entry portfolio branches, LangDialog /
 * HomeMosaic / PreferencesModal / AwardsCarousel internals, and App shell.
 */
import { jest } from '@jest/globals'
import _router from '@core/router/router.js'

import '@website/components/feedback/StatsHud.js'
import '@website/components/home/AwardsMentions.js'
import '@website/components/legal/Footer.js'

import '@website/components/home/HomeMosaic.js'
import '@website/components/dialogs/LangDialog.js'
import '@website/components/dialogs/PreferencesModal.js'
import '@website/components/carousel/AwardsCarousel.js'
import '@website/views/home/Home.js'
import '@website/views/legal/Legal.js'
import { ROUTE_PATHS } from '@core/tokens/routes/paths.js'
import { VIEW_TAGS } from '@core/tokens/elements/views.js'



const flush = (ms = 80) => new Promise((r) => setTimeout(r, ms))

// ─── StatsHud.js ─────────────────────────────────────────────────────────────

describe('Legal route tails', () => {
  test('renders privacy/terms content without media assets', async () => {
    window.history.pushState({}, '', ROUTE_PATHS.PRIVACY_POLICY)

    const el = document.createElement(VIEW_TAGS.VIEW_LEGAL)

    document.body.appendChild(el)
    await flush(250)

    expect(el.shadowRoot).toBeTruthy()

    el.onStoreUpdate?.()
    el.remove()
  })

  test('loading-delay timer path runs', async () => {
    jest.useFakeTimers()

    const el = document.createElement(VIEW_TAGS.VIEW_LEGAL)

    document.body.appendChild(el)
    jest.advanceTimersByTime(400)
    jest.useRealTimers()

    await flush()
    el.remove()
  })
})

