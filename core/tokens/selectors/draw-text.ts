/**
 * @file tokens/selectors/draw-text.js
 * @description DrawText selector tokens — token group.
 */

import { _B_DRAW_TEXT } from '../base.js'
import { DRAW_TEXT_CLASSES } from '../classes/draw-text.js'

/**
 * Selector strings for the draw-text surface — the component root plus
 * the word/char/space spans the stagger animation targets. Composed from
 * the class tokens so selectors stay correct if a class name changes.
 */
export const DRAW_TEXT_SELECTORS = Object.freeze({
  DRAW_TEXT: `.${_B_DRAW_TEXT}`,
  DRAW_TEXT_WORD: `.${DRAW_TEXT_CLASSES.DRAW_TEXT_WORD}`,
  DRAW_TEXT_CHAR: `.${DRAW_TEXT_CLASSES.DRAW_TEXT_CHAR}`,
  DRAW_TEXT_SPACE: `.${DRAW_TEXT_CLASSES.DRAW_TEXT_SPACE}`,
})
