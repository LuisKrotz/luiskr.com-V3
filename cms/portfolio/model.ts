/**
 * @file portfolio/model.ts — portfolio list model mutations.
 */

import { DB_PATHS } from '@core/tokens/routes/paths.js'
import { CHAR_STRINGS } from '@core/tokens/strings/chars.js'
import type { CmsPortfolioList } from './CmsPortfolioList.js'
import type { PortfolioItem } from './types.js'
import { CDN_URLS } from '@core/tokens/media/urls.js'
import { COVER_DIMENSIONS, MOSAIC_DIMENSIONS } from '@core/tokens/media/dimensions.js'

/**
 * Gets image preview.
 * @param imgName — the value
 * @returns string
 */
export function getImagePreview(imgName: string | undefined): string {
  if (!imgName) return CHAR_STRINGS.EMPTY
  if (imgName.startsWith('http')) return imgName
  return `${CDN_URLS.CDN_BASE}${DB_PATHS.COVERS}${imgName}.jpg`
}

/**
 * Updates dim.
 * @param item — the item
 * @param prop — the value
 * @param idx — the index
 * @param val — the value
 */
export function updateDim(item: PortfolioItem, prop: string, idx: number, val: string): void {
  if (!Array.isArray(item[prop])) {
    item[prop] =
      idx === 0
        ? [val, MOSAIC_DIMENSIONS.MOSAIC_MOBILE_WIDTH_STR]
        : [COVER_DIMENSIONS.FHD_WIDTH_STR, val]
  } else {
    item[prop][idx] = val
  }
}

/**
 * Adds new item.
 * @param host — the host component
 */
export function addNewItem(host: CmsPortfolioList) {
  host.items.push({
    label: 'New Project',
    link: 'new-project',
    image: 'default-cover',
    description: 'New project description.',
    featured: false,
    width: [COVER_DIMENSIONS.FHD_WIDTH_STR, MOSAIC_DIMENSIONS.MOSAIC_MOBILE_WIDTH_STR],
    height: [
      MOSAIC_DIMENSIONS.MOSAIC_DESKTOP_HEIGHT_STR,
      MOSAIC_DIMENSIONS.MOSAIC_MOBILE_HEIGHT_STR,
    ],
  })
  host._updateDom()
  host._bindEvents()
}

/**
 * Removes item.
 * @param host — the host component
 * @param idx — the index
 */
export function removeItem(host: CmsPortfolioList, idx: number): void {
  if (confirm(`Delete "${host.items[idx]?.label || 'Item'}"?`)) {
    host.items.splice(idx, 1)
    host._updateDom()
    host._bindEvents()
  }
}

/**
 * Moves up.
 * @param host — the host component
 * @param idx — the index
 */
export function moveUp(host: CmsPortfolioList, idx: number): void {
  if (idx <= 0) return
  const item = host.items.splice(idx, 1)[0]
  host.items.splice(idx - 1, 0, item)
  host._updateDom()
  host._bindEvents()
}

/**
 * Moves down.
 * @param host — the host component
 * @param idx — the index
 */
export function moveDown(host: CmsPortfolioList, idx: number): void {
  if (idx >= host.items.length - 1) return
  const item = host.items.splice(idx, 1)[0]
  host.items.splice(idx + 1, 0, item)
  host._updateDom()
  host._bindEvents()
}
