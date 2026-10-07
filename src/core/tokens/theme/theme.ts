/**
 * @file tokens/theme/theme.js
 * @description Theme value tokens — dark/light/system registry.
 */

import { _K_SYSTEM } from '../base.js'

/**
 * Frozen theme theme map — sole declaration site for these tokens; consumers read members
 * and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the
 * token contract immutable at runtime.
 */
export const THEME = Object.freeze({
  DARK: 'dark',
  LIGHT: 'light',
  SYSTEM: _K_SYSTEM,
})

/**
 * Frozen motion map — sole declaration site for these tokens; consumers read members and
 * never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the token
 * contract immutable at runtime.
 */
export const MOTION = Object.freeze({
  FULL: 'full',
  REDUCED: 'reduced',
})
