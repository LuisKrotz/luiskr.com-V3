/**
 * @file tokens/classes/awards-carousel.js
 * @description Awards carousel (`aw-c-*` block) class tokens — grouped subset of
 * CLASSES.
 */

import {
  _B_AWC,
  _B_AWC_AWARD,
  _B_AWC_BTN,
  _B_AWC_BTN_RING,
  _B_AWC_DOT,
  _B_AWC_SLIDE,
  _B_AWC_SLIDE_CLONE,
} from '../base.js'

/**
 * The AWC_CLASSES constant.
 */
export const AWC_CLASSES = Object.freeze({
  AWC: _B_AWC,
  AWC_IN_VIEW: `${_B_AWC}--in-view`,
  AWC_CONTROLS: `${_B_AWC}-controls`,
  AWC_DOTS: `${_B_AWC}-dots`,
  AWC_DOT: _B_AWC_DOT,
  AWC_DOT_ACTIVE: `${_B_AWC_DOT}--active`,
  AWC_TRACK: `${_B_AWC}-track`,
  AWC_SLIDE: _B_AWC_SLIDE,
  AWC_SLIDE_ACTIVE: `${_B_AWC_SLIDE}--active`,
  AWC_SLIDE_CLONE: _B_AWC_SLIDE_CLONE,
  AWC_SLIDE_CLONE_LAST: `${_B_AWC_SLIDE_CLONE}-last`,
  AWC_SLIDE_CLONE_FIRST: `${_B_AWC_SLIDE_CLONE}-first`,
  AWC_BTN: _B_AWC_BTN,
  AWC_BTN_PREV: `${_B_AWC_BTN}--prev`,
  AWC_BTN_NEXT: `${_B_AWC_BTN}--next`,
  AWC_BTN_RING: _B_AWC_BTN_RING,
  AWC_BTN_RING_TRACK: `${_B_AWC_BTN_RING}-track`,
  AWC_BTN_RING_FILL: `${_B_AWC_BTN_RING}-fill`,
  AWC_BTN_ARROW: `${_B_AWC_BTN}-arrow`,
  AWC_BTN_CANVAS: `${_B_AWC_BTN}-canvas`,
  AWC_SPACER: `${_B_AWC}-spacer`,
  AWC_AWARD: _B_AWC_AWARD,
  AWC_AWARD_MEDIA: `${_B_AWC_AWARD}-media`,
  AWC_AWARD_IMG: `${_B_AWC_AWARD}-img`,
  AWC_AWARD_TEXT: `${_B_AWC_AWARD}-text`,
  AWC_SLIDE_CONTENT: `${_B_AWC}-slide-content`,
  AWC_AWARDS: `${_B_AWC}--awards`,
})

/** <awards-carousel> render-mode names — awards strip vs selected work. */
export const AWC_VARIANTS = Object.freeze({
  SELECTED: 'selected',
  AWARDS: 'awards',
})
