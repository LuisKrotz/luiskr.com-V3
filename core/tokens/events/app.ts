/**
 * @file tokens/events/app.js
 * @description Custom application event-name tokens — grouped subset of
 * EVENTS.
 */

import { _K_CLOSE } from '../base.js'

/**
 * Frozen app event-name map — sole declaration site for these tokens; consumers read members
 * and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the
 * token contract immutable at runtime.
 */
export const APP_EVENTS = Object.freeze({
  COOKIE_ACTION: 'cookieAction',
  SLIDE_CHANGE: 'slidechange',
  AUTOPLAY_STOP: 'autoplaystop',
  AUTOPLAY_START: 'autoplaystart',
  CANCEL: 'cancel',
  CLOSE: _K_CLOSE,
  OPEN_LANG_DIALOG: 'open-lang-dialog',
  OPEN_PREFERENCES_MODAL: 'open-preferences-modal',
  NOTIFY: 'notify',
})
