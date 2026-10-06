/**
 * @file tokens/classes/state.js
 * @description Global state modifier class tokens — grouped subset of
 * CLASSES.
 */

import { _K_ACTIVE } from '../base.js'

/**
 * The STATE_CLASSES constant.
 */
export const STATE_CLASSES = Object.freeze({
  ACTIVE: _K_ACTIVE,
  IS_OPEN: 'is-open',
  IS_TRUNCATED: 'is-truncated',
  IS_FALLBACK: 'is-fallback',
  HAS_FALLBACK: 'has-fallback',
  IS_SAFARI: 'is-safari',
  REDUCED_MOTION: 'reduced-motion',
  DARK_MODE: 'dark-mode',
  SHOW_GRID: 'show-grid',
  PAGE_FADE_IN: 'page-fade-in',
  PAGE_FADE_OUT: 'page-fade-out',
})
