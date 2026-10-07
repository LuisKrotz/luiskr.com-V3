/**
 * @file @cms/tokens/buttons.js
 * @description Button classes — base, groups and the primary/danger/
 * secondary modifier combos.
 */

import { _B_CMS_BTN } from '../base.js'

/**
 * Frozen cms button class-name map — sole declaration site for these tokens; consumers read
 * members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
 * the token contract immutable at runtime.
 */
export const CMS_BUTTON_CLASSES = Object.freeze({
  CMS_BTN: _B_CMS_BTN,
  CMS_BTN_GROUP: `${_B_CMS_BTN}-group`,
  CMS_BTN_PRIMARY: `${_B_CMS_BTN} ${_B_CMS_BTN}--primary`,
  CMS_BTN_DANGER: `${_B_CMS_BTN} ${_B_CMS_BTN}--danger`,
  CMS_BTN_SECONDARY: `${_B_CMS_BTN} ${_B_CMS_BTN}--secondary`,
  CMS_BTN_PRESET: `${_B_CMS_BTN}--preset`,
  CMS_BTN_ACTIVE: `${_B_CMS_BTN}--active`,
})
