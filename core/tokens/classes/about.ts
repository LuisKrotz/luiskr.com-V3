/**
 * @file tokens/classes/about.js
 * @description About section class tokens — token group.
 */

import {
  _B_ABOUT,
  _B_ABOUT_ITEM,
  _B_ABOUT_PROFILE,
  _B_ABOUT_PROFILE_PICTURE,
  _B_ABOUT_PROFILE_TEXT,
} from '../base.js'

/**
 * Frozen about class-name map — sole declaration site for these tokens; consumers read
 * members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
 * the token contract immutable at runtime.
 */
export const ABOUT_CLASSES = Object.freeze({
  ABOUT: _B_ABOUT,
  ABOUT_TITLE: `${_B_ABOUT}-title`,
  ABOUT_PROFILE_SECTION: `${_B_ABOUT_PROFILE}-section`,
  ABOUT_PROFILE_PICTURE: _B_ABOUT_PROFILE_PICTURE,
  ABOUT_PROFILE_PICTURE_IMG: `${_B_ABOUT_PROFILE_PICTURE}-img`,
  ABOUT_PROFILE_PICTURE_PLACEHOLDER: `${_B_ABOUT_PROFILE_PICTURE}-placeholder`,
  ABOUT_PROFILE_TEXT: _B_ABOUT_PROFILE_TEXT,
  ABOUT_PROFILE_TEXT_COL: `${_B_ABOUT_PROFILE_TEXT}-col`,
  ABOUT_ITEM: _B_ABOUT_ITEM,
  ABOUT_ITEM_TEXT: `${_B_ABOUT_ITEM}-text`,
  ABOUT_SIDE_INFO: `${_B_ABOUT}-side-info`,
  ABOUT_SIDE_INFO_SUMMARY: `${_B_ABOUT}-side-info-summary`,
  ABOUT_SIDE_INFO_CHEVRON: `${_B_ABOUT}-side-info-chevron`,
})
