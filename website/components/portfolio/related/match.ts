/**
 * @file portfolio/related/match.ts — joins the related node's
 * {link, page, featured} pointers against the home portfoliolist (the
 * image/description join table) into display-ready RelatedCards.
 *
 * The fuzzy matcher normalizes every candidate string (lowercase, strip
 * non-alphanumerics) and accepts:
 *   1. exact link or image-name equality,
 *   2. link/image substring containment in either direction,
 *   3. label/title vs page substring containment.
 * Loose matching is deliberate — CMS authors type links inconsistently
 * (with/without slashes, project names vs image basenames).
 */

import { ATTR_VALUES } from '@core/tokens/attrs/values.js'
import { LOCALES } from '@core/tokens/locales.js'
import { MEDIA } from '@core/tokens/media/suffixes.js'
import { DB_PATHS, ROUTE_PATHS } from '@core/tokens/routes/paths.js'
import { CHAR_STRINGS } from '@core/tokens/strings/chars.js'
import store from '@core/store.js'
import type { HomeItem, RelatedCard, RelatedProject, RelatedTranslations } from './types.js'

/** Lowercases + strips non-alphanumerics — the matcher's normalization. */
const normalize = (s: string): string => s.toLowerCase().replace(/[^a-z0-9]/g, CHAR_STRINGS.EMPTY)

/** Strips leading /projects/, /portfolio/ or lone slash plus a trailing slash — the DB mixes all three forms. */
const cleanLink = (link: string | undefined): string =>
  link
    ? link
        .replace(/^(\/projects\/|\/portfolio\/|\/)/, CHAR_STRINGS.EMPTY)
        .replace(/\/$/, CHAR_STRINGS.EMPTY)
    : CHAR_STRINGS.EMPTY

/** One related row vs one home item — the three acceptance rules. */
function matches(h: HomeItem | undefined, cLink: string, pPage: string): boolean {
  if (!h) return false

  const hLink = normalize(h.link || CHAR_STRINGS.EMPTY)

  const hImg = normalize(h.image || CHAR_STRINGS.EMPTY)

  const hLabel = normalize(h.label || h.title || CHAR_STRINGS.EMPTY)

  if (hLink && cLink && (hLink === cLink || hImg === cLink)) return true

  if (hLink && (cLink.includes(hLink) || hLink.includes(cLink))) return true

  if (hImg && (cLink.includes(hImg) || hImg.includes(cLink))) return true

  if (hLabel && pPage && (hLabel.includes(pPage) || pPage.includes(hLabel))) return true

  return false
}

/**
 * Maps the DB `related.projects` rows into display-ready cards.
 *
 * URL build: [{locale}/]{basePath}/{cleanLink} — basePath may or may not
 * arrive slash-prefixed, so the pieces are joined defensively rather
 * than trusting CMS formatting.
 */
export function buildProjectsList(
  translations: RelatedTranslations,
  homePortfolio: HomeItem[],
  storage: string
): RelatedCard[] {
  if (!translations?.projects) return []

  const rawProjects: RelatedProject[] = Array.isArray(translations.projects)
    ? translations.projects
    : Object.values(translations.projects)

  const basePath: string = translations.path || ROUTE_PATHS.PORTFOLIO_SLASH

  const homeList = (
    store.state.portfoliolist?.length ? store.state.portfoliolist : homePortfolio
  ) as HomeItem[]

  const locale = store.getters.getLang()

  // EN lives at the root; every other locale gets a /{locale} prefix.
  const locPfx =
    locale && locale !== LOCALES.EN ? `${ROUTE_PATHS.ROOT}${locale}` : CHAR_STRINGS.EMPTY

  return rawProjects.map((p) => {
    const link = cleanLink(p.link)

    const cLink = normalize(link)

    const pPage = normalize(p.page || p.title || CHAR_STRINGS.EMPTY)

    const homeMatch = homeList.find((h) => matches(h, cLink, pPage))

    // Cover image basename: prefer the home card's image, then the
    // related row's own field, then the slug as a last resort.
    const image = homeMatch?.image || p.image || link

    const fullPath =
      locPfx +
      (basePath.startsWith(ROUTE_PATHS.ROOT) ? CHAR_STRINGS.EMPTY : ROUTE_PATHS.ROOT) +
      basePath.replace(/\/$/, CHAR_STRINGS.EMPTY) +
      ROUTE_PATHS.ROOT +
      link

    return {
      page: p.page || homeMatch?.label || homeMatch?.title || link,
      link,
      fullPath,
      featured: p.featured === true,
      imageSrc: `${storage}${DB_PATHS.COVERS}${image}${MEDIA.EXT}`,
      description: homeMatch?.description || p.description || ATTR_VALUES.EMPTY,
    }
  })
}
