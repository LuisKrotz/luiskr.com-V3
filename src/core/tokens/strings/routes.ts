/**
 * @file tokens/strings/routes.js
 * @description Route/CMS name string tokens — token group.
 */

import {
  _B_ABOUT,
  _B_ADMIN,
  _B_CMS,
  _B_CONTACT,
  _K_PRIVACY_POLICY,
  _K_TERMS_OF_USE,
} from '../base.js'

/**
 * routes strings.
 */
export const ROUTE_STRINGS = Object.freeze({
  ADMIN: _B_ADMIN,
  CMS: _B_CMS,
  ADMIN_TITLE: 'Admin Login',
  CMS_TITLE: 'CMS Dashboard',
  PORTFOLIO: 'portfolio',
  PRIVACY: 'privacy',
  GDPR: 'gdpr',
  TERMS: 'terms',
  TERMS_OF_USE: _K_TERMS_OF_USE,
  PRIVACY_POLICY: _K_PRIVACY_POLICY,
  ABOUT: _B_ABOUT,
  CONTACT: _B_CONTACT,
})
