/**
 * @file tokens/classes/effects.js
 * @description Ambient effect canvas class tokens — fluid background,
 * magnetic cursor, image distortion. Grouped token group.
 */

import { _B_CURSOR, _B_DISTORT, _B_FLUID_BG } from '../base.js'

/**
 * The FLUID_BG_CLASSES constant.
 */
export const FLUID_BG_CLASSES = Object.freeze({
  FLUID_BG: _B_FLUID_BG,
  FLUID_BG_CANVAS: `${_B_FLUID_BG}-canvas`,
})

/**
 * The CURSOR_CLASSES constant.
 */
export const CURSOR_CLASSES = Object.freeze({
  MAGNETIC_CURSOR: _B_CURSOR,
  MAGNETIC_CURSOR_DOT: `${_B_CURSOR}-dot`,
  MAGNETIC_CURSOR_HOVER: `${_B_CURSOR}--hover`,
  MAGNETIC_CURSOR_HIDDEN: `${_B_CURSOR}--hidden`,
})

/**
 * The DISTORT_CLASSES constant.
 */
export const DISTORT_CLASSES = Object.freeze({
  IMAGE_DISTORT: _B_DISTORT,
  IMAGE_DISTORT_CANVAS: `${_B_DISTORT}-canvas`,
})
