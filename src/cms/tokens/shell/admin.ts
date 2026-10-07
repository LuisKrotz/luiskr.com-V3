/**
 * @file @cms/tokens/admin.js
 * @description Admin/login classes — login wrapper/card, Google auth
 * button, error messaging, toast text.
 */

import { _B_ADMIN } from '../base.js'

/**
 * Frozen cms admin class-name map — sole declaration site for these tokens; consumers read
 * members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
 * the token contract immutable at runtime.
 */
export const CMS_ADMIN_CLASSES = Object.freeze({
  ADMIN_LOGIN_WRAPPER: `${_B_ADMIN}-login-wrapper`,
  ADMIN_LOGIN_CARD: `${_B_ADMIN}-login-card`,
  ADMIN_LOGIN_TITLE: `${_B_ADMIN}-login-title`,
  ADMIN_LOGIN_BTN: `${_B_ADMIN}-login-btn`,
  ADMIN_TITLE: `${_B_ADMIN}-title`,
  ADMIN_SUBTITLE: `${_B_ADMIN}-subtitle`,
  GOOGLE_AUTH_BTN: 'google-auth-btn',
  GOOGLE_ICON: 'google-icon',
  ADMIN_ERROR_MSG: `${_B_ADMIN}-error-msg`,
  TOAST_TEXT: 'toast-text',
})
