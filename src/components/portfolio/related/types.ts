/**
 * @file portfolio/related/types.ts — DB row + display-card shapes for
 * <portfolio-related>. The related node only stores {link, page,
 * featured} pointers; the home portfoliolist supplies image/description.
 */

export interface RelatedProject {
  link?: string
  page?: string
  title?: string
  featured?: boolean
  image?: string
  description?: string
}

/**
 * The RelatedSocial value.
 */
export interface RelatedSocial {
  link?: string
  network?: string
}

/**
 * The RelatedTranslations value.
 */
export interface RelatedTranslations {
  title?: string
  projects?: RelatedProject[] | Record<string, RelatedProject>
  path?: string
  socials?: RelatedSocial[]
  note?: string
}

/**
 * The HomeItem value.
 */
export interface HomeItem {
  link?: string
  image?: string
  label?: string
  title?: string
  description?: string
}

/**
 * The RelatedCard value.
 */
export interface RelatedCard {
  page: string
  link: string
  fullPath: string
  featured: boolean
  imageSrc: string
  description: string
}
