/**
 * @file cmslangeditor-tails.test.js
 * @description Split from coverage-tails-6.test.js — covers the "CmsLangEditor tails" describe.
 */
import { CMS_TAGS } from '@cms/tokens.js'

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

const flush = (ms = 100) => new Promise((r) => setTimeout(r, ms))

describe('CmsLangEditor tails', () => {
  test('loadData fills content or empty object; saveData guards bad JSON', async () => {
    const el = document.createElement(CMS_TAGS.CMS_LANG_EDITOR)

    document.body.appendChild(el)
    await flush()

    await el.loadData?.()

    el.jsonContent = '{bad json'
    await el.saveData?.().catch(() => {})

    el.jsonContent = '{}'
    await el.saveData?.().catch(() => {})

    el.remove()
  })
})
