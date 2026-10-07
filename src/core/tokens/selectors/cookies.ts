/**
 * @file tokens/selectors/cookies.js
 * @description Cookie banner selector tokens — token group.
 */

import { _B_COOKIES } from '../base.js'

/**
 * Frozen cookie selector map — sole declaration site for these tokens; consumers read
 * members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
 * the token contract immutable at runtime.
 */
export const COOKIE_SELECTORS = Object.freeze({
  COOKIES_BUTTONS_ACCEPT: `.${_B_COOKIES}-buttons-accept`,
  COOKIES_BUTTONS_REFUSE: `.${_B_COOKIES}-buttons-refuse`,
})
