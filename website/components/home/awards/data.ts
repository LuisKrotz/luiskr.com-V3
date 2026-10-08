/**
 * @file home/awards/data.ts
 * @description Data helpers for <awards-mentions>: the legal-links list
 * (CMS list preferred, bundled fallback otherwise — bare locale-root
 * entries are filtered since the CMS stores the home link in the same
 * list but the footer should only show real legal destinations) and the
 * SWR fetch that populates the components dictionary.
 */

import { CMS_KEYS } from '@core/tokens/data/cms-keys.js'
import { LANG_MUTATIONS } from '@core/tokens/events/mutations.js'
import { LOCALES } from '@core/tokens/locales.js'
import { DB_PATHS } from '@core/tokens/routes/paths.js'
import store from '@core/store.js'
import { fetchFirebaseDb } from '@core/utils/data/db.js'
import { getFallbackLegalLinks } from '@core/utils/data/legal-links.js'
import type { AwardsMentions } from '../AwardsMentions.js'
import { devError } from '@core/devlog.js'

/** A CMS-stored link row — both fields optional at the data boundary. */
export interface AwardLink {
  /** Destination URL/path. */
  link?: string
  /** Page name the link points at (used for the visible label). */
  page?: string
}

/** A validated legal link — both fields proven present by the filter. */
export interface LegalLink {
  /** Destination path (e.g. '/en/legal/privacy'). */
  link: string
  /** Page key used for the localized label. */
  page: string
}

/**
 * Bare locale-root matcher ('/', '/en/', '/pt/') — the CMS stores the home
 * link in the same list, but the footer must only show real legal pages.
 */
const HAS_LINK = /^\/[a-z]{0,3}\/?$/

/**
 * Legal-page links for the footer row — CMS `legal-footer` list preferred,
 * bundled per-locale fallback when empty. Both lists are filtered through
 * HAS_LINK so a bare locale-root row (the stored home link) never renders.
 * @returns Validated {link, page} rows.
 */
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

/**
 * Loads the components dictionary node for the current locale when missing
 * (stale-while-revalidate) — commits SET_COMPONENT_LANG so the footer
 * links/mentions re-render once the snapshot lands.
 * @param _el The AwardsMentions element (unused — data flows via the store).
 */
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
