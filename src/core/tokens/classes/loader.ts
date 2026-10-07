/**
 * @file tokens/classes/loader.js
 * @description Intro loader class tokens — token group.
 */

import { _B_LOADER } from '../base.js'

/**
 * Frozen loader class-name map — sole declaration site for these tokens; consumers read
 * members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
 * the token contract immutable at runtime.
 */
export const LOADER_CLASSES = Object.freeze({
  INTRO_LOADER: _B_LOADER,
  INTRO_LOADER_PERCENT: `${_B_LOADER}-percent`,
  INTRO_LOADER_TERMINAL: `${_B_LOADER}-terminal`,
  INTRO_LOADER_LINE: `${_B_LOADER}-line`,
  INTRO_LOADER_HIDDEN: `${_B_LOADER}--hidden`,
})
