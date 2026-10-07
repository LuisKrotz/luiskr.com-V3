/**
 * @file tokens/strings/state.js
 * @description State/display value string tokens — grouped subset of
 * STRINGS.
 */

import { _K_SYSTEM } from '../base.js'

/**
 * Frozen state string map — sole declaration site for these tokens; consumers read members
 * and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the
 * token contract immutable at runtime.
 */
export const STATE_STRINGS = Object.freeze({
  NONE: 'none',
  BLOCK: 'block',
  AUTO: 'auto',
  SMOOTH: 'smooth',
  INSTANT: 'instant',
  TRUE: 'true',
  FALSE: 'false',
  GRANTED: 'granted',
  DENIED: 'denied',
  OPEN: 'open',
  FIXED: 'fixed',
  ABSOLUTE: 'absolute',
  RELATIVE: 'relative',
  HIDDEN: 'hidden',
  HIGH: 'high',
  DEFAULT: 'default',
  LANDSCAPE: 'landscape',
  SYSTEM: _K_SYSTEM,
})
