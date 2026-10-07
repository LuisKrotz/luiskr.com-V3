/**
 * @file tokens/theme/switches.js
 * @description Switch slider context types — `data-switch` values
 * identifying which preferences toggle a SwitchWebGL canvas drives. Shared
 * by PreferencesModal markup and switch-slider logic.
 */

/**
 * Switch slider context types. Sole declaration site — consumers import members
 * from this frozen map rather than re-declaring the literals
 * (zero-hardcoding rule).
 */
export const SWITCH_TYPES = Object.freeze({
  STATS: 'stats',
  GRID: 'grid',
  MOTION: 'motion',
  CYAN: 'cyan',
  SPACE: 'space',
})
