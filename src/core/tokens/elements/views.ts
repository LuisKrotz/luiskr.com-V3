/**
 * @file tokens/elements/views.js
 * @description Route-view custom element tag tokens — grouped subset of
 * TAGS.
 */

/**
 * Route-view custom element tag tokens. Sole declaration site — consumers import members
 * from this frozen map rather than re-declaring the literals
 * (zero-hardcoding rule).
 */
export const VIEW_TAGS = Object.freeze({
  VIEW_HOME: 'view-home',
  VIEW_PROJECT: 'view-project',
  VIEW_LEGAL: 'view-legal',
  VIEW_NOT_FOUND: 'view-not-found',
  VIEW_ADMIN_LOGIN: 'view-admin-login',
  VIEW_CMS_DASHBOARD: 'view-cms-dashboard',
  VIEW_SPACE_PLAYGROUND: 'view-space-playground',
})
