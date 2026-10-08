/**
 * @file portfolio/types.ts — portfolio row shape.
 */
/* istanbul ignore file */

/**
 * A row of the portfolio editor table — `label`/`link`/`image`/`description`
 * are the CMS fields, `featured` marks home-page picks, `width`/`height` are the
 * mosaic tile span lists. Index signature absorbs CMS columns not modeled here.
 */
export interface PortfolioItem {
  label?: string
  link?: string
  image?: string
  description?: string
  featured?: boolean
  width?: string[]
  height?: string[]
  [key: string]: unknown
}
