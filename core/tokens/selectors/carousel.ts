/**
 * @file tokens/selectors/carousel.js
 * @description Custom carousel selector tokens — grouped subset of
 * SELECTORS.
 */

import { _B_CAROUSEL, _B_CAROUSEL_BTN, _B_CAROUSEL_SLIDE } from '../base.js'

/**
 * Frozen carousel selector map — sole declaration site for these tokens; consumers read
 * members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
 * the token contract immutable at runtime.
 */
export const CAROUSEL_SELECTORS = Object.freeze({
  CAROUSEL: `.${_B_CAROUSEL}`,
  CAROUSEL_TRACK: `.${_B_CAROUSEL}-track`,
  CAROUSEL_FALLBACK: `.${_B_CAROUSEL}-fallback`,
  CAROUSEL_BTN_PREV: `.${_B_CAROUSEL_BTN}--prev`,
  CAROUSEL_BTN_NEXT: `.${_B_CAROUSEL_BTN}--next`,
  CAROUSEL_BTN_CANVAS: `.${_B_CAROUSEL_BTN}-canvas`,
  CAROUSEL_BTN_RING_FILL: `.${_B_CAROUSEL_BTN}-ring-fill`,
  CAROUSEL_DOT: `.${_B_CAROUSEL}-dot`,
  CAROUSEL_COUNTER: `.${_B_CAROUSEL}-counter`,
  CAROUSEL_SLIDE_CLONE_FIRST: `.${_B_CAROUSEL_SLIDE}--clone-first`,
  CAROUSEL_SLIDE_CLONE_LAST: `.${_B_CAROUSEL_SLIDE}--clone-last`,
  CAROUSEL_SLIDES_NOT_CLONE: `.${_B_CAROUSEL_SLIDE}:not(.${_B_CAROUSEL_SLIDE}--clone)`,
})
