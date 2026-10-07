/**
 * @file tokens/ids/sections.js
 * @description Page-section anchor id tokens — token group.
 */

import { _B_ABOUT, _B_CONTACT } from '../base.js'

/**
 * Frozen section element-id map — sole declaration site for these tokens; consumers read
 * members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
 * the token contract immutable at runtime.
 */
export const SECTION_IDS = Object.freeze({
  ABOUT: _B_ABOUT,
  CONTACT: _B_CONTACT,
})
