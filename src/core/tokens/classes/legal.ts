/**
 * @file tokens/classes/legal.js
 * @description Legal pages + not-found view class tokens — grouped subset of
 * CLASSES.
 */

import { _B_NOT_FOUND } from '../base.js'

/**
 * Frozen legal class-name map — sole declaration site for these tokens; consumers read
 * members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
 * the token contract immutable at runtime.
 */
export const LEGAL_CLASSES = Object.freeze({
  LEGAL: 'legal',
})

/**
 * Frozen not found class-name map — sole declaration site for these tokens; consumers read
 * members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
 * the token contract immutable at runtime.
 */
export const NOT_FOUND_CLASSES = Object.freeze({
  NOT_FOUND: _B_NOT_FOUND,
  NOT_FOUND_TITLE: `${_B_NOT_FOUND}-title`,
  NOT_FOUND_SUBTITLE: `${_B_NOT_FOUND}-subtitle`,
  NOT_FOUND_LINK: `${_B_NOT_FOUND}-link`,
})
