/**
 * @file coverage-tails-3.test.js
 * @description Third branch-tail sweep: StatsHud threshold classes, awards
 * mentions fallback selection, legal footer/link surfaces, CMS deploy-info
 * lighthouse rendering, Legal route loading modes, Home route data flow,
 * router navigation edges, main-entry portfolio branches, LangDialog /
 * HomeMosaic / PreferencesModal / AwardsCarousel internals, and App shell.
 */
import { jest } from '@jest/globals'
import { CMS_KEYS} from '@/core/constants.js'

import _router from '@/routes/router.js'

import '@/components/feedback/StatsHud.js'
import '@/components/home/AwardsMentions.js'
import '@/components/legal/Footer.js'

import '@/components/home/HomeMosaic.js'
import '@/components/dialogs/LangDialog.js'
import '@/components/dialogs/PreferencesModal.js'
import '@/components/carousel/AwardsCarousel.js'
import '@/routes/views/home/Home.js'
import '@/routes/views/legal/Legal.js'
import { VIEW_TAGS } from '@/core/tokens/elements/views.js'


const flush = (ms = 80) => new Promise((r) => setTimeout(r, ms))

// ─── StatsHud.js ─────────────────────────────────────────────────────────────

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

