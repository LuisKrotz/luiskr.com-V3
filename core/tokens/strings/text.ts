/**
 * @file tokens/strings/text.js
 * @description Non-localized UI text tokens (units, dev-facing labels) —
 * grouped subsets of TEXT.
 */

/**
 * Non-localized UI text tokens (units, dev-facing labels) Sole declaration site — consumers import members
 * from this frozen map rather than re-declaring the literals
 * (zero-hardcoding rule).
 */
export const NAV_TEXT = Object.freeze({
  SCROLL_UP: 'Back to Top',
  SCROLL_UP_ALT: 'Scroll up',
  CONTACT: 'Contact',
  RELATED: 'Related',
  ABOUT: 'About',
  ABOUT_ME: 'About Me',
  GET_IN_TOUCH: 'Get in Touch',
  SOME_MENTIONS: 'Some mentions',
})

/**
 * labels text.
 */
export const LABEL_TEXT = Object.freeze({
  LOADING: 'Loading',
  LOGOUT: 'Logout',
})

/**
 * Frozen unit UI text map — sole declaration site for these tokens; consumers read members
 * and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the
 * token contract immutable at runtime.
 */
export const UNIT_TEXT = Object.freeze({
  DOT_SEP: '•',
  KB_S: 'KB/s',
  MS: 'ms',
  MB: 'MB',
  DASH: '—',
})
