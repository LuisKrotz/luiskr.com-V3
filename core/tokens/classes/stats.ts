/**
 * @file tokens/classes/stats.js
 * @description Stats HUD / autoplay toggle class tokens — grouped subset of
 * CLASSES.
 */

import { _B_STATS_HUD } from '../base.js'

/**
 * Frozen stats class-name map — sole declaration site for these tokens; consumers read
 * members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
 * the token contract immutable at runtime.
 */
export const STATS_CLASSES = Object.freeze({
  STATS_HUD_BASE: _B_STATS_HUD,
  STATS_HUD_VISIBLE: `${_B_STATS_HUD}--visible`,
  STATS_HUD_SEGMENT: `${_B_STATS_HUD}-segment`,
  STATS_HUD_LABEL: `${_B_STATS_HUD}-label`,
  STATS_HUD_VALUE: `${_B_STATS_HUD}-value`,
  STATS_HUD_TOGGLE: `${_B_STATS_HUD}-toggle`,
  STATS_HUD_SWITCH: `${_B_STATS_HUD}-switch`,
  STATS_HUD_SWITCH_ON: `${_B_STATS_HUD}-switch--on`,
})
