/**
 * @file tokens/classes/draw-text.js
 * @description DrawText word/char reveal class tokens — grouped subset of
 * CLASSES.
 */

import { _B_DRAW_TEXT } from '../base.js'

/**
 * Draws text classes.
 */
export const DRAW_TEXT_CLASSES = Object.freeze({
  DRAW_TEXT: _B_DRAW_TEXT,
  DRAW_TEXT_WORD: `${_B_DRAW_TEXT}__word`,
  DRAW_TEXT_CHAR: `${_B_DRAW_TEXT}__char`,
  DRAW_TEXT_SPACE: `${_B_DRAW_TEXT}__space`,
  DRAW_TEXT_VISIBLE: `${_B_DRAW_TEXT}--visible`,
  DRAW_TEXT_DONE: `${_B_DRAW_TEXT}--done`,
  DRAW_TEXT_PENDING: `${_B_DRAW_TEXT}--pending`,
})
