/**
 * @file @core/tokens/paths.js
 * @description Centralized route paths, Firebase DB path prefixes, and project aliases.
 */

export const BASE_TITLE = 'Luis Krötz'

export const PROJECT_ALIASES = Object.freeze({
  'brazilian-leather': 'cicb',
  'clinica-de-desenvolvimento-nathalia-bond': 'nathalia-bond',
  'genesysinf-sageweb': 'sage',
  'minimelissa': 'mini-melissa',
})

export const PATHS = Object.freeze({
  ROOT: '/',
  COVERS: 'covers/',
  COMPONENTS_RELATED: '/components/related',
  COMPONENTS_RELATED_PROJECTS: '/components/related/projects',
  TRANSLATIONS: 'translations/',
  PAGES: '/pages/',
  PROJECTS: '/projects/',
  PORTFOLIO: '/portfolio/',
  PORTFOLIO_SEGMENT: 'portfolio',
})
