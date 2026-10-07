/**
 * @file tokens/classes/cms.js
 * @description CMS shell class tokens — token group.
 */

import { _B_CMS } from '../base.js'

/**
 * Frozen cms shell class-name map — sole declaration site for these tokens; consumers read
 * members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
 * the token contract immutable at runtime.
 */
export const CMS_SHELL_CLASSES = Object.freeze({
  CMS_BADGE: `${_B_CMS}-badge`,
  CMS_CONTAINER: `${_B_CMS}-container`,
  CMS_HEADER: `${_B_CMS}-header`,
  CMS_BRAND: `${_B_CMS}-brand`,
  CMS_LOGO: `${_B_CMS}-logo`,
  CMS_USER_INFO: `${_B_CMS}-user-info`,
  CMS_AVATAR: `${_B_CMS}-avatar`,
  CMS_EMAIL: `${_B_CMS}-email`,
  CMS_LOGOUT_BTN: `${_B_CMS}-logout-btn`,
  CMS_NAV_TABS: `${_B_CMS}-nav-tabs`,
  CMS_TAB_BTN: `${_B_CMS}-tab-btn`,
  CMS_MAIN_CONTENT: `${_B_CMS}-main-content`,
  CMS_TOAST: `${_B_CMS}-toast`,
  TOAST_TEXT: 'toast-text',
})
