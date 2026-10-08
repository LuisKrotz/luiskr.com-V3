/**
 * @file tokens/strings/input.js
 * @description Input-modality string tokens (pointer types, touch event
 * sniffing) — token group.
 */

import { _K_FOCUS, _K_POINTERENTER, _K_TOUCHSTART } from '../base.js'

/**
 * Frozen input string map — sole declaration site for these tokens; consumers read members
 * and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the
 * token contract immutable at runtime.
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
