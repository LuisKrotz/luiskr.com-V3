/**
 * @file tokens/classes/lang.js
 * @description Language dialog class tokens — token group.
 */

import { _B_LANG_DIALOG, _B_LANG_GLASS } from '../base.js'

/**
 * Frozen lang class-name map — sole declaration site for these tokens; consumers read
 * members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
 * the token contract immutable at runtime.
 */
export const LANG_CLASSES = Object.freeze({
  LANG_DIALOG: _B_LANG_DIALOG,
  LANG_GLASS_FOLLOWER: _B_LANG_GLASS,
})
