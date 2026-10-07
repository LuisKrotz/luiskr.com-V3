/**
 * @file tokens/events/dom.js
 * @description Native DOM event-name tokens split by input modality —
 * grouped subsets of EVENTS.
 */

import { _K_FOCUS, _K_INPUT, _K_POINTERENTER, _K_TOUCHSTART } from '../base.js'

/**
 * Frozen mouse event-name map — sole declaration site for these tokens; consumers read
 * members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
 * the token contract immutable at runtime.
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
 * Frozen touch event-name map — sole declaration site for these tokens; consumers read
 * members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
 * the token contract immutable at runtime.
 */
export const TOUCH_EVENTS = Object.freeze({
  TOUCHSTART: _K_TOUCHSTART,
  TOUCHEND: 'touchend',
  TOUCHMOVE: 'touchmove',
})

/**
 * Frozen pointer event-name map — sole declaration site for these tokens; consumers read
 * members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
 * the token contract immutable at runtime.
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
 * Frozen keyboard event-name map — sole declaration site for these tokens; consumers read
 * members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
 * the token contract immutable at runtime.
 */
export const KEYBOARD_EVENTS = Object.freeze({
  KEYDOWN: 'keydown',
  KEYUP: 'keyup',
})

/**
 * Frozen focus event-name map — `focusin`/`focusout` bubble (needed for
 * delegation on shadow hosts) while `focus`/`blur` do not; both pairs are
 * kept so listeners pick the right variant for the propagation model.
 */
export const FOCUS_EVENTS = Object.freeze({
  FOCUS: _K_FOCUS,
  BLUR: 'blur',
  FOCUSIN: 'focusin',
  FOCUSOUT: 'focusout',
})

/**
 * Frozen form event-name map — sole declaration site for these tokens; consumers read
 * members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
 * the token contract immutable at runtime.
 */
export const FORM_EVENTS = Object.freeze({
  CHANGE: 'change',
  INPUT: _K_INPUT,
  SUBMIT: 'submit',
})

/**
 * Frozen drag event-name map — the HTML5 drag-and-drop subset used by CMS
 * upload zones (`drop` fires on the target, `dragover` must be
 * preventDefault'ed for drop to be allowed per the DnD spec).
 */
export const DRAG_EVENTS = Object.freeze({
  DRAGSTART: 'dragstart',
  DRAGOVER: 'dragover',
  DRAGLEAVE: 'dragleave',
  DROP: 'drop',
})

/**
 * Frozen window event-name map — sole declaration site for these tokens; consumers read
 * members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
 * the token contract immutable at runtime.
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
 * Frozen media event-name map — sole declaration site for these tokens; consumers read
 * members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
 * the token contract immutable at runtime.
 */
export const MEDIA_EVENTS = Object.freeze({
  LOADEDDATA: 'loadeddata',
  ABORT: 'abort',
})

/**
 * Frozen animation event-name map — sole declaration site for these tokens; consumers read
 * members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
 * the token contract immutable at runtime.
 */
export const ANIMATION_EVENTS = Object.freeze({
  TRANSITIONEND: 'transitionend',
  ANIMATIONEND: 'animationend',
})

/**
 * Frozen gl event-name map — sole declaration site for these tokens; consumers read members
 * and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the
 * token contract immutable at runtime.
 */
export const GL_EVENTS = Object.freeze({
  WEBGL_CONTEXT_LOST: 'webglcontextlost',
})
