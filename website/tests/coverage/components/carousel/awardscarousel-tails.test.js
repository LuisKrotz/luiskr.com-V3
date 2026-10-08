/**
 * @file awardscarousel-tails.test.js
 * @description Split from coverage-tails-3.test.js — covers the "AwardsCarousel tails" describe.
 */
import _router from '@core/router/router.js'
import { TEST_PROJECTS } from '@tests/fixtures/test-constants.js'

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

describe('AwardsCarousel tails', () => {
  test('renders empty state and item list variants', async () => {
    const el = document.createElement(COMPONENT_TAGS.AWARDS_CAROUSEL)

    document.body.appendChild(el)
    await flush()

    el.items = []
    el.items = [{ slug: TEST_PROJECTS.CICB }]
    el.translations = null

    await flush()
    el.remove()
  })
})
