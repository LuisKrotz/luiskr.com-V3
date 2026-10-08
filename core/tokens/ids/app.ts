/**
 * @file tokens/ids/app.js
 * @description App shell element id tokens — token group.
 */

import { _K_VIEW_OUTLET } from '../base.js'

/**
 * Frozen app element-id map — sole declaration site for these tokens; consumers read members
 * and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the
 * token contract immutable at runtime.
 */
export const APP_IDS = Object.freeze({
  APP: 'app',
  MAIN: 'main',
  MAIN_CONTENT: 'main-content',
  VIEW_OUTLET: _K_VIEW_OUTLET,
})
