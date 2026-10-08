/**
 * @file homemosaic-tails.test.js
 * @description Split from coverage-tails-3.test.js — covers the "HomeMosaic tails" describe.
 */
import _router from '@core/router/router.js'
import { TEST_TEXT } from '@tests/fixtures/test-constants.js'

import '@website/components/feedback/StatsHud.js'
import '@website/components/home/AwardsMentions.js'
import '@website/components/legal/Footer.js'

import '@website/components/home/HomeMosaic.js'
import '@website/components/dialogs/LangDialog.js'
import '@website/components/dialogs/PreferencesModal.js'
import '@website/components/carousel/AwardsCarousel.js'
import '@website/views/home/Home.js'
import '@website/views/legal/Legal.js'
import { COMPONENT_TAGS } from '@core/tokens/elements/components.js'

const flush = (ms = 80) => new Promise((r) => setTimeout(r, ms))

describe('HomeMosaic tails', () => {
  test('setter fallbacks and render without processed items', async () => {
    const el = document.createElement(COMPONENT_TAGS.HOME_MOSAIC)

    document.body.appendChild(el)
    await flush()

    el.processedItems = null
    el.processedItems = []
    el.translations = null
    el.translations = { portfoliolist: { title: TEST_TEXT.HEADING } }

    await flush()
    el.remove()
  })
})
