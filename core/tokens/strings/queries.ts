/**
 * @file tokens/strings/queries.js
 * @description Selector/media-query/rootMargin string tokens — grouped
 * token group.
 */

/**
 * Selector/media-query/rootMargin string tokens. Sole declaration site — consumers import members
 * from this frozen map rather than re-declaring the literals
 * (zero-hardcoding rule).
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
