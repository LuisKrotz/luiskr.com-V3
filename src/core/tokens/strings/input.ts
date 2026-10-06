/**
 * @file tokens/strings/input.js
 * @description Input-modality string tokens (pointer types, touch event
 * sniffing) — token group.
 */

import { _K_FOCUS, _K_POINTERENTER, _K_TOUCHSTART } from '../base.js'

/**
 * The INPUT_STRINGS constant.
 */
export const INPUT_STRINGS = Object.freeze({
  MOUSE: 'mouse',
  PEN: 'pen',
  TOUCH: 'touch',
  POINTER: 'pointer',
  POINTERENTER: _K_POINTERENTER,
  TOUCHSTART: _K_TOUCHSTART,
  ONTOUCHSTART: 'ontouchstart',
  FOCUS: _K_FOCUS,
})
