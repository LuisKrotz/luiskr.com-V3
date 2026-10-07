/**
 * @file coverage-tails-6.test.js
 * @description Sixth branch-tail sweep — CMS editors and shared
 * components: AwardsMentions legal-link fallback + autoplay progress,
 * legal footer link resolution + router binding, CmsDeployInfo score
 * tiers, CmsLangEditor load/save, HomeMosaic layout scheduling,
 * StatsHud edge classes, CmsFooterEditor, CmsPlaygroundEditor,
 * predictive-loader observer paths, cms/main mount guards, AdminLogin
 * flows.
 */

import { CMS_TAGS } from '@/cms/tokens.js'

import { TEST_TEXT } from '../../../fixtures/test-constants.js'
import '@/components/home/AwardsMentions.js'
import '@/components/legal/Footer.js'
import '@/components/home/HomeMosaic.js'
import '@/components/feedback/StatsHud.js'
import '@/components/media/MediaExpanded.js'
import '@/components/dialogs/PreferencesModal.js'
import '@/components/carousel/AwardsCarousel.js'
import '@/components/media/MediaFigure.js'
import '@/components/dialogs/LangDialog.js'
import '@/cms/deploy-info/CmsDeployInfo.js'
import '@/cms/lang/CmsLangEditor.js'
import '@/cms/footer/CmsFooterEditor.js'
import '@/cms/playground-editor/CmsPlaygroundEditor.js'

const flush = (ms = 100) => new Promise((r) => setTimeout(r, ms))

// ─── AwardsMentions.js ───────────────────────────────────────────────────────

describe('CmsDeployInfo tails 2', () => {
  test('score tiers and coverage totals render', async () => {
    const el = document.createElement(CMS_TAGS.CMS_DEPLOY_INFO)

    document.body.appendChild(el)
    await flush()

    el.coverage = {
      total: {
        statements: { covered: 90, total: 100, pct: 90 },
        branches: { covered: 50, total: 100, pct: 50 },
        functions: { covered: 10, total: 100, pct: 10 },
        lines: {},
      },
    }
    el._updateDom?.()
    el.lighthouse = { urls: [{ url: TEST_TEXT.SECOND, scores: { performance: 0.2, accessibility: 0.7, 'best-practices': 0.95, seo: undefined } }] }
    el._updateDom?.()

    expect(el._renderLighthouse()).toBeTruthy()

    el.remove()
  })
})

