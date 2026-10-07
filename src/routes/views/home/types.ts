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
 * Type contract for HomeTranslations — the shape consumers rely on.
 */
export interface HomeTranslations {
  portfoliolist?: PortfolioItem[] | Record<string, PortfolioItem>
  [key: string]: unknown
}

/**
 * Type contract for AboutNode — the shape consumers rely on.
 */
export interface AboutNode {
  mentions?: string
  mention_items?: unknown[]
  [key: string]: unknown
}
