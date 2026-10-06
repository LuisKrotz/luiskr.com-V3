/**
 * @file portfolio/data.ts — Firebase load/save + cross-locale structural sync.
 */

import { CMS_EVENTS } from '@/cms/tokens.js'
import { ATTR_VALUES } from '@/core/tokens/attrs/values.js'
import { DB_PATHS } from '@/core/tokens/routes/paths.js'
import { getDbInstance } from '@/firebase.js'
import { ref, child, get, set, type Database } from 'firebase/database'
import type { CmsPortfolioList } from './CmsPortfolioList.js'
import type { PortfolioItem } from './types.js'
import { COVER_DIMENSIONS, MOSAIC_DIMENSIONS } from '@/core/tokens/media/dimensions.js'
import { devError } from '@/core/devlog.js'

/** Featured flags propagate into the `related` node — same write in save + sync. */
async function syncRelatedFeatured(
  db: Database,
  items: PortfolioItem[],
  lang: string
): Promise<void> {
  const rSnap = await get(
    child(ref(db), `${DB_PATHS.TRANSLATIONS}${lang}/components/related/projects`)
  )
  if (rSnap.exists()) {
    const rVal = rSnap.val()
    const rArr = Array.isArray(rVal) ? JSON.parse(JSON.stringify(rVal)) : Object.values(rVal)
    const updatedRelated = rArr.map((p: PortfolioItem) => {
      const match = items.find((i) => i.link === p.link)
      return {
        ...p,
        featured: match ? match.featured === true : p.featured === true,
      }
    })
    await set(
      ref(db, `${DB_PATHS.TRANSLATIONS}${lang}/components/related/projects`),
      updatedRelated
    )
  }
}

/**
 * Loads lang portfolio.
 * @param host — the host component
 */
export async function loadLangPortfolio(host: CmsPortfolioList) {
  try {
    const db = await getDbInstance()
    const [pSnap, rSnap] = await Promise.all([
      get(child(ref(db), `${DB_PATHS.TRANSLATIONS}${host.selectedLang}/pages/HOME/portfoliolist`)),
      get(
        child(ref(db), `${DB_PATHS.TRANSLATIONS}${host.selectedLang}/components/related/projects`)
      ),
    ])

    const relatedMap: Record<string, boolean> = {}
    if (rSnap.exists()) {
      const rVal = rSnap.val()
      const rArr = Array.isArray(rVal) ? rVal : Object.values(rVal)
      rArr.forEach((p) => {
        if (p.link) relatedMap[p.link] = p.featured === true
      })
    }

    if (pSnap.exists()) {
      const val = pSnap.val()
      const raw = Array.isArray(val) ? JSON.parse(JSON.stringify(val)) : Object.values(val)
      host.items = raw.map((item: PortfolioItem) => {
        const isFeat =
          item.featured !== undefined
            ? item.featured === true || (item.featured as unknown) === ATTR_VALUES.TRUE
            : item.link
              ? relatedMap[item.link] === true
              : false
        return {
          ...item,
          featured: isFeat,
          width: Array.isArray(item.width)
            ? [...item.width]
            : [COVER_DIMENSIONS.FHD_WIDTH_STR, MOSAIC_DIMENSIONS.MOSAIC_MOBILE_WIDTH_STR],
          height: Array.isArray(item.height)
            ? [...item.height]
            : [
                MOSAIC_DIMENSIONS.MOSAIC_DESKTOP_HEIGHT_STR,
                MOSAIC_DIMENSIONS.MOSAIC_MOBILE_HEIGHT_STR,
              ],
        }
      })
    } else {
      host.items = []
    }
    host._updateDom()
    host._bindEvents()
  } catch (err) {
    devError('Error loading portfolio list:', err)
  }
}

/**
 * Syncs non localized to all langs.
 * @param host — the host component
 */
export async function syncNonLocalizedToAllLangs(host: CmsPortfolioList) {
  if (
    !confirm(
      `Apply image filenames, dimensions (width/height), links, and featured flags to ALL ${host.languages.length} languages? (Localized labels and descriptions will be preserved)`
    )
  ) {
    return
  }

  host.saving = true
  host._updateDom()
  try {
    const db = await getDbInstance()
    for (const lang of host.languages) {
      if (lang === host.selectedLang) continue

      const pSnap = await get(
        child(ref(db), `${DB_PATHS.TRANSLATIONS}${lang}/pages/HOME/portfoliolist`)
      )
      let targetItems: PortfolioItem[] = []
      if (pSnap.exists()) {
        const val = pSnap.val()
        targetItems = Array.isArray(val) ? JSON.parse(JSON.stringify(val)) : Object.values(val)
      }

      const merged = host.items.map((srcItem, idx) => {
        const existing = targetItems[idx] || {}
        return {
          label: existing.label || srcItem.label,
          description: existing.description || srcItem.description,
          image: srcItem.image || '',
          link: srcItem.link || '',
          featured: srcItem.featured === true,
          width: Array.isArray(srcItem.width)
            ? [...srcItem.width]
            : [COVER_DIMENSIONS.FHD_WIDTH_STR, MOSAIC_DIMENSIONS.MOSAIC_MOBILE_WIDTH_STR],
          height: Array.isArray(srcItem.height)
            ? [...srcItem.height]
            : [
                MOSAIC_DIMENSIONS.MOSAIC_DESKTOP_HEIGHT_STR,
                MOSAIC_DIMENSIONS.MOSAIC_MOBILE_HEIGHT_STR,
              ],
        }
      })

      await set(ref(db, `${DB_PATHS.TRANSLATIONS}${lang}/pages/HOME/portfoliolist`), merged)

      await syncRelatedFeatured(db, host.items, lang)
    }

    host.dispatchEvent(
      new CustomEvent(CMS_EVENTS.NOTIFY, {
        bubbles: true,
        composed: true,
        detail: `Non-localized images, dimensions & slugs synced across all ${host.languages.length} languages!`,
      })
    )
  } catch (err) {
    devError('Error syncing non-localized info:', err)
    alert('Failed to sync non-localized portfolio info: ' + ((err as Error).message || err))
  } finally {
    host.saving = false
    host._updateDom()
    host._bindEvents()
  }
}

/**
 * Saves portfolio.
 * @param host — the host component
 */
export async function savePortfolio(host: CmsPortfolioList) {
  host.saving = true
  host._updateDom()
  try {
    const db = await getDbInstance()
    await set(
      ref(db, `${DB_PATHS.TRANSLATIONS}${host.selectedLang}/pages/HOME/portfoliolist`),
      host.items
    )

    await syncRelatedFeatured(db, host.items, host.selectedLang)

    host.dispatchEvent(
      new CustomEvent(CMS_EVENTS.NOTIFY, {
        bubbles: true,
        composed: true,
        detail: `Portfolio list for [${host.selectedLang.toUpperCase()}] saved successfully!`,
      })
    )
  } catch (err) {
    devError('Error saving portfolio list:', err)
    alert('Failed to save portfolio list to Firebase: ' + ((err as Error).message || err))
  } finally {
    host.saving = false
    host._updateDom()
    host._bindEvents()
  }
}
