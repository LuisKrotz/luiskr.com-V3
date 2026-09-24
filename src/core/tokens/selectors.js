/**
 * @file @core/tokens/selectors.js
 * @description Centralized DOM selector tokens for public components and tests.
 */

const _B_HOME_MOSAIC = 'home-mosaic'
const _B_CAROUSEL = 'carousel'
const _B_CAROUSEL_BTN = 'carousel-btn'
const _B_CAROUSEL_SLIDE = 'carousel-slide'
const _B_DRAW_TEXT = 'draw-text'
const _B_COOKIES = 'cookies'

export const SELECTORS = Object.freeze({
  HOME_MOSAIC: `.${_B_HOME_MOSAIC}`,
  HOME_MOSAIC_ITEM: `.${_B_HOME_MOSAIC}-item`,
  HOME_MOSAIC_DESC: `.${_B_HOME_MOSAIC}-desc`,
  CAROUSEL: `.${_B_CAROUSEL}`,
  CAROUSEL_TRACK: `.${_B_CAROUSEL}-track`,
  CAROUSEL_FALLBACK: `.${_B_CAROUSEL}-fallback`,
  CAROUSEL_BTN_PREV: `.${_B_CAROUSEL_BTN}--prev`,
  CAROUSEL_BTN_NEXT: `.${_B_CAROUSEL_BTN}--next`,
  CAROUSEL_BTN_RING_FILL: `.${_B_CAROUSEL_BTN}-ring-fill`,
  CAROUSEL_DOT: `.${_B_CAROUSEL}-dot`,
  CAROUSEL_COUNTER: `.${_B_CAROUSEL}-counter`,
  CAROUSEL_SLIDE_CLONE_FIRST: `.${_B_CAROUSEL_SLIDE}--clone-first`,
  CAROUSEL_SLIDE_CLONE_LAST: `.${_B_CAROUSEL_SLIDE}--clone-last`,
  CAROUSEL_SLIDES_NOT_CLONE: `.${_B_CAROUSEL_SLIDE}:not(.${_B_CAROUSEL_SLIDE}--clone)`,
  DRAW_TEXT: `.${_B_DRAW_TEXT}`,
  COOKIES_BUTTONS_ACCEPT: `.${_B_COOKIES}-buttons-accept`,
  COOKIES_BUTTONS_REFUSE: `.${_B_COOKIES}-buttons-refuse`,
  STYLE: 'style',
  DATA_CONTENT: '[data-content]',
})
