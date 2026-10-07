/**
 * @file @cms/tokens/card.js
 * @description Card and section-shell classes — card blocks, section
 * headers and titles.
 */

import { _B_CMS_CARD, _B_CMS_SECTION } from '../base.js'

/**
 * Frozen cms card class-name map — sole declaration site for these tokens; consumers read
 * members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
 * the token contract immutable at runtime.
 */
export const CMS_CARD_CLASSES = Object.freeze({
  CMS_CARD: _B_CMS_CARD,
  CMS_CARD_TITLE: `${_B_CMS_CARD}-title`,
  CMS_CARD_SUBTITLE: `${_B_CMS_CARD}-subtitle`,
  CMS_SECTION_HEADER: `${_B_CMS_SECTION}-header`,
  CMS_SECTION_TITLE: `${_B_CMS_SECTION}-title`,
})
