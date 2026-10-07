/**
 * @file tokens/classes/nav.js
 * @description Navigation class tokens — links, burger button and the
 * WebGL menu modal. Grouped token group.
 */

import {
  _B_NAV,
  _B_NAV_BURGER,
  _B_NAV_MENU_MODAL,
  _K_ACTIVE,
  _K_ROUTER_LINK_EXACT_ACTIVE,
} from '../base.js'

/**
 * Frozen nav class-name map — sole declaration site for these tokens; consumers read members
 * and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the
 * token contract immutable at runtime.
 */
export const NAV_CLASSES = Object.freeze({
  NAV: _B_NAV,
  NAV_LINK: `${_B_NAV}-link`,
  NAV_LINK_ACTIVE: _K_ROUTER_LINK_EXACT_ACTIVE,
  NAV_ON_DARK: `${_B_NAV}--on-dark`,
  NAV_PLAYGROUND: `${_B_NAV}--playground`,
  NAV_DESKTOP: `${_B_NAV}-desktop`,
  NAV_DESKTOP_RIGHT: `${_B_NAV}-desktop-right`,
  NAV_SEPARATOR: `${_B_NAV}-separator`,
  NAV_MOBILE_STRIP: `${_B_NAV}-mobile-strip`,
  NAV_LOGO_BTN: `${_B_NAV}-logo-btn`,
  NAV_ABOUT_BTN: `${_B_NAV}-about-btn`,
  NAV_ACTION_BTN: `${_B_NAV}-action-btn`,
  NAV_PREF_BTN: `${_B_NAV}-pref-btn`,
  NAV_LANG_OPEN_BTN: `${_B_NAV}-lang-open-btn`,
  NAV_FLAG_WRAPPER: `${_B_NAV}-flag-wrapper`,
  // Sub-class modifiers (used by AppNav delegated event handler)
  NAV_BACK: 'back',
  NAV_SCROLL_UP: 'scroll-up',
  NAV_SCROLL_DOWN: 'scroll-down',
  NAV_ACTIVE: _K_ACTIVE,
})

/**
 * Frozen nav burger class-name map — sole declaration site for these tokens; consumers read
 * members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
 * the token contract immutable at runtime.
 */
export const NAV_BURGER_CLASSES = Object.freeze({
  NAV_BURGER_BTN: `${_B_NAV_BURGER}-btn`,
  NAV_BURGER_OPEN: `${_B_NAV_BURGER}--open`,
  NAV_BURGER_CANVAS: `${_B_NAV_BURGER}-canvas`,
  NAV_BURGER_WRAP: `${_B_NAV_BURGER}-wrap`,
  NAV_BURGER_FALLBACK: `${_B_NAV_BURGER}-fallback`,
  NAV_BURGER_LINE: `${_B_NAV_BURGER}-line`,
})

/**
 * Frozen nav menu class-name map — sole declaration site for these tokens; consumers read
 * members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
 * the token contract immutable at runtime.
 */
export const NAV_MENU_CLASSES = Object.freeze({
  NAV_MENU_MODAL: _B_NAV_MENU_MODAL,
  NAV_MENU_MODAL_OPEN: `${_B_NAV_MENU_MODAL}--open`,
  NAV_MENU_MODAL_CANVAS: `${_B_NAV_MENU_MODAL}-canvas`,
  NAV_MENU_MODAL_HEADER: `${_B_NAV_MENU_MODAL}-header`,
  NAV_MENU_MODAL_CONTENT: `${_B_NAV_MENU_MODAL}-content`,
  NAV_MENU_MODAL_ITEM: `${_B_NAV_MENU_MODAL}-item`,
  NAV_MENU_MODAL_ITEM_ACTIVE: `${_B_NAV_MENU_MODAL}-item--active`,
  NAV_MENU_MODAL_FLAG: `${_B_NAV_MENU_MODAL}-flag`,
  NAV_MENU_MODAL_CLOSE: `${_B_NAV_MENU_MODAL}-close`,
  NAV_MENU_MODAL_CLOSING: `${_B_NAV_MENU_MODAL}--closing`,
  NAV_MENU_MODAL_SETTLED: `${_B_NAV_MENU_MODAL}--settled`,
  NAV_MENU_MODAL_FALLBACK: `${_B_NAV_MENU_MODAL}-fallback`,
  NAV_MENU_MODAL_GL_FALLBACK: `${_B_NAV_MENU_MODAL}--gl-fallback`,
})
