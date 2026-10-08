/**
 * @file tokens/elements/html.js
 * @description Native HTML tag-name tokens — token group.
 */

import { _B_NAV, _K_DIALOG, _K_INPUT, _K_STYLE, _K_TITLE } from '../base.js'

/**
 * Frozen html element tag-name map — sole declaration site for these tokens; consumers read
 * members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
 * the token contract immutable at runtime.
 */
export const HTML_TAGS = Object.freeze({
  FIGURE: 'figure',
  VIDEO: 'video',
  IMG: 'img',
  IFRAME: 'iframe',
  BUTTON: 'button',
  LINK: 'link',
  META: 'meta',
  STYLE: _K_STYLE,
  DIV: 'div',
  SPAN: 'span',
  A: 'a',
  P: 'p',
  CANVAS: 'canvas',
  SELECT: 'select',
  OPTION: 'option',
  INPUT: _K_INPUT,
  TEXTAREA: 'textarea',
  LABEL: 'label',
  H2: 'h2',
  H3: 'h3',
  NAV: _B_NAV,
  ASIDE: 'aside',
  HEADER: 'header',
  MAIN: 'main',
  DIALOG: _K_DIALOG,
  TITLE: _K_TITLE,
  H1: 'h1',
})
