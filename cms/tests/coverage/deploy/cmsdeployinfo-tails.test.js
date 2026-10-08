/**
 * @file cmsdeployinfo-tails.test.js
 * @description Split from coverage-tails-3.test.js — covers the "CmsDeployInfo tails" describe.
 */
import _router from '@core/router/router.js'
import { TEST_TEXT } from '@tests/fixtures/test-constants.js'
import { CMS_TAGS } from '@cms/tokens.js'
import '@website/components/feedback/StatsHud.js'
import '@website/components/home/AwardsMentions.js'
import '@website/components/legal/Footer.js'

import '@website/components/home/HomeMosaic.js'
import '@website/components/dialogs/LangDialog.js'
import '@website/components/dialogs/PreferencesModal.js'
import '@website/components/carousel/AwardsCarousel.js'
import '@website/views/home/Home.js'
import '@website/views/legal/Legal.js'

const flush = (ms = 80) => new Promise((r) => setTimeout(r, ms))

describe('CmsDeployInfo tails', () => {
  test('renders empty and populated lighthouse tables', async () => {
    await import('@cms/deploy-info/CmsDeployInfo.js')

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
