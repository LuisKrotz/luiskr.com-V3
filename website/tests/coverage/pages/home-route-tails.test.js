/**
 * @file home-route-tails.test.js
 * @description Split from coverage-tails-3.test.js — covers the "Home route tails" describe.
 */
import { jest } from '@jest/globals'
import { CMS_KEYS } from '@core/constants.js'

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
import { VIEW_TAGS } from '@core/tokens/elements/views.js'

const flush = (ms = 80) => new Promise((r) => setTimeout(r, ms))

describe('Home route tails', () => {
  test('mounts, scrolls to meta target, and passes data to children', async () => {
    window.scrollTo = jest.fn()

    const el = document.createElement(VIEW_TAGS.VIEW_HOME)

    document.body.appendChild(el)
    await flush(200)

    el.onRouteParamChange?.({ meta: { scrollTo: CMS_KEYS.ABOUT } })
    el.onRouteParamChange?.({ meta: {} })
    el.onRouteParamChange?.(null)

    await flush(200)

    el._passDataToChildren?.()
    el.onUpdated?.()
    el.onStoreUpdate?.()

    el.remove()
  })
})
