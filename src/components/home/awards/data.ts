/**
 * @file home/awards/data.ts
 * @description Data helpers for <awards-mentions>: the legal-links list
 * (CMS list preferred, bundled fallback otherwise — bare locale-root
 * entries are filtered since the CMS stores the home link in the same
 * list but the footer should only show real legal destinations) and the
 * SWR fetch that populates the components dictionary.
 */

import { CMS_KEYS } from '@/core/tokens/data/cms-keys.js'
import { LANG_MUTATIONS } from '@/core/tokens/events/mutations.js'
import { LOCALES } from '@/core/tokens/locales.js'
import { DB_PATHS } from '@/core/tokens/routes/paths.js'
import store from '@/core/store.js'
import { fetchFirebaseDb } from '@/utils/data/db.js'
import { getFallbackLegalLinks } from '@/utils/data/legal-links.js'
import type { AwardsMentions } from '../AwardsMentions.js'
import { devError } from '@/core/devlog.js'

/**
 * Type contract for AwardLink — the shape consumers rely on.
 */
export interface AwardLink {
  link?: string
  page?: string
}

/**
 * Type contract for LegalLink — the shape consumers rely on.
 */
export interface LegalLink {
  link: string
  page: string
}

const HAS_LINK = /^\/[a-z]{0,3}\/?$/

/** Legal-page links for the footer row (CMS preferred, fallback otherwise). */
export function legalLinks(): LegalLink[] {
  const components = store.getters.getlang()?.components as
    Record<string, { links?: AwardLink[] }> | undefined

  const all = components?.[CMS_KEYS.LEGAL_FOOTER]?.links || []

  const filtered = all.filter((l): l is LegalLink =>
    Boolean(l.link && l.page && !l.link.match(HAS_LINK))
  )

  if (filtered.length) return filtered

  const locale = store.getters.getLang()

  return getFallbackLegalLinks(locale).filter((l): l is LegalLink =>
    Boolean(l.link && l.page && !l.link.match(HAS_LINK))
  )
}

/** Loads the mentions + legal-links nodes when missing (SWR). */
export function ensureAwardsData(_el: AwardsMentions): void {
  const lang = store.getters.getlang()

  const locale = lang?.locale || LOCALES.EN

  const dbpath = `${lang?.database || DB_PATHS.TRANSLATIONS}${locale}/components`

  fetchFirebaseDb(dbpath)
    .then((snapshot) => {
      if (snapshot?.exists()) {
        store.commit(LANG_MUTATIONS.SET_COMPONENT_LANG, snapshot.val())
      }
    })
    .catch(devError)
}
