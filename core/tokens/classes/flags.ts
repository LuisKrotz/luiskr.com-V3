/**
 * @file tokens/classes/flags.js
 * @description Language flag class tokens — token group.
 */

import { _B_FLAG, _B_FLAG_CANVAS } from '../base.js'

/**
 * Language-flag classes — `flag-img`/`flag-split` for the SVG flag images,
 * `flag-canvas`/`flag-canvas--nav` for the WebGL/2D-drawn flag surfaces in
 * the locale picker. `_B_FLAG_CANVAS` is its own block so canvas variants
 * (nav vs dialog sizing) key off `--nav` modifiers.
 */
export const FLAG_CLASSES = Object.freeze({
  // Flag images — SVG from local repo
  FLAG_IMG: `${_B_FLAG}-img`,
  FLAG_SPLIT: `${_B_FLAG}-split`,
  FLAG_CANVAS: _B_FLAG_CANVAS,
  FLAG_CANVAS_NAV: `${_B_FLAG_CANVAS}--nav`,
})
