/**
 * @file tokens/classes/stats.js
 * @description Stats HUD / autoplay toggle class tokens — grouped subset of
 * CLASSES.
 */

import { _B_STATS_HUD } from '../base.js'

/**
 * The STATS_CLASSES constant.
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
