/**
 * @file predictive-loader-tails-2.test.js
 * @description Split from coverage-tails-6.test.js — covers the "predictive-loader tails 2" describe.
 */
import { TEST_PROJECTS, TEST_URLS } from '@tests/fixtures/test-constants.js'
import '@website/components/home/AwardsMentions.js'
import '@website/components/legal/Footer.js'
import '@website/components/home/HomeMosaic.js'
import '@website/components/feedback/StatsHud.js'
import '@website/components/media/MediaExpanded.js'
import '@website/components/dialogs/PreferencesModal.js'
import '@website/components/carousel/AwardsCarousel.js'
import '@website/components/media/MediaFigure.js'
import '@website/components/dialogs/LangDialog.js'
import '@cms/deploy-info/CmsDeployInfo.js'
import '@cms/lang/CmsLangEditor.js'
import '@cms/footer/CmsFooterEditor.js'
import '@cms/playground-editor/CmsPlaygroundEditor.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { LINK_ATTRS } from '@core/tokens/attrs/link.js'
import { ROUTE_PATHS } from '@core/tokens/routes/paths.js'

describe('predictive-loader tails 2', () => {
  test('scanAndObserve skips already-observed and non-route anchors', async () => {
    const { predictiveLoader } = await import('@core/predictive-loader.js')
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
