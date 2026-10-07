/**
 * @file tokens/classes/cookies.js
 * @description Cookie banner class tokens — token group.
 */

import { _B_COOKIES, _B_COOKIES_BUTTONS } from '../base.js'

/**
 * Frozen cookie class-name map — sole declaration site for these tokens; consumers read
 * members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
 * the token contract immutable at runtime.
 */
export const COOKIE_CLASSES = Object.freeze({
  COOKIES: _B_COOKIES,
  COOKIES_INFO: `${_B_COOKIES}-info`,
  COOKIES_BUTTONS: _B_COOKIES_BUTTONS,
  COOKIES_BUTTONS_ACCEPT: `${_B_COOKIES_BUTTONS}-accept`,
  COOKIES_BUTTONS_REFUSE: `${_B_COOKIES_BUTTONS}-refuse`,
})
