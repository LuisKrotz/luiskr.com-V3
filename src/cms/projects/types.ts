/**
 * @file projects/types.ts — CMS project editor model types + CDN URL helper.
 */

import { MEDIA } from '@/core/tokens/media/suffixes.js'
import { CDN_URLS } from '@/core/tokens/media/urls.js'
import { COVER_DIMENSIONS } from '@/core/tokens/media/dimensions.js'

/**
 * The CmsMediaItem value.
 */
export interface CmsMediaItem {
  src: string
  label: string
  isVideo: boolean
  size: number[]
}

/**
 * The CmsSection value.
 */
export type CmsSection = [string[], CmsMediaItem[]]

/**
 * Type contract for cms project.
 */
export interface CmsProject {
  title: string
  folder: string
  seo: { noIndex: boolean }
  cover: CmsMediaItem
  sections: CmsSection[]
}

/**
 * Builds the CDN URL for a media filename the same way the public site
 * does — videos resolve to their poster frame, images to the mozjpeg
 * thumb variant — so CMS previews show exactly what visitors will see.
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
