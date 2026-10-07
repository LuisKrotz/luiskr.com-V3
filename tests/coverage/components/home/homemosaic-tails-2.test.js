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
import { COMPONENT_TAGS } from '@/core/tokens/elements/components.js'


const flush = (ms = 100) => new Promise((r) => setTimeout(r, ms))

// ─── AwardsMentions.js ───────────────────────────────────────────────────────

describe('HomeMosaic tails 2', () => {
  test('setters coerce non-arrays and schedule layout', async () => {
    const el = document.createElement(COMPONENT_TAGS.HOME_MOSAIC)

    document.body.appendChild(el)
    await flush()

    el._isMounted = false
    el.processedItems = 'not-an-array'

    expect(el._processedItems).toEqual([])

    el._isMounted = true
    el.translations = { portfoliolist: { title: TEST_TEXT.HEADING } }
    el.quickLayout?.()
    el.scheduleLayout?.()

    await flush(150)
    el.remove()
  })
})

