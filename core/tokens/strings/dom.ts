/**
 * @file tokens/strings/dom.js
 * @description DOM property/markup string tokens — grouped subset of
 * STRINGS.
 */

import { _DATA } from '../base.js'

/**
 * Frozen dom string map — sole declaration site for these tokens; consumers read members and
 * never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the token
 * contract immutable at runtime.
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
  REL_PREFETCH: 'prefetch',
  BLANK: '_blank',
  NOOPENER: 'noopener noreferrer',
  DATA_ROUTE: `${_DATA}route`,
  A_TAG: 'a',
  BR_TAG: '<br>',
})
