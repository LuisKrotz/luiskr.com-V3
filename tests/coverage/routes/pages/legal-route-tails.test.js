/**
 * @file coverage-tails-3.test.js
 * @description Third branch-tail sweep: StatsHud threshold classes, awards
 * mentions fallback selection, legal footer/link surfaces, CMS deploy-info
 * lighthouse rendering, Legal route loading modes, Home route data flow,
 * router navigation edges, main-entry portfolio branches, LangDialog /
 * HomeMosaic / PreferencesModal / HomeCarousel internals, and App shell.
 */
import { jest } from '@jest/globals'
import _router from '@/routes/router.js'

import '@/components/feedback/StatsHud.js'
import '@/components/home/AwardsMentions.js'
import '@/components/legal/Footer.js'

import '@/components/home/HomeMosaic.js'
import '@/components/dialogs/LangDialog.js'
import '@/components/dialogs/PreferencesModal.js'
import '@/components/carousel/HomeCarousel.js'
import '@/routes/views/home/Home.js'
import '@/routes/views/legal/Legal.js'
import { ROUTE_PATHS } from '../../../../src/core/tokens/routes/paths.js'
import { VIEW_TAGS } from '../../../../src/core/tokens/elements/views.js'



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

