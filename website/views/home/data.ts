/**
 * @file routes/views/home/data.ts
 * @description Data loading for <view-home>: three SWR sources fetched
 * in parallel — pages/home (mosaic list + portfolio store + JSON-LD),
 * components/projects (canonical featured flags) and pages/about +
 * profilePicture. Every resolution pushes to children immediately so
 * partial arrivals progressively fill the page.
 */

import { CMS_KEYS } from '@core/tokens/data/cms-keys.js'
import { DATA_MUTATIONS } from '@core/tokens/events/mutations.js'
import { LOCALES } from '@core/tokens/locales.js'
import { DB_PATHS } from '@core/tokens/routes/paths.js'
import { TRANSLATION_KEYS } from '@core/tokens/routes/translation-keys.js'
import store from '@core/store.js'
import { FALLBACK_PAGES } from '@core/locale/fallback.js'
import {
  generateWebsiteSchema,
  generateCarouselItemListSchema,
  updateJsonLd,
} from '@core/utils/index.js'
import { fetchFirebaseDb } from '@core/utils/data/db.js'
import type { DbSnapshot } from '@core/utils/data/db.js'
import type { ViewHome } from './Home.js'
import type { AboutNode, HomeTranslations, PortfolioItem } from './types.js'
import { devError } from '@core/devlog.js'

/**
 * Featured detection accepts three sources: explicit boolean/string/1
 * on the item itself (CMS stores typed values loosely), or membership
 * in featuredLinks — the set built from components/projects entries
 * flagged at the canonical source. Either path spans the tile 2 cols.
 */
export function isFeatured(view: ViewHome, item: PortfolioItem): boolean {
  if (!item) return false

  if (item.featured === true || item.featured === 'true' || item.featured === 1) return true

  return Boolean(item.link && view.featuredLinks.has(item.link))
}

/**
 * Projects list reshaped for the mosaic. The DB stores portfoliolist
 * as either an array or a keyed object (locale-dependent), so both
 * shapes normalize to an array; each item gets a computed `featured`
 * flag driving the 2-column span in the masonry layout.
 */
export function processedItems(view: ViewHome): PortfolioItem[] {
  if (!view.translations?.portfoliolist) return []

  const raw: PortfolioItem[] = Array.isArray(view.translations.portfoliolist)
    ? view.translations.portfoliolist
    : Object.values(view.translations.portfoliolist)

  return raw.map((item) => ({ ...item, featured: view.isFeatured(item) }))
}

/** Applies the pages/home snapshot: store commit, JSON-LD, re-render. */
function applyHomeSnapshot(view: ViewHome, homeSnap: DbSnapshot): void {
  if (!homeSnap?.exists()) return

  view.translations = homeSnap.val() as HomeTranslations

  if (view.translations?.portfoliolist) {
    store.commit(DATA_MUTATIONS.SET_PORTFOLIO_LIST, view.translations.portfoliolist)
  }

  const carouselSchema = generateCarouselItemListSchema(view.processedItems)

  const homeGraph = [...generateWebsiteSchema()]

  if (carouselSchema) homeGraph.push(carouselSchema)

  updateJsonLd(homeGraph)

  view._updateDom()

  view._passDataToChildren()
}

/** Loads the three home data sources in parallel via SWR. */
export function loadHomeData(view: ViewHome): void {
  const lang = store.getters.getlang()

  const currentLocale = lang.locale || LOCALES.EN

  view._lastLocale = currentLocale

  const basePath = lang.database + currentLocale

  const homePath = basePath + lang.pagesPath + CMS_KEYS.HOME

  const projectsPath = basePath + DB_PATHS.COMPONENTS_RELATED_PROJECTS

  const aboutPath = basePath + lang.pagesPath + CMS_KEYS.ABOUT

  const picPath = basePath + lang.pagesPath + CMS_KEYS.ABOUT + '/profilePicture'

  fetchFirebaseDb(homePath, (snap) => applyHomeSnapshot(view, snap))
    .then((snap) => applyHomeSnapshot(view, snap))
    .catch(devError)

  fetchFirebaseDb(projectsPath)
    .then((projectsSnap) => {
      if (projectsSnap?.exists()) {
        const links = new Set<string>()

        Object.values(
          projectsSnap.val() as Record<string, { featured?: unknown; link?: string }>
        ).forEach((p) => {
          if (p.featured === true && p.link) links.add(p.link)
        })

        view.featuredLinks = links

        view._passDataToChildren()
      }
    })
    .catch(devError)

  Promise.all([fetchFirebaseDb(aboutPath), fetchFirebaseDb(picPath)])
    .then(([aboutSnap, picSnap]) => {
      if (aboutSnap?.exists()) {
        const about = aboutSnap.val() as AboutNode

        view.aboutTranslations = about

        store.commit(DATA_MUTATIONS.SET_MENTIONS, {
          title:
            about.mentions ??
            (FALLBACK_PAGES[TRANSLATION_KEYS.ABOUT] as { mentions?: string } | undefined)?.mentions,
          items: about.mention_items ?? [],
        })
      }

      if (picSnap?.exists()) {
        view.profilePicture = picSnap.val() as string
      }

      view._updateDom()

      view._passDataToChildren()
    })
    .catch(devError)
}

/** Store change → reload all data on locale switch. */
export function onHomeStoreUpdate(view: ViewHome): void {
  const currentLocale = store.getters.getLang()

  if (view._lastLocale && view._lastLocale !== currentLocale) {
    view._lastLocale = currentLocale

    view.loadData()
  }
}
