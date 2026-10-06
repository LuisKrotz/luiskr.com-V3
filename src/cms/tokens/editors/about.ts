/**
 * @file @cms/tokens/about.js
 * @description About-editor classes + control IDs — paragraph lists,
 * mention items, Gravatar layout. Shared by the render and events
 * modules so the selector contract is single-source.
 */

import { _B_CMS, _B_CMS_CARD, _B_CMS_ITEM, _B_CMS_PARA } from '../base.js'

/**
 * The CMS_ABOUT_CLASSES constant.
 */
export const CMS_ABOUT_CLASSES = Object.freeze({
  CMS_ABOUT_MANAGER: `${_B_CMS}-about-manager`,
  CMS_CARD_LANG: `${_B_CMS_CARD}--lang`,
  CMS_PARA_LIST: `${_B_CMS_PARA}-list`,
  CMS_PARA_CONTROLS: `${_B_CMS_PARA}-controls`,
  CMS_MENTION_LIST: `${_B_CMS}-mention-list`,
  CMS_MENTION_ITEM: `${_B_CMS}-mention-item`,
  CMS_ITEM_HEADER: `${_B_CMS_ITEM}-header`,
  CMS_ITEM_LABEL: `${_B_CMS_ITEM}-label`,
  CMS_GRAVATAR_LAYOUT: `${_B_CMS}-gravatar-layout`,
  CMS_GRAVATAR_PREVIEW: `${_B_CMS}-gravatar-preview`,
  CMS_PRESET_ROW: `${_B_CMS}-preset-row`,
  SIZE_PRESET_BTN: 'size-preset-btn',
  COL_ADD_BTN: 'col-add-btn',
  PARA_INPUT: 'para-input',
  PARA_REMOVE_BTN: 'para-remove-btn',
  PARA_UP_BTN: 'para-up-btn',
  PARA_DOWN_BTN: 'para-down-btn',
  MENTION_FIELD: 'mention-field',
  MENTION_REMOVE_BTN: 'mention-remove-btn',
  MENTION_UP_BTN: 'mention-up-btn',
  MENTION_DOWN_BTN: 'mention-down-btn',
})

/**
 * The CMS_ABOUT_IDS constant.
 */
export const CMS_ABOUT_IDS = Object.freeze({
  SAVE: 'btn-save-about',
  SYNC_PICTURE: 'btn-sync-picture',
  SYNC_ALL: 'btn-sync-all',
  GEN_GRAVATAR: 'btn-gen-gravatar',
  SELECT_LANG: 'select-about-lang',
  TITLE_INPUT: 'about-title-input',
  MENTIONS_TITLE: 'about-mentions-title',
  EMAIL_INPUT: 'email-gravatar-input',
  SIZE_INPUT: 'about-size-input',
  PIC_INPUT: 'about-pic-input',
  GRAVATAR_PREVIEW: 'gravatar-preview',
  ADD_MENTION: 'btn-add-mention',
})
