/**
 * @file tokens/classes/preferences.js
 * @description Preferences modal class tokens — all composed from the `pref`
 * block. Grouped token group.
 */

import {
  _B_PREF,
  _B_PREF_BACKDROP,
  _B_PREF_CLOSE,
  _B_PREF_OPTION,
  _B_PREF_OPTIONS,
  _B_PREF_SECTION,
  _B_PREF_SWITCH,
  _B_PREF_THEME,
  _B_PREF_THEME_BTN,
} from '../base.js'

/**
 * The PREF_CLASSES constant.
 */
export const PREF_CLASSES = Object.freeze({
  PREF_BACKDROP: _B_PREF_BACKDROP,
  PREF_BACKDROP_ENTER: `${_B_PREF_BACKDROP}--enter`,
  PREF_BACKDROP_LEAVE: `${_B_PREF_BACKDROP}--leave`,
  PREF_DIALOG: `${_B_PREF}-dialog`,
  PREF_HEADER: `${_B_PREF}-header`,
  PREF_TITLE: `${_B_PREF}-title`,
  PREF_CLOSE_BTN: `${_B_PREF_CLOSE}-btn`,
  PREF_CLOSE_CANVAS: `${_B_PREF_CLOSE}-canvas`,
  PREF_BODY: `${_B_PREF}-body`,
  PREF_SECTION: _B_PREF_SECTION,
  PREF_SECTION_TITLE: `${_B_PREF_SECTION}-title`,
  PREF_SECTION_DESC: `${_B_PREF_SECTION}-desc`,
  PREF_OPTIONS: _B_PREF_OPTIONS,
  PREF_OPTIONS_2: `${_B_PREF_OPTIONS} ${_B_PREF_OPTIONS}--2`,
  PREF_OPTIONS_3: `${_B_PREF_OPTIONS} ${_B_PREF_OPTIONS}--3`,
  PREF_OPTIONS_4: `${_B_PREF_OPTIONS} ${_B_PREF_OPTIONS}--4`,
  PREF_OPTION_BTN: `${_B_PREF_OPTION}-btn`,
  PREF_OPTION_ICON: `${_B_PREF_OPTION}-icon`,
  PREF_OPTION_LABEL: `${_B_PREF_OPTION}-label`,
  PREF_OPTION_SUB: `${_B_PREF_OPTION}-sub`,
  PREF_STAT_CARD: `${_B_PREF}-stat-card`,
  PREF_FOOTER: `${_B_PREF}-footer`,
  PREF_DONE_BTN: `${_B_PREF}-done-btn`,
  PREF_SWITCH_ROW: `${_B_PREF_SWITCH}-row`,
  PREF_SWITCH_INFO: `${_B_PREF_SWITCH}-info`,
  PREF_SWITCH_LABEL: `${_B_PREF_SWITCH}-label`,
  PREF_SWITCH_DESC: `${_B_PREF_SWITCH}-desc`,
  PREF_SWITCH: _B_PREF_SWITCH,
  PREF_SWITCH_ON: `${_B_PREF_SWITCH} ${_B_PREF_SWITCH}--on`,
  PREF_SWITCH_CANVAS: `${_B_PREF_SWITCH}-canvas`,
  PREF_THEME_WRAPPER: `${_B_PREF_THEME}-wrapper`,
  PREF_THEME_SLIDER: `${_B_PREF_THEME}-slider`,
  PREF_THEME_CANVAS: `${_B_PREF_THEME}-canvas`,
  PREF_THEME_LABELS: `${_B_PREF_THEME}-labels`,
  PREF_THEME_BTN: _B_PREF_THEME_BTN,
  PREF_THEME_BTN_ACTIVE: `${_B_PREF_THEME_BTN}--active`,
})
