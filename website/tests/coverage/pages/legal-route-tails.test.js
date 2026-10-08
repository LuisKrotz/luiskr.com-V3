/**
 * @file legal-route-tails.test.js
 * @description Split from coverage-tails-3.test.js — covers the "Legal route tails" describe.
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
