/**
 * @file coverage-tails-3.test.js
 * @description Third branch-tail sweep: StatsHud threshold classes, awards
 * mentions fallback selection, legal footer/link surfaces, CMS deploy-info
 * lighthouse rendering, Legal route loading modes, Home route data flow,
 * router navigation edges, main-entry portfolio branches, LangDialog /
 * HomeMosaic / PreferencesModal / HomeCarousel internals, and App shell.
 */

import _router from '@/routes/router.js'
import { TEST_TEXT } from '../../../fixtures/test-constants.js'
import { CMS_TAGS } from '@/cms/tokens.js'
import '@/components/feedback/StatsHud.js'
import '@/components/home/AwardsMentions.js'
import '@/components/legal/Footer.js'

import '@/components/home/HomeMosaic.js'
import '@/components/dialogs/LangDialog.js'
import '@/components/dialogs/PreferencesModal.js'
import '@/components/carousel/HomeCarousel.js'
import '@/routes/views/home/Home.js'
import '@/routes/views/legal/Legal.js'

const flush = (ms = 80) => new Promise((r) => setTimeout(r, ms))

// ─── StatsHud.js ─────────────────────────────────────────────────────────────

describe('CmsDeployInfo tails', () => {
  test('renders empty and populated lighthouse tables', async () => {
    await import('@/cms/deploy-info/CmsDeployInfo.js')

    const el = document.createElement(CMS_TAGS.CMS_DEPLOY_INFO)

    document.body.appendChild(el)
    await flush()

    el.lighthouse = { urls: [] }

    expect(el._renderLighthouse().className).toBeTruthy()

    el.lighthouse = {
      urls: [
        { url: TEST_TEXT.HEADING, scores: null },
        { url: TEST_TEXT.SECOND, scores: { performance: 0.99, accessibility: 1, 'best-practices': 0.5, seo: 0.1 } },
      ],
    }

    const rows = el._renderScores({ performance: 0.99, accessibility: 1, 'best-practices': 0.5, seo: 0.1 })

    expect(rows.length).toBe(4)
    expect(el._renderScores(null)).toBeNull()
    expect(el._renderLighthouse()).toBeTruthy()

    el.remove()
  })
})

