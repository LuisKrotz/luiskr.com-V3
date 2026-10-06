/**
 * @file tokens/events/dom.js
 * @description Native DOM event-name tokens split by input modality —
 * grouped subsets of EVENTS.
 */

import { _K_FOCUS, _K_INPUT, _K_POINTERENTER, _K_TOUCHSTART } from '../base.js'

/**
 * The MOUSE_EVENTS constant.
 */
export const MOUSE_EVENTS = Object.freeze({
  CLICK: 'click',
  MOUSEENTER: 'mouseenter',
  MOUSELEAVE: 'mouseleave',
  MOUSEOVER: 'mouseover',
  MOUSEOUT: 'mouseout',
  MOUSEDOWN: 'mousedown',
  MOUSEUP: 'mouseup',
  WHEEL: 'wheel',
  CONTEXTMENU: 'contextmenu',
})

/**
 * The TOUCH_EVENTS constant.
 */
export const TOUCH_EVENTS = Object.freeze({
  TOUCHSTART: _K_TOUCHSTART,
  TOUCHEND: 'touchend',
  TOUCHMOVE: 'touchmove',
})

/**
 * The POINTER_EVENTS constant.
 */
export const POINTER_EVENTS = Object.freeze({
  POINTERDOWN: 'pointerdown',
  POINTERMOVE: 'pointermove',
  POINTERUP: 'pointerup',
  POINTERCANCEL: 'pointercancel',
  POINTERENTER: _K_POINTERENTER,
  POINTERLEAVE: 'pointerleave',
})

/**
 * The KEYBOARD_EVENTS constant.
 */
export const KEYBOARD_EVENTS = Object.freeze({
  KEYDOWN: 'keydown',
  KEYUP: 'keyup',
})

/**
 * focuses events.
 */
export const FOCUS_EVENTS = Object.freeze({
  FOCUS: _K_FOCUS,
  BLUR: 'blur',
  FOCUSIN: 'focusin',
  FOCUSOUT: 'focusout',
})

/**
 * The FORM_EVENTS constant.
 */
export const FORM_EVENTS = Object.freeze({
  CHANGE: 'change',
  INPUT: _K_INPUT,
  SUBMIT: 'submit',
})

/**
 * drags events.
 */
export const DRAG_EVENTS = Object.freeze({
  DRAGSTART: 'dragstart',
  DRAGOVER: 'dragover',
  DRAGLEAVE: 'dragleave',
  DROP: 'drop',
})

/**
 * The WINDOW_EVENTS constant.
 */
export const WINDOW_EVENTS = Object.freeze({
  SCROLL: 'scroll',
  SCROLLEND: 'scrollend',
  RESIZE: 'resize',
  POPSTATE: 'popstate',
  ERROR: 'error',
  UNHANDLED_REJECTION: 'unhandledrejection',
  LOAD: 'load',
  DOM_CONTENT_LOADED: 'DOMContentLoaded',
})

/**
 * The MEDIA_EVENTS constant.
 */
export const MEDIA_EVENTS = Object.freeze({
  LOADEDDATA: 'loadeddata',
  ABORT: 'abort',
})

/**
 * The ANIMATION_EVENTS constant.
 */
export const ANIMATION_EVENTS = Object.freeze({
  TRANSITIONEND: 'transitionend',
  ANIMATIONEND: 'animationend',
})

/**
 * The GL_EVENTS constant.
 */
export const GL_EVENTS = Object.freeze({
  WEBGL_CONTEXT_LOST: 'webglcontextlost',
})
