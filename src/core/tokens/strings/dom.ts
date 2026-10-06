/**
 * @file tokens/strings/dom.js
 * @description DOM property/markup string tokens — grouped subset of
 * STRINGS.
 */

import { _DATA } from '../base.js'

/**
 * The DOM_STRINGS constant.
 */
export const DOM_STRINGS = Object.freeze({
  CLASS: 'class',
  CLASS_NAME: 'className',
  ID: 'id',
  SRC: 'src',
  HREF: 'href',
  ALT: 'alt',
  TYPE: 'type',
  NAME: 'name',
  VALUE: 'value',
  REL: 'rel',
  REL_CANONICAL: 'canonical',
  BLANK: '_blank',
  NOOPENER: 'noopener noreferrer',
  DATA_ROUTE: `${_DATA}route`,
  A_TAG: 'a',
  BR_TAG: '<br>',
})
