/**
 * @file tokens/selectors/skeleton.js
 * @description Skeleton placeholder selector tokens — grouped subset of
 * SELECTORS.
 */

import { _B_SKELETON } from '../base.js'

/**
 * The SKELETON_SELECTORS constant.
 */
export const SKELETON_SELECTORS = Object.freeze({
  SKELETON_ANY: `[class*="${_B_SKELETON}-"]:not(.${_B_SKELETON}-layer):not(.has-${_B_SKELETON}-layer)`,
  SKELETON_TEXT_LIKE: `[class*="${_B_SKELETON}--para"], [class*="${_B_SKELETON}--title"], [class*="${_B_SKELETON}-about-"], [class*="${_B_SKELETON}--footer"], [class*="${_B_SKELETON}--section"]`,
})
