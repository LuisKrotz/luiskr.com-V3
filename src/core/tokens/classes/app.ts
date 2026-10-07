/**
 * @file tokens/classes/app.js
 * @description App shell class tokens — progress bar + view outlet. Grouped
 * token group.
 */

import { _B_PROGRESS_BAR, _K_VIEW_OUTLET } from '../base.js'

/**
 * Frozen app class-name map — sole declaration site for these tokens; consumers read members
 * and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the
 * token contract immutable at runtime.
 */
export const APP_CLASSES = Object.freeze({
  PROGRESS_BAR: _B_PROGRESS_BAR,
  PROGRESS_BAR_ACTIVE: `${_B_PROGRESS_BAR}--active`,
  PROGRESS_BAR_DONE: `${_B_PROGRESS_BAR}--done`,
  VIEW_OUTLET: _K_VIEW_OUTLET,
})
