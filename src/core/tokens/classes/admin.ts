/**
 * @file tokens/classes/admin.js
 * @description Admin login view class tokens — token group.
 */

import { _B_ADMIN } from '../base.js'

/**
 * Admin-login view classes. The `ADMIN_*` entries compose the `admin` BEM
 * block; `GOOGLE_AUTH_BTN`/`GOOGLE_ICON` are standalone blocks (different
 * block prefix) since Google's sign-in widget styling is applied to those
 * nodes and must not inherit admin-* selectors.
 */
export const ADMIN_CLASSES = Object.freeze({
  ADMIN_LOGIN_WRAPPER: `${_B_ADMIN}-login-wrapper`,
  ADMIN_LOGIN_CARD: `${_B_ADMIN}-login-card`,
  ADMIN_TITLE: `${_B_ADMIN}-title`,
  ADMIN_SUBTITLE: `${_B_ADMIN}-subtitle`,
  ADMIN_ERROR_MSG: `${_B_ADMIN}-error-msg`,
  GOOGLE_AUTH_BTN: 'google-auth-btn',
  GOOGLE_ICON: 'google-icon',
})
