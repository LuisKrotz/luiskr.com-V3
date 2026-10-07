/**
 * @file project/types.ts
 * @description Shared shapes for the <view-project> route: media items,
 * section children, the fetched project node and the custom-carousel
 * element contract.
 */
/* istanbul ignore file */

export interface ProjectMediaItem {
  src: string
  size: number[]
  label?: string
  class?: string
  isVideo?: boolean
  [key: string]: unknown
}

/**
 * Type contract for CoverMedia — the shape consumers rely on.
 */
export interface CoverMedia {
  src: string
  size: number[]
  isVideo?: boolean
  label?: string
}

/**
 * Type contract for SectionChild — the shape consumers rely on.
 */
export type SectionChild = string[] | ProjectMediaItem[]

/**
 * Type contract for project translations.
 */
export interface ProjectTranslations {
  title?: string
  noindex?: boolean
  folder?: string
  cover?: CoverMedia
  sections?: SectionChild[][]
  [key: string]: unknown
}

/**
 * Type contract for CustomCarouselElement — the shape consumers rely on.
 */
export interface CustomCarouselElement extends HTMLElement {
  configure(_opts: { items: unknown[]; folder: string; forceActive: boolean }): void
}
