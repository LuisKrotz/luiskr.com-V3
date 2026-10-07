/**
 * @file project/types.ts
 * @description Shared shapes for the <view-project> route: media items,
 * section children, the fetched project node and the custom-carousel
 * element contract.
 */
/* istanbul ignore file */

/**
 * A media row inside a project section — `src` is the extensionless CDN
 * stem, `size` the intrinsic [w,h] for aspect layout, `label`/`class`/`isVideo` the
 * optional render modifiers. Index signature passes through extra CMS fields.
 */
export interface ProjectMediaItem {
  src: string
  size: number[]
  label?: string
  class?: string
  isVideo?: boolean
  [key: string]: unknown
}

/**
 * The project cover — like ProjectMediaItem but always present when the
 * project has hero media; `size` [w,h] reserves the box so the skeleton shows the
 * final aspect ratio before bytes arrive.
 */
export interface CoverMedia {
  src: string
  size: number[]
  isVideo?: boolean
  label?: string
}

/**
 * One section row — either a string[] of paragraph text or a media-item
 * array; the union keeps sections heterogeneous without a wrapper object.
 */
export type SectionChild = string[] | ProjectMediaItem[]

/**
 * The project's translation node — `title`, `noindex` SEO flag,
 * `folder` CDN prefix, `cover`, and `sections` (array of SectionChild arrays).
 * Index signature preserves CMS fields the view doesn't consume.
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
 * Structural contract for <custom-carousel> — the view calls
 * `configure()` after upgrading, so the type exposes just that method (an
 * HTMLElement subclass registered elsewhere).
 */
export interface CustomCarouselElement extends HTMLElement {
  configure(_opts: { items: unknown[]; folder: string; forceActive: boolean }): void
}
