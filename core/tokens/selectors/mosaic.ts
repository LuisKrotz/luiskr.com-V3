/**
 * @file tokens/selectors/mosaic.js
 * @description Home mosaic selector tokens — token group.
 */

import { _B_HOME_MOSAIC } from '../base.js'

/**
 * Frozen mosaic selector map — sole declaration site for these tokens; consumers read
 * members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
 * the token contract immutable at runtime.
 */
export const MOSAIC_SELECTORS = Object.freeze({
  HOME_MOSAIC: `.${_B_HOME_MOSAIC}`,
  HOME_MOSAIC_ITEM: `.${_B_HOME_MOSAIC}-item`,
})
