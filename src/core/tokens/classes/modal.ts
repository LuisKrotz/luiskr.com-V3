/**
 * @file tokens/classes/modal.js
 * @description Generic modal + media expand-modal class tokens — grouped
 * token group.
 */

import {
  _B_EXPAND_MODAL,
  _B_EXPAND_MODAL_CLOSE,
  _B_EXPAND_MODAL_CLOSE_BAR,
  _B_EXPAND_MODAL_CONTENT,
  _B_EXPAND_MODAL_MEDIA,
  _B_EXPAND_MODAL_MEDIA_FIGURE,
  _B_EXPAND_MODAL_MEDIA_ITEM,
  _B_MODAL,
} from '../base.js'

/**
 * Frozen modal class-name map — sole declaration site for these tokens; consumers read
 * members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
 * the token contract immutable at runtime.
 */
export const MODAL_CLASSES = Object.freeze({
  MODAL: _B_MODAL,
  MODAL_OPEN: `${_B_MODAL}-open`,
  MODAL_ABOVE: `${_B_MODAL}-above`,
  MODAL_BELOW: `${_B_MODAL}-below`,
  MODAL_CLOSE_BAR: `${_B_MODAL}-close-bar`,
  MODAL_BTN: `${_B_MODAL}-btn`,
})

/**
 * expands modal classes.
 */
export const EXPAND_MODAL_CLASSES = Object.freeze({
  EXPAND_MODAL_CONTENT: _B_EXPAND_MODAL_CONTENT,
  EXPAND_MODAL_CONTENT_VIDEO: `${_B_EXPAND_MODAL_CONTENT}--video`,
  EXPAND_MODAL_CLOSING: `${_B_EXPAND_MODAL}--closing`,
  EXPAND_MODAL_CLOSE_BAR: _B_EXPAND_MODAL_CLOSE_BAR,
  EXPAND_MODAL_CLOSE_BAR_TITLE: `${_B_EXPAND_MODAL_CLOSE_BAR}-title`,
  EXPAND_MODAL_CLOSE_BAR_BUTTON: `${_B_EXPAND_MODAL_CLOSE_BAR}-button`,
  EXPAND_MODAL_CLOSE_BAR_FALLBACK: `${_B_EXPAND_MODAL_CLOSE_BAR}-fallback`,
  EXPAND_MODAL_CLOSE_AREA: `${_B_EXPAND_MODAL_CLOSE}-area`,
  EXPAND_MODAL_CLOSE_BOTTOM: `${_B_EXPAND_MODAL_CLOSE}-bottom`,
  EXPAND_MODAL_MEDIA_FIGURE: _B_EXPAND_MODAL_MEDIA_FIGURE,
  EXPAND_MODAL_MEDIA_FIGURE_VIDEO: `${_B_EXPAND_MODAL_MEDIA_FIGURE}--video`,
  EXPAND_MODAL_MEDIA_PLACEHOLDER: `${_B_EXPAND_MODAL_MEDIA}-placeholder`,
  EXPAND_MODAL_MEDIA_ITEM: _B_EXPAND_MODAL_MEDIA_ITEM,
  EXPAND_MODAL_MEDIA_ITEM_VIDEO: `${_B_EXPAND_MODAL_MEDIA_ITEM}--video`,
  EXPAND_MODAL_OPEN_1: `${_B_EXPAND_MODAL}-open-1`,
  EXPAND_MODAL_OPEN_2: `${_B_EXPAND_MODAL}-open-2`,
})
