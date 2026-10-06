/**
 * @file tokens/classes/home-carousel.js
 * @description Home carousel (`hc-*` block) class tokens — grouped subset of
 * CLASSES.
 */

import {
  _B_HC,
  _B_HC_AWARD,
  _B_HC_BTN,
  _B_HC_BTN_RING,
  _B_HC_DOT,
  _B_HC_SLIDE,
  _B_HC_SLIDE_CLONE,
} from '../base.js'

/**
 * The HC_CLASSES constant.
 */
export const HC_CLASSES = Object.freeze({
  HC: _B_HC,
  HC_IN_VIEW: `${_B_HC}--in-view`,
  HC_CONTROLS: `${_B_HC}-controls`,
  HC_DOTS: `${_B_HC}-dots`,
  HC_DOT: _B_HC_DOT,
  HC_DOT_ACTIVE: `${_B_HC_DOT}--active`,
  HC_TRACK: `${_B_HC}-track`,
  HC_SLIDE: _B_HC_SLIDE,
  HC_SLIDE_ACTIVE: `${_B_HC_SLIDE}--active`,
  HC_SLIDE_CLONE: _B_HC_SLIDE_CLONE,
  HC_SLIDE_CLONE_LAST: `${_B_HC_SLIDE_CLONE}-last`,
  HC_SLIDE_CLONE_FIRST: `${_B_HC_SLIDE_CLONE}-first`,
  HC_BTN: _B_HC_BTN,
  HC_BTN_PREV: `${_B_HC_BTN}--prev`,
  HC_BTN_NEXT: `${_B_HC_BTN}--next`,
  HC_BTN_RING: _B_HC_BTN_RING,
  HC_BTN_RING_TRACK: `${_B_HC_BTN_RING}-track`,
  HC_BTN_RING_FILL: `${_B_HC_BTN_RING}-fill`,
  HC_BTN_ARROW: `${_B_HC_BTN}-arrow`,
  HC_BTN_CANVAS: `${_B_HC_BTN}-canvas`,
  HC_SPACER: `${_B_HC}-spacer`,
  HC_AWARD: _B_HC_AWARD,
  HC_AWARD_MEDIA: `${_B_HC_AWARD}-media`,
  HC_AWARD_IMG: `${_B_HC_AWARD}-img`,
  HC_AWARD_TEXT: `${_B_HC_AWARD}-text`,
  HC_SLIDE_CONTENT: `${_B_HC}-slide-content`,
  HC_AWARDS: `${_B_HC}--awards`,
})

/** <home-carousel> render-mode names — awards strip vs selected work. */
export const HC_VARIANTS = Object.freeze({
  SELECTED: 'selected',
  AWARDS: 'awards',
})
