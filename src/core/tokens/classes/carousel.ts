/**
 * @file tokens/classes/carousel.js
 * @description Custom carousel class tokens (project/related carousels) —
 * token group.
 */

import {
  _B_CAROUSEL,
  _B_CAROUSEL_BTN,
  _B_CAROUSEL_BTN_RING,
  _B_CAROUSEL_DOT,
  _B_CAROUSEL_SLIDE,
  _B_CAROUSEL_SLIDE_CLONE,
} from '../base.js'

/**
 * Frozen carousel class-name map — sole declaration site for these tokens; consumers read
 * members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
 * the token contract immutable at runtime.
 */
export const CAROUSEL_CLASSES = Object.freeze({
  CAROUSEL: _B_CAROUSEL,
  CAROUSEL_CONTAINER: `${_B_CAROUSEL}-container`,
  CAROUSEL_TRACK: `${_B_CAROUSEL}-track`,
  CAROUSEL_SLIDE: _B_CAROUSEL_SLIDE,
  CAROUSEL_SLIDE_ACTIVE: `${_B_CAROUSEL_SLIDE}--active`,
  CAROUSEL_PREV: `${_B_CAROUSEL}-prev`,
  CAROUSEL_NEXT: `${_B_CAROUSEL}-next`,
  CAROUSEL_DOTS: `${_B_CAROUSEL}-dots`,
  CAROUSEL_DOT: _B_CAROUSEL_DOT,
  CAROUSEL_DOT_ACTIVE: `${_B_CAROUSEL_DOT}--active`,
  CAROUSEL_IN_VIEW: `${_B_CAROUSEL}--in-view`,
  CAROUSEL_FALLBACK: `${_B_CAROUSEL}-fallback`,
  CAROUSEL_FALLBACK_SIDE: `${_B_CAROUSEL}-fallback ${_B_CAROUSEL}-fallback--side`,
  CAROUSEL_CONTROLS: `${_B_CAROUSEL}-controls`,
  CAROUSEL_INDICATORS: `${_B_CAROUSEL}-indicators`,
  CAROUSEL_COUNTER: `${_B_CAROUSEL}-counter`,
  CAROUSEL_BTN: _B_CAROUSEL_BTN,
  CAROUSEL_BTN_PREV: `${_B_CAROUSEL_BTN} ${_B_CAROUSEL_BTN}--prev`,
  CAROUSEL_BTN_NEXT: `${_B_CAROUSEL_BTN} ${_B_CAROUSEL_BTN}--next`,
  CAROUSEL_BTN_RING: _B_CAROUSEL_BTN_RING,
  CAROUSEL_BTN_RING_TRACK: `${_B_CAROUSEL_BTN_RING}-track`,
  CAROUSEL_BTN_RING_FILL: `${_B_CAROUSEL_BTN_RING}-fill`,
  CAROUSEL_BTN_ARROW: `${_B_CAROUSEL_BTN}-arrow`,
  CAROUSEL_BTN_CANVAS: `${_B_CAROUSEL_BTN}-canvas`,
  CAROUSEL_SLIDE_CLONE: `${_B_CAROUSEL_SLIDE} ${_B_CAROUSEL_SLIDE_CLONE}`,
  CAROUSEL_SLIDE_CLONE_LAST: `${_B_CAROUSEL_SLIDE} ${_B_CAROUSEL_SLIDE_CLONE} ${_B_CAROUSEL_SLIDE_CLONE}-last`,
  CAROUSEL_SLIDE_CLONE_FIRST: `${_B_CAROUSEL_SLIDE} ${_B_CAROUSEL_SLIDE_CLONE} ${_B_CAROUSEL_SLIDE_CLONE}-first`,
})
