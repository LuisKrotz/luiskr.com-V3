/**
 * @file tokens/classes/toast.js
 * @description Site toast notification class tokens — grouped subset of
 * CLASSES.
 */

import { _B_SITE_TOAST } from '../base.js'

/**
 * Frozen toast class-name map — sole declaration site for these tokens; consumers read
 * members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
 * the token contract immutable at runtime.
 */
export const TOAST_CLASSES = Object.freeze({
  SITE_TOAST: _B_SITE_TOAST,
  SITE_TOAST_ITEM: `${_B_SITE_TOAST}-item`,
  SITE_TOAST_TITLE: `${_B_SITE_TOAST}-title`,
  SITE_TOAST_TEXT: `${_B_SITE_TOAST}-text`,
  SITE_TOAST_CLOSE: `${_B_SITE_TOAST}-close`,
})
