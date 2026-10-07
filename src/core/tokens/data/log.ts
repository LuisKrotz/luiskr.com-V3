/**
 * @file tokens/data/log.ts
 * @description Dev-log severity levels + the globalThis inspection key.
 * ERROR reuses the 'error' literal owned by the window-event group so the
 * vocabulary stays single-declared; WARN/INFO are declared here once and
 * nowhere else.
 */

import { WINDOW_EVENTS } from '../events/dom.js'

/**
 * Frozen log map — sole declaration site for these tokens; consumers read members and never
 * re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the token contract
 * immutable at runtime.
 */
export const LOG_LEVELS = Object.freeze({
  WARN: 'warn',
  ERROR: WINDOW_EVENTS.ERROR,
  INFO: 'info',
})

/**
 * The DEV_LOG constant — buffer sizing + the devtools inspection key.
 */
export const DEV_LOG = Object.freeze({
  /** Max retained entries — oldest entries drop off the front. */
  MAX_ENTRIES: 256,
  /** globalThis key exposing getDevLog() for devtools inspection. */
  GLOBAL_KEY: '__lkDevLog',
})
