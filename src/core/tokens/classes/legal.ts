/**
 * @file tokens/classes/legal.js
 * @description Legal pages + not-found view class tokens — grouped subset of
 * CLASSES.
 */

import { _B_NOT_FOUND } from '../base.js'

/**
 * The LEGAL_CLASSES constant.
 */
export const LEGAL_CLASSES = Object.freeze({
  LEGAL: 'legal',
})

/**
 * The NOT_FOUND_CLASSES constant.
 */
export const NOT_FOUND_CLASSES = Object.freeze({
  NOT_FOUND: _B_NOT_FOUND,
  NOT_FOUND_TITLE: `${_B_NOT_FOUND}-title`,
  NOT_FOUND_SUBTITLE: `${_B_NOT_FOUND}-subtitle`,
  NOT_FOUND_LINK: `${_B_NOT_FOUND}-link`,
})
