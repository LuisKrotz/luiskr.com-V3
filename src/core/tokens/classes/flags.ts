/**
 * @file tokens/classes/flags.js
 * @description Language flag class tokens — token group.
 */

import { _B_FLAG, _B_FLAG_CANVAS } from '../base.js'

/**
 * flags classes.
 */
export const FLAG_CLASSES = Object.freeze({
  // Flag images — SVG from local repo
  FLAG_IMG: `${_B_FLAG}-img`,
  FLAG_SPLIT: `${_B_FLAG}-split`,
  FLAG_CANVAS: _B_FLAG_CANVAS,
  FLAG_CANVAS_NAV: `${_B_FLAG_CANVAS}--nav`,
})
