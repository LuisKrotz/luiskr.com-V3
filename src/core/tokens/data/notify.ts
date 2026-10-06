/**
 * @file tokens/data/notify.js
 * @description Toast severity levels — drives the `site-toast--<type>` BEM
 * modifier and the ARIA role mapping (error → role=alert, everything else →
 * role=status). ERROR reuses the 'error' literal owned by the window-event
 * group so the vocabulary stays single-declared.
 */

import { WINDOW_EVENTS } from '../events/dom.js'

/**
 * Notifies types.
 */
export const NOTIFY_TYPES = Object.freeze({
  ERROR: WINDOW_EVENTS.ERROR,
  INFO: 'info',
  SUCCESS: 'success',
})
