/**
 * @file tokens/classes/app.js
 * @description App shell class tokens — progress bar + view outlet. Grouped
 * token group.
 */

import { _B_PROGRESS_BAR, _K_VIEW_OUTLET } from '../base.js'

/**
 * The APP_CLASSES constant.
 */
export const APP_CLASSES = Object.freeze({
  PROGRESS_BAR: _B_PROGRESS_BAR,
  PROGRESS_BAR_ACTIVE: `${_B_PROGRESS_BAR}--active`,
  PROGRESS_BAR_DONE: `${_B_PROGRESS_BAR}--done`,
  VIEW_OUTLET: _K_VIEW_OUTLET,
})
