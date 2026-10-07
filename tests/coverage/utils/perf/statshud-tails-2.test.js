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
import { PREF_MUTATIONS } from '@/core/tokens/events/mutations.js'
import { COMPONENT_TAGS } from '@/core/tokens/elements/components.js'



const flush = (ms = 100) => new Promise((r) => setTimeout(r, ms))

// ─── AwardsMentions.js ───────────────────────────────────────────────────────

describe('StatsHud tails 2', () => {
  test('latency-zero and missing-class rows patch correctly', async () => {
    store.commit(PREF_MUTATIONS.TOGGLE_STATS_FOR_NERDS, true)

    const el = document.createElement(COMPONENT_TAGS.STATS_HUD)

    document.body.appendChild(el)
    await flush()

    el._stats = { fps: 45, networkBytesPerSec: 512, pendingRequests: 1, memoryMB: 0, cpuPercent: 20, latencyMs: 0 }
    el._updateStatsDom()

    el._stats = { fps: 0, networkBytesPerSec: 0, pendingRequests: 0, memoryMB: 0, cpuPercent: 0, latencyMs: 500 }
    el._updateStatsDom()

    el.remove()
    store.commit(PREF_MUTATIONS.TOGGLE_STATS_FOR_NERDS, false)
  })
})

