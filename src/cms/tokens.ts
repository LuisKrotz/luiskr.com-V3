/**
 * @file @cms/tokens.js
 * @description CMS-restricted tokens, tags, classes, and actions.
 * Strictly isolated for the admin/CMS bundle only. Never imported in the
 * public website. Class groups are decomposed per feature under
 * `@cms/tokens/` — import a group directly for tree-shaking.
 */

export * from './tokens/shell/dashboard.js'
export * from './tokens/shell/card.js'
export * from './tokens/fields/form.js'
export * from './tokens/fields/items.js'
export * from './tokens/fields/buttons.js'
export * from './tokens/shell/admin.js'
export * from './tokens/editors/deploy.js'
export * from './tokens/editors/projects.js'
export * from './tokens/fields/media.js'
export * from './tokens/editors/about.js'
export * from './tokens/editors/portfolio.js'

/**
 * The CMS_TABS constant.
 */
export const CMS_TABS = Object.freeze({
  PORTFOLIO: 'portfolio',
  PROJECTS: 'projects',
  ABOUT: 'about',
  FOOTER: 'footer',
  PLAYGROUND: 'playground',
  LANGUAGES: 'languages',
  MEDIA: 'media',
  DEPLOY: 'deploy',
})

/**
 * The CMS_TAGS constant.
 */
export const CMS_TAGS = Object.freeze({
  VIEW_ADMIN_LOGIN: 'view-admin-login',
  VIEW_CMS_DASHBOARD: 'view-cms-dashboard',
  CMS_PORTFOLIO_LIST: 'cms-portfolio-list',
  CMS_PROJECTS_LIST: 'cms-projects-list',
  CMS_ABOUT_EDITOR: 'cms-about-editor',
  CMS_FOOTER_EDITOR: 'cms-footer-editor',
  CMS_LANG_EDITOR: 'cms-lang-editor',
  CMS_PLAYGROUND_EDITOR: 'cms-playground-editor',
  CMS_MEDIA_CONVERTER: 'cms-media-converter',
  CMS_DEPLOY_INFO: 'cms-deploy-info',
})

/**
 * The CMS_EVENTS constant.
 */
export const CMS_EVENTS = Object.freeze({
  NOTIFY: 'notify',
  AUTH_CHANGED: 'cms-auth-changed',
})

/** data-action values for the list-item row controls. */
export const CMS_ACTIONS = Object.freeze({
  UP: 'up',
  DOWN: 'down',
  DELETE: 'delete',
})

/** Class-prefix conventions for the editable channel lists in the footer/about editors. */
export const CMS_LIST_PREFIXES = Object.freeze({
  LINE1: 'line1',
  LINE2: 'line2',
  LEGAL: 'legal',
  SOCIAL: 'social',
})

/** Record field names the channel lists bind to (label prop varies per DB node). */
export const CMS_FIELD_KEYS = Object.freeze({
  DESCRIPTION: 'description',
  PAGE: 'page',
  NETWORK: 'network',
  LINK: 'link',
})

// Editable translation nodes in the Language Dictionary editor — every
// user-facing dictionary must be reachable here; nothing stays JS-hardcoded.
/**
 * The CMS_LANG_NODES constant.
 */
export const CMS_LANG_NODES = Object.freeze([
  'APP',
  'components',
  'pages/HOME',
  'pages/about',
  'pages/GDPR',
  'pages/privacy-policy',
  'pages/terms-of-use',
  'pages/not-found',
  'pages/earth-playground',
  'slugs',
])
