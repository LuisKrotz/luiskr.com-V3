/**
 * @file tokens/strings/queries.js
 * @description Selector/media-query/rootMargin string tokens — grouped
 * token group.
 */

export const QUERY_STRINGS = Object.freeze({
  SELECTOR_LINKS: 'a[href^="/"], [data-route]',
  LINK_CANONICAL: 'link[rel="canonical"]',
  META_ROBOTS: 'meta[name="robots"]',
  ROOT_MARGIN_200: '200px 0px',
  ROOT_MARGIN_100: '100px 0px',
  ROOT_MARGIN_50: '50px 0px',
  DARK_SCHEME_QUERY: '(prefers-color-scheme: dark)',
  CONTAINER_TYPE: 'container-type',
  INLINE_SIZE: 'inline-size',
})
