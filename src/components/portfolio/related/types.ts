/**
 * @file portfolio/related/types.ts — DB row + display-card shapes for
 * <portfolio-related>. The related node only stores {link, page,
 * featured} pointers; the home portfoliolist supplies image/description.
 */
/* istanbul ignore file */

export interface RelatedProject {
  link?: string
  page?: string
  title?: string
  featured?: boolean
  image?: string
  description?: string
}

/**
 * Type contract for RelatedSocial — the shape consumers rely on.
 */
export interface RelatedSocial {
  link?: string
  network?: string
}

/**
 * Type contract for RelatedTranslations — the shape consumers rely on.
 */
export interface RelatedTranslations {
  title?: string
  projects?: RelatedProject[] | Record<string, RelatedProject>
  path?: string
  socials?: RelatedSocial[]
  note?: string
}

/**
 * Type contract for HomeItem — the shape consumers rely on.
 */
export interface HomeItem {
  link?: string
  image?: string
  label?: string
  title?: string
  description?: string
}

/**
 * Type contract for RelatedCard — the shape consumers rely on.
 */
export interface RelatedCard {
  page: string
  link: string
  fullPath: string
  featured: boolean
  imageSrc: string
  description: string
}
