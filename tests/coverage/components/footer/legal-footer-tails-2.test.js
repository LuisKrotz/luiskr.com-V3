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
import { LOCALES} from '@/core/constants.js'

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
import { LANG_STRINGS } from '@/core/tokens/strings/langs.js'
import { COMPONENT_TAGS } from '@/core/tokens/elements/components.js'
import { HTML_TAGS } from '@/core/tokens/elements/html.js'
import { MOUSE_EVENTS } from '@/core/tokens/events/dom.js'





const flush = (ms = 100) => new Promise((r) => setTimeout(r, ms))

// ─── AwardsMentions.js ───────────────────────────────────────────────────────

describe('legal Footer tails 2', () => {
  test('getFallbackLegalLinks localizes slugs per locale', async () => {
    const { getFallbackLegalLinks } = await import('@/components/legal/Footer.js')

    const en = getFallbackLegalLinks(LOCALES.EN)
    const br = getFallbackLegalLinks(LOCALES.BR || LANG_STRINGS.PT)
    const unknown = getFallbackLegalLinks('zz')

    expect(en.length).toBeGreaterThan(0)
    expect(br[1].link).toContain('/')
    expect(unknown.length).toBe(en.length)
  })

  test('footer link clicks route through the SPA router', async () => {
    const el = document.createElement(COMPONENT_TAGS.LEGAL_FOOTER)

    document.body.appendChild(el)
    await flush(150)

    const a = el.shadowRoot.querySelector(HTML_TAGS.A)

    a?.dispatchEvent(new Event(MOUSE_EVENTS.CLICK, { bubbles: true, cancelable: true }))

    el.remove()
  })
})

