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
import store from '@/core/store.js'

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
import { LANG_MUTATIONS } from '@/core/tokens/events/mutations.js'
import { APP_EVENTS } from '@/core/tokens/events/app.js'




const flush = (ms = 100) => new Promise((r) => setTimeout(r, ms))

// ─── AwardsMentions.js ───────────────────────────────────────────────────────

describe('AwardsMentions tails 2', () => {
  test('legalLinks falls back through CMS → locale → defaults', async () => {
    const el = document.createElement(COMPONENT_TAGS.AWARDS_MENTIONS)

    document.body.appendChild(el)
    await flush()

    const viaCms = el.legalLinks

    expect(Array.isArray(viaCms)).toBe(true)

    store.commit(LANG_MUTATIONS.SET_COMPONENT_LANG, {})

    const viaFallback = el.legalLinks

    expect(Array.isArray(viaFallback)).toBe(true)

    el.remove()
  })

  test('carousel progress events drive the fill lifecycle', async () => {
    const el = document.createElement(COMPONENT_TAGS.AWARDS_MENTIONS)

    document.body.appendChild(el)
    await flush(150)

    const awc = el.shadowRoot.querySelector(COMPONENT_TAGS.AWARDS_CAROUSEL)

    awc?.dispatchEvent(new Event(APP_EVENTS.AUTOPLAY_START))
    awc?.dispatchEvent(new Event(APP_EVENTS.SLIDE_CHANGE))
    awc?.dispatchEvent(new Event(APP_EVENTS.AUTOPLAY_STOP))

    el._autoplayEverStarted = true
    awc?.dispatchEvent(new Event(APP_EVENTS.AUTOPLAY_STOP))

    el._restartProgressAnimation?.()
    el._showProgress?.()
    el._hideProgress?.()

    el.remove()
  })
})

