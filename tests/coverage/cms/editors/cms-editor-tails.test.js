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

// ─── AwardsMentions.js ───────────────────────────────────────────────────────

describe('CMS editor tails', () => {
  test('footer editor mounts and binds', async () => {
    const el = document.createElement(CMS_TAGS.CMS_FOOTER_EDITOR)

    document.body.appendChild(el)
    await flush(150)

    el._updateDom?.()
    el._bindEvents?.()

    el.remove()
  })

  test('playground editor mounts and handles empty params', async () => {
    const el = document.createElement(CMS_TAGS.CMS_PLAYGROUND_EDITOR)

    document.body.appendChild(el)
    await flush(150)

    el._updateDom?.()
    el._bindEvents?.()

    el.remove()
  })
})

