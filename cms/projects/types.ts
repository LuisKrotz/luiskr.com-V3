/**
 * @file projects/types.ts — CMS project editor model types + CDN URL helper.
 */

import { MEDIA } from '@core/tokens/media/suffixes.js'
import { CDN_URLS } from '@core/tokens/media/urls.js'
import { COVER_DIMENSIONS } from '@core/tokens/media/dimensions.js'

/** One media row in the CMS project editor. */
export interface CmsMediaItem {
  /** Extensionless CDN stem (resolved by the gcs() helper for previews). */
  src: string
  /** Alt/label text shown in the editor + emitted as media labels. */
  label: string
  /** Whether the media is a video (drives poster-URL resolution). */
  isVideo: boolean
  /** Intrinsic [w,h] for aspect-ratio layouts. */
  size: number[]
}

/** One project section — [text paragraphs, media items] tuple. */
export type CmsSection = [string[], CmsMediaItem[]]

/** The persisted CMS project document shape. */
export interface CmsProject {
  /** Project title (heading + metadata). */
  title: string
  /** CDN folder prefix all media resolves under. */
  folder: string
  /** SEO flags — noIndex removes the project from crawlers/schema. */
  seo: { noIndex: boolean }
  /** Cover media shown in mosaics/cards. */
  cover: CmsMediaItem
  /** Ordered content sections. */
  sections: CmsSection[]
}

/**
 * Builds the CDN URL for a media filename the same way the public site
 * does — videos resolve to their poster frame, images to the mozjpeg
 * thumb variant — so CMS previews show exactly what visitors will see.
 * @param filename Extensionless CDN stem (folder + name).
 * @param isVideo When true, resolves the generated poster frame instead.
 * @returns The full preview URL.
 */
export function gcs(filename: string, isVideo?: boolean): string {
  const base = `${CDN_URLS.CDN_BASE}${filename}`

  return isVideo
    ? `${base}${MEDIA.VIDEO_THUMB_EXT}`
    : `${base}${MEDIA.MOZ}${MEDIA.THUMB_SUFFIX}${MEDIA.EXT}`
}

/** Default cover placeholder used by new/legacy projects. */
export const defaultCover = (label = ''): CmsMediaItem => ({
  src: 'cover',
  label,
  size: [COVER_DIMENSIONS.FHD_WIDTH, COVER_DIMENSIONS.COVER_HEIGHT_WIDE],
  isVideo: false,
})

/** Default section media slot dimensions. */
export const newMediaSlot = (): CmsMediaItem => ({
  src: '',
  label: '',
  isVideo: false,
  size: [COVER_DIMENSIONS.FHD_WIDTH, COVER_DIMENSIONS.FHD_HEIGHT],
})
