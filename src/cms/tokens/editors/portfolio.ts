/**
 * @file @cms/tokens/portfolio.js
 * @description Portfolio-list editor classes + control IDs — item cards,
 * dimension grid, field bindings. Shared by the render and events
 * modules so the selector contract is single-source.
 */

import { _B_CMS, _B_CMS_CARD } from '../base.js'

const _B_PF = `${_B_CMS}-pf`

/**
 * Frozen cms portfolio class-name map — sole declaration site for these tokens; consumers
 * read members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze
 * makes the token contract immutable at runtime.
 */
export const CMS_PORTFOLIO_CLASSES = Object.freeze({
  CMS_PORTFOLIO_MANAGER: `${_B_CMS}-portfolio-manager`,
  CMS_CARD_LANG: `${_B_CMS_CARD}--lang`,
  CMS_SELECT_NARROW: `${_B_CMS}-select--narrow`,
  CMS_BTN_COMPACT: `${_B_CMS}-btn--compact`,
  CMS_PF_LIST: `${_B_PF}-list`,
  CMS_PF_EMPTY: `${_B_PF}-empty`,
  CMS_PF_ITEM: `${_B_PF}-item`,
  CMS_PF_HEAD: `${_B_PF}-head`,
  CMS_PF_IDENTITY: `${_B_PF}-identity`,
  CMS_PF_THUMB: `${_B_PF}-thumb`,
  CMS_PF_THUMB_IMG: `${_B_PF}-thumb-img`,
  CMS_PF_NOIMG: `${_B_PF}-noimg`,
  CMS_PF_TITLE: `${_B_PF}-title`,
  CMS_PF_FIELDS: `${_B_PF}-fields`,
  CMS_PF_IMAGE_ROW: `${_B_PF}-image-row`,
  CMS_PF_VIEW: `${_B_PF}-view`,
  CMS_PF_DIMS: `${_B_PF}-dims`,
  CMS_PF_DIMS_TITLE: `${_B_PF}-dims-title`,
  CMS_PF_DIMS_GRID: `${_B_PF}-dims-grid`,
  CMS_PF_DIM_LABEL: `${_B_PF}-dim-label`,
  ITEM_FIELD: 'item-field',
  DIM_FIELD: 'dim-field',
  FEAT_SELECT: 'feat-select',
})

/**
 * Frozen cms portfolio element-id map — sole declaration site for these tokens; consumers
 * read members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze
 * makes the token contract immutable at runtime.
 */
export const CMS_PORTFOLIO_IDS = Object.freeze({
  ADD_ITEM: 'btn-add-item',
  SYNC_ITEMS: 'btn-sync-items',
  SAVE_ITEMS: 'btn-save-items',
  SELECT_LANG: 'select-lang',
})
