/**
 * @file portfolio/types.ts — portfolio row shape.
 */
/* istanbul ignore file */

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
