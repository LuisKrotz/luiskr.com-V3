/**
 * @file routes/views/home/types.ts
 * @description Shapes for the <view-home> route: the portfolio list item,
 * the pages/home translation node, and the pages/about node.
 */
/* istanbul ignore file */

/**
 * A portfoliolist entry as stored in pages/home — `link` joins to project
 * routes and `featured` drives awards-carousel/highlight behavior; the index
 * signature passes through extra CMS fields untouched.
 */
export interface PortfolioItem {
  link?: string
  featured?: unknown
  [key: string]: unknown
}

/**
 * The pages/home Firebase node — `portfoliolist` is the project list
 * (Firebase returns keyed objects or arrays depending on insertion order); other
 * nodes flow through the index signature.
 */
export interface HomeTranslations {
  portfoliolist?: PortfolioItem[] | Record<string, PortfolioItem>
  [key: string]: unknown
}

/**
 * The pages/about Firebase node — `mentions` is the intro copy and
 * `mention_items` the awards/mentions rows consumed by AwardsMentions.
 */
export interface AboutNode {
  mentions?: string
  mention_items?: unknown[]
  [key: string]: unknown
}
