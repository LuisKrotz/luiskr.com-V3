/**
 * @file homemosaic-tails-2.test.js
 * @description Split from coverage-tails-6.test.js — covers the "HomeMosaic tails 2" describe.
 */
import { TEST_TEXT } from '@tests/fixtures/test-constants.js'
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
import { COMPONENT_TAGS } from '@core/tokens/elements/components.js'

const flush = (ms = 100) => new Promise((r) => setTimeout(r, ms))

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
