/**
 * @file tokens/attrs/data.js
 * @description `data-*` attribute tokens — token group.
 */

import { _DATA } from '../base.js'

/**
 * Frozen data attribute-name map — sole declaration site for these tokens; consumers read
 * members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
 * the token contract immutable at runtime.
 */
export const DATA_ATTRS = Object.freeze({
  DATA_INDEX: `${_DATA}index`,
  DATA_LANG: `${_DATA}lang`,
  DATA_FLAG: `${_DATA}flag`,
  DATA_SWITCH: `${_DATA}switch`,
  DATA_TAB: `${_DATA}tab`,
  DATA_IDX: `${_DATA}idx`,
  DATA_SEC: `${_DATA}sec`,
  DATA_TIDX: `${_DATA}tidx`,
  DATA_COL: `${_DATA}col`,
  DATA_MIDX: `${_DATA}midx`,
  DATA_SIZE: `${_DATA}size`,
  DATA_ACTION: `${_DATA}action`,
  DATA_FIELD: `${_DATA}field`,
  DATA_DIM_IDX: `${_DATA}dim-idx`,
  DATA_PROP: `${_DATA}prop`,
  DATA_THEME: `${_DATA}theme`,
  DATA_CONTENT: `${_DATA}content`,
  DATA_CAROUSEL_IDX: `${_DATA}carousel-idx`,
  DATA_SEC_IDX: `${_DATA}sec-idx`,
  DATA_PARAM: `${_DATA}param`,
  DATA_CHECK: `${_DATA}check`,
  DATA_APP_WRAPPER: `${_DATA}app-wrapper`,
})
