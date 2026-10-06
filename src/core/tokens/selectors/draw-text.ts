/**
 * @file tokens/selectors/draw-text.js
 * @description DrawText selector tokens — token group.
 */

import { _B_DRAW_TEXT } from '../base.js'
import { DRAW_TEXT_CLASSES } from '../classes/draw-text.js'

/**
 * Draws text selectors.
 */
export const DRAW_TEXT_SELECTORS = Object.freeze({
  DRAW_TEXT: `.${_B_DRAW_TEXT}`,
  DRAW_TEXT_WORD: `.${DRAW_TEXT_CLASSES.DRAW_TEXT_WORD}`,
  DRAW_TEXT_CHAR: `.${DRAW_TEXT_CLASSES.DRAW_TEXT_CHAR}`,
  DRAW_TEXT_SPACE: `.${DRAW_TEXT_CLASSES.DRAW_TEXT_SPACE}`,
})
