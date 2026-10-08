/**
 * @file tokens/ids/dialogs.js
 * @description Dialog title id tokens (aria-labelledby targets) — grouped
 * token group.
 */

import { _B_LANG_DIALOG, _B_PREF } from '../base.js'

/**
 * Frozen dialog element-id map — sole declaration site for these tokens; consumers read
 * members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
 * the token contract immutable at runtime.
 */
export const DIALOG_IDS = Object.freeze({
  LANG_DIALOG_TITLE: `${_B_LANG_DIALOG}-title`,
  PREF_TITLE: `${_B_PREF}-title`,
})
