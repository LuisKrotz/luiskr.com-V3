/**
 * @file tokens/classes/footer.js
 * @description Footer source-code row class tokens — grouped subset of
 * CLASSES.
 */

import { _B_FOOTER_SOURCE } from '../base.js'

/**
 * Frozen footer class-name map — sole declaration site for these tokens; consumers read
 * members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
 * the token contract immutable at runtime.
 */
export const FOOTER_CLASSES = Object.freeze({
  FOOTER_SOURCE: _B_FOOTER_SOURCE,
  FOOTER_SOURCE_LINK: `${_B_FOOTER_SOURCE}-link`,
})
