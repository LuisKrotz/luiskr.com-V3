/**
 * @file routes/views/home/types.ts
 * @description Shapes for the <view-home> route: the portfolio list item,
 * the pages/home translation node, and the pages/about node.
 */
/* istanbul ignore file */

export interface PortfolioItem {
  link?: string
  featured?: unknown
  [key: string]: unknown
}

/**
 * The HomeTranslations value.
 */
export interface HomeTranslations {
  portfoliolist?: PortfolioItem[] | Record<string, PortfolioItem>
  [key: string]: unknown
}

/**
 * The AboutNode value.
 */
export interface AboutNode {
  mentions?: string
  mention_items?: unknown[]
  [key: string]: unknown
}
