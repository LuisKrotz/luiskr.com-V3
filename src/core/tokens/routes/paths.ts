/**
 * @file tokens/routes/paths.js
 * @description Path tokens split by function — public URL routes, Firebase
 * database path segments and static asset prefixes. Grouped subsets of
 * PATHS.
 */

import { _B_ABOUT, _B_CONTACT } from '../base.js'

/**
 * routes paths.
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
})

/**
 * The DB_PATHS constant.
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
})

/**
 * The ASSET_PATHS constant.
 */
export const ASSET_PATHS = Object.freeze({
  FLAGS_PREFIX: '/flags/',
  SVG_EXT: '.svg',
})
