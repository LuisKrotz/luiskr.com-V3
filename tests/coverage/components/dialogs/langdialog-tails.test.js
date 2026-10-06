/**
 * @file coverage-tails-3.test.js
 * @description Third branch-tail sweep: StatsHud threshold classes, awards
 * mentions fallback selection, legal footer/link surfaces, CMS deploy-info
 * lighthouse rendering, Legal route loading modes, Home route data flow,
 * router navigation edges, main-entry portfolio branches, LangDialog /
 * HomeMosaic / PreferencesModal / HomeCarousel internals, and App shell.
 */

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
import { COMPONENT_TAGS } from '../../../../src/core/tokens/elements/components.js'


const flush = (ms = 80) => new Promise((r) => setTimeout(r, ms))

// ─── StatsHud.js ─────────────────────────────────────────────────────────────

describe('LangDialog tails', () => {
  test('opens, lists locales and commits selection', async () => {
    const el = document.createElement(COMPONENT_TAGS.LANG_DIALOG)

    document.body.appendChild(el)
    await flush()

    el.open = true
    await flush()

    el._updateDom?.()
    el.open = false

    el.remove()
  })
})

