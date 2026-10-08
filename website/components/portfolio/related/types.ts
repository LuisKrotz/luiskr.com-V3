/**
 * @file portfolio/related/types.ts — DB row + display-card shapes for
 * <portfolio-related>. The related node only stores {link, page,
 * featured} pointers; the home portfoliolist supplies image/description.
 */
/* istanbul ignore file */

/**
 * A related-projects pointer row — `link`/`page` identify the target,
 * `featured` promotes it visually; `title`/`image`/`description` are hydrated from
 * the home portfoliolist since the related node stores pointers only.
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
 * A social row in the related footer — `network` names the service
 * (icon lookup key), `link` is the profile URL.
 */
export interface RelatedSocial {
  link?: string
  network?: string
}

/**
 * The components/related DB node as consumed by <portfolio-related> —
 * `projects` may arrive keyed-object or array from Firebase, `path` is the
 * portfolio base route, `socials`/`note`/`title` the footer copy.
 */
export interface RelatedTranslations {
  title?: string
  projects?: RelatedProject[] | Record<string, RelatedProject>
  path?: string
  socials?: RelatedSocial[]
  note?: string
}

/**
 * A home portfoliolist row used to hydrate related pointers — `link` is the
 * join key, `image`/`label`/`title`/`description` fill the card.
 */
export interface HomeItem {
  link?: string
  image?: string
  label?: string
  title?: string
  description?: string
}

/**
 * The resolved display card — every field concrete (no optionals) because
 * hydration already merged the pointer row with its home-list data. `fullPath` is
 * the computed route to the project page.
 */
export interface RelatedCard {
  page: string
  link: string
  fullPath: string
  featured: boolean
  imageSrc: string
  description: string
}
