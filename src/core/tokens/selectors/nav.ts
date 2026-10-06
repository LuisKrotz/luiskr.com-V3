/**
 * @file tokens/selectors/nav.js
 * @description Navigation selector tokens — token group.
 */

import { NAV_CLASSES, NAV_MENU_CLASSES } from '../classes/nav.js'

/**
 * The NAV_SELECTORS constant.
 */
export const NAV_SELECTORS = Object.freeze({
  NAV_MENU_MODAL: `.${NAV_MENU_CLASSES.NAV_MENU_MODAL}`,
  NAV_MENU_MODAL_FALLBACK: `.${NAV_MENU_CLASSES.NAV_MENU_MODAL_FALLBACK}`,
  NAV_LOGO_BTN: `.${NAV_CLASSES.NAV_LOGO_BTN}`,
  NAV_ABOUT_BTN: `.${NAV_CLASSES.NAV_ABOUT_BTN}`,
  NAV_ACTION_BTN: `.${NAV_CLASSES.NAV_ACTION_BTN}`,
  NAV_PREF_BTN: `.${NAV_CLASSES.NAV_PREF_BTN}`,
  NAV_LANG_OPEN_BTN: `.${NAV_CLASSES.NAV_LANG_OPEN_BTN}`,
  NAV_LINK: `.${NAV_CLASSES.NAV_LINK}`,
})
