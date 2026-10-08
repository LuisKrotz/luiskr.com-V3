/**
 * @file tokens/routes/names.js
 * @description Route name + localized title-prefix tokens.
 */

/**
 * Route name + localized title-prefix tokens. Sole declaration site — consumers import members
 * from this frozen map rather than re-declaring the literals
 * (zero-hardcoding rule).
 */
export const ROUTE_NAMES = Object.freeze({
  HOME: 'Home',
  ABOUT: 'About',
  CONTACT: 'Contact',
  PRIVACY: 'Privacy Policy',
  GDPR: 'GDPR',
  TERMS: 'Terms of Use',
  PROJECT: 'DynamicProject',
  NOT_FOUND: 'Not Found',
  ADMIN_LOGIN: 'Admin Login',
  CMS_DASHBOARD: 'CMS Dashboard',
  EARTH_PLAYGROUND: 'Earth Playground',
  DOCS: 'In-depth project docs',
})

/**
 * routes prefixes.
 */
export const ROUTE_PREFIXES = Object.freeze({
  HOME: 'Home',
  ABOUT: 'About',
  CONTACT: 'Contact',
  PRIVACY: 'Privacy',
  GDPR: 'GDPR',
  TERMS: 'Terms',
})
