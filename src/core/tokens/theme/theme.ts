/**
 * @file tokens/theme/theme.js
 * @description Theme value tokens — dark/light/system registry.
 */

import { _K_SYSTEM } from '../base.js'

/**
 * The THEME constant.
 */
export const THEME = Object.freeze({
  DARK: 'dark',
  LIGHT: 'light',
  SYSTEM: _K_SYSTEM,
})

/**
 * The MOTION constant.
 */
export const MOTION = Object.freeze({
  FULL: 'full',
  REDUCED: 'reduced',
})
