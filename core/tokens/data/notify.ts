/**
 * @file tokens/data/notify.js
 * @description Toast severity levels — drives the `site-toast--<type>` BEM
 * modifier and the ARIA role mapping (error → role=alert, everything else →
 * role=status). ERROR reuses the 'error' literal owned by the window-event
 * group so the vocabulary stays single-declared.
 */

import { WINDOW_EVENTS } from '../events/dom.js'

/**
 * Toast severity tokens. ERROR intentionally aliases `WINDOW_EVENTS.ERROR`
 * so the 'error' literal stays single-declared — the toast modifier and the
 * window event name share one token source (zero-hardcoding).
 */
export const NOTIFY_TYPES = Object.freeze({
  ERROR: WINDOW_EVENTS.ERROR,
  INFO: 'info',
  SUCCESS: 'success',
})
