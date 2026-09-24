/**
 * @file @core/cms/tokens.js
 * @description CMS-restricted tokens, tags, classes, and actions.
 * Strictly isolated for the admin/CMS bundle only. Never imported in the public website.
 */

const _B_CMS = 'cms'
const _B_ADMIN = 'admin'

export const CMS_TAGS = Object.freeze({
  VIEW_ADMIN_LOGIN: 'view-admin-login',
  VIEW_CMS_DASHBOARD: 'view-cms-dashboard',
  CMS_PORTFOLIO_LIST: 'cms-portfolio-list',
  CMS_PROJECTS_LIST: 'cms-projects-list',
  CMS_ABOUT_EDITOR: 'cms-about-editor',
  CMS_FOOTER_EDITOR: 'cms-footer-editor',
  CMS_LANG_EDITOR: 'cms-lang-editor',
})

export const CMS_CLASSES = Object.freeze({
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
  CMS_CARD: `${_B_CMS}-card`,
  CMS_FIELD_GROUP: `${_B_CMS}-field-group`,
  CMS_SECTION_TITLE: `${_B_CMS}-section-title`,
  CMS_INPUT: `${_B_CMS}-input`,
  CMS_SELECT: `${_B_CMS}-select`,
  CMS_BTN: `${_B_CMS}-btn`,
  CMS_BTN_PRIMARY: `${_B_CMS}-btn ${_B_CMS}-btn--primary`,
  CMS_BTN_DANGER: `${_B_CMS}-btn ${_B_CMS}-btn--danger`,
  CMS_BTN_SECONDARY: `${_B_CMS}-btn ${_B_CMS}-btn--secondary`,
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

export const CMS_ROUTES = Object.freeze({
  ADMIN: 'admin',
  CMS: 'cms',
  ADMIN_LOGIN: 'Admin Login',
  CMS_DASHBOARD: 'CMS Dashboard',
})

export const CMS_EVENTS = Object.freeze({
  NOTIFY: 'notify',
})
