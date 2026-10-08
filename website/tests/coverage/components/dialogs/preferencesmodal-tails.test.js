/**
 * @file preferencesmodal-tails.test.js
 * @description Split from coverage-tails-3.test.js — covers the "PreferencesModal tails" describe.
 */
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
import { COMPONENT_TAGS } from '@core/tokens/elements/components.js'

const flush = (ms = 80) => new Promise((r) => setTimeout(r, ms))

describe('PreferencesModal tails', () => {
  test('open/close and toggle commit paths', async () => {
    const el = document.createElement(COMPONENT_TAGS.PREFERENCES_MODAL)

    document.body.appendChild(el)
    await flush()

    el.open = true
    await flush()

    el._updateDom?.()
    el.open = false
    el.onStoreUpdate?.()

    el.remove()
  })
})
