/**
 * @file utils/data/legal-links.ts
 * @description Builds the bundled legal link list (home / privacy / GDPR /
 * terms) for a locale. Shared by <legal-footer> and <awards-mentions> —
 * lives in utils so neither component depends on the other's folder.
 * Destinations resolve through LANG_SLUGS so localized paths work offline;
 * labels come from the components dictionary, index-aligned with slugFor.
 */

import { LANG_SLUGS } from '@/core/i18n.js'
import type { LangSlugMap } from '@/core/i18n.js'
import { LOCALES } from '@/core/tokens/locales.js'
import { ROUTE_PATHS } from '@/core/tokens/routes/paths.js'
import { CHAR_STRINGS } from '@/core/tokens/strings/chars.js'
import { ROUTE_STRINGS } from '@/core/tokens/strings/routes.js'
import { componentText } from '@/core/locale/ui-text.js'
import { LEGAL_COMPONENT_KEYS } from '@/core/tokens/data/component-keys.js'

/** A legal footer entry: localized path + human label. */
export interface LegalLink {
  link: string
  page: string
}

/**
 * Gets fallback legal links.
 * @param locale — the locale
 * @returns LegalLink[]
 */
export function getFallbackLegalLinks(locale: string = LOCALES.EN): LegalLink[] {
  const slugs: LangSlugMap = LANG_SLUGS[locale] || LANG_SLUGS.en

  const base = locale === LOCALES.EN ? CHAR_STRINGS.EMPTY : `${ROUTE_PATHS.ROOT}${locale}`

  // Labels come from the components dictionary (live locale, else the EN snapshot)
  const labels =
    (componentText(LEGAL_COMPONENT_KEYS.LEGAL_LINKS) as Array<{ page?: string }> | undefined) || []

  const slugFor = [
    CHAR_STRINGS.EMPTY,
    slugs.privacy || ROUTE_STRINGS.PRIVACY_POLICY,
    slugs.gdpr || ROUTE_STRINGS.GDPR,
    slugs.terms || ROUTE_STRINGS.TERMS_OF_USE,
  ]

  return slugFor.map((slug, i) => ({
    link: `${base}${ROUTE_PATHS.ROOT}${slug}`,
    page: labels[i]?.page || CHAR_STRINGS.EMPTY,
  }))
}
