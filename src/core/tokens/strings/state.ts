/**
 * @file tokens/strings/state.js
 * @description State/display value string tokens — grouped subset of
 * STRINGS.
 */

import { _K_SYSTEM } from '../base.js'

/**
 * The STATE_STRINGS constant.
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
