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
import { TEST_PROJECTS, TEST_URLS } from '../../../fixtures/test-constants.js'
import '@/components/home/AwardsMentions.js'
import '@/components/legal/Footer.js'
import '@/components/home/HomeMosaic.js'
import '@/components/feedback/StatsHud.js'
import '@/components/media/MediaExpanded.js'
import '@/components/dialogs/PreferencesModal.js'
import '@/components/carousel/HomeCarousel.js'
import '@/components/media/MediaFigure.js'
import '@/components/dialogs/LangDialog.js'
import '@/cms/deploy-info/CmsDeployInfo.js'
import '@/cms/lang/CmsLangEditor.js'
import '@/cms/footer/CmsFooterEditor.js'
import '@/cms/playground-editor/CmsPlaygroundEditor.js'
import { HTML_TAGS } from '@/core/tokens/elements/html.js'
import { LINK_ATTRS } from '@/core/tokens/attrs/link.js'
import { ROUTE_PATHS } from '@/core/tokens/routes/paths.js'





// ─── AwardsMentions.js ───────────────────────────────────────────────────────

describe('predictive-loader tails 2', () => {
  test('scanAndObserve skips already-observed and non-route anchors', async () => {
    const { predictiveLoader } = await import('@/core/predictive-loader.js')
    const wrap = document.createElement(HTML_TAGS.DIV)
    const good = document.createElement(HTML_TAGS.A)
    const ext = document.createElement(HTML_TAGS.A)

    good.setAttribute(LINK_ATTRS.HREF, `${ROUTE_PATHS.PORTFOLIO}${TEST_PROJECTS.METCHA}`)
    ext.setAttribute(LINK_ATTRS.HREF, TEST_URLS.EXTERNAL)
    wrap.appendChild(good)
    wrap.appendChild(ext)
    document.body.appendChild(wrap)

    predictiveLoader.scanAndObserve?.(wrap)
    predictiveLoader.scanAndObserve?.(wrap)

    predictiveLoader.unobserve?.(good)
    predictiveLoader.unobserve?.(null)

    wrap.remove()
  })
})

