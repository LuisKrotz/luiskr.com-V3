/**
 * @file tokens/routes/paths.js
 * @description Path tokens split by function — public URL routes, Firebase
 * database path segments and static asset prefixes. Grouped subsets of
 * PATHS.
 */

import { _B_ABOUT, _B_CONTACT, _B_DOCS } from '../base.js'

/**
 * Frozen public-route map — canonical (English) URL paths. `*_SEGMENT`
 * variants exist for string-contains matching when the leading slash would
 * false-positive (e.g. '/portfolio/' vs the bare 'portfolio' segment);
 * `PORTFOLIO`/`PORTFOLIO_SLASH` duplicate intentionally so call sites
 * read unambiguously by intent.
 */
export const ROUTE_PATHS = Object.freeze({
  ROOT: '/',
  PORTFOLIO: '/portfolio/',
  PORTFOLIO_SEGMENT: 'portfolio',
  PORTFOLIO_SLASH: '/portfolio/',
  ADMIN: '/admin',
  CMS: '/cms',
  ABOUT: `/${_B_ABOUT}`,
  CONTACT: `/${_B_CONTACT}`,
  PRIVACY_POLICY: '/privacy-policy',
  GDPR: '/gdpr',
  TERMS_OF_USE: '/terms-of-use',
  NOT_FOUND: 'not-found',
  EARTH_PLAYGROUND: '/earth-playground',
  EARTH_PLAYGROUND_SEGMENT: 'earth-playground',
  SPACE_PLAYGROUND: '/space-playground',
  SPACE_PLAYGROUND_SEGMENT: 'space-playground',
  DOCS: `/${_B_DOCS}`,
  DOCS_SEGMENT: _B_DOCS,
})

/**
 * Frozen db path map — sole declaration site for these tokens; consumers read members and
 * never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the token
 * contract immutable at runtime.
 */
export const DB_PATHS = Object.freeze({
  COVERS: 'covers/',
  COMPONENTS: '/components',
  SLUGS: '/slugs',
  COMPONENTS_RELATED: '/components/related',
  COMPONENTS_RELATED_PROJECTS: '/components/related/projects',
  TRANSLATIONS: 'translations/',
  /** Segment names inside translations/<locale>/ used by the bootstrap chunks */
  PROJECTS_SEGMENT: 'projects',
  CORE_SEGMENT: 'core',
  PAGES: '/pages/',
  PROJECTS: '/projects/',
  DOCS_STATS: 'docs-stats/',
})

/**
 * Frozen asset path map — sole declaration site for these tokens; consumers read members and
 * never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the token
 * contract immutable at runtime.
 */
export const ASSET_PATHS = Object.freeze({
  FLAGS_PREFIX: '/flags/',
  SVG_EXT: '.svg',
})
