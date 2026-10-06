/**
 * @file tokens/classes/project.js
 * @description Project/internal page class tokens (`internal-*` block) —
 * token group.
 */

import {
  _B_INTERNAL,
  _B_INTERNAL_DESCRIPTION,
  _B_INTERNAL_EXTRA,
  _B_INTERNAL_FOOTER,
  _B_INTERNAL_FOOTER_ITEMS,
  _B_INTERNAL_MAIN,
} from '../base.js'

/**
 * internals classes.
 */
export const INTERNAL_CLASSES = Object.freeze({
  INTERNAL: _B_INTERNAL,
  INTERNAL_TITLE: `${_B_INTERNAL}-title`,
  INTERNAL_MAIN: _B_INTERNAL_MAIN,
  INTERNAL_MAIN_ITEM: `${_B_INTERNAL_MAIN}-item`,
  // Zoom-to-fill modifier: cover video that intentionally fills and crops the frame.
  // Apply alongside INTERNAL_MAIN_ITEM when the video should use object-fit:cover.
  ZTF_VIDEO: 'ztf-video',
  INTERNAL_DESCRIPTION: _B_INTERNAL_DESCRIPTION,
  INTERNAL_DESCRIPTION_TEXT: `${_B_INTERNAL_DESCRIPTION}-text`,
  INTERNAL_EXTRA: _B_INTERNAL_EXTRA,
  INTERNAL_EXTRA_SCROLL: `${_B_INTERNAL_EXTRA}-scroll`,
  INTERNAL_EXTRA_ITEM: `${_B_INTERNAL_EXTRA}-item`,
  INTERNAL_FOOTER: _B_INTERNAL_FOOTER,
  INTERNAL_FOOTER_TITLE: `${_B_INTERNAL_FOOTER}-title`,
  INTERNAL_FOOTER_RELATED: `${_B_INTERNAL_FOOTER}-related`,
  INTERNAL_FOOTER_ITEMS: _B_INTERNAL_FOOTER_ITEMS,
  INTERNAL_FOOTER_ITEMS_LINK: `${_B_INTERNAL_FOOTER_ITEMS}-link`,
  INTERNAL_FOOTER_ITEMS_SEP: `${_B_INTERNAL_FOOTER_ITEMS}-separator`,
  INTERNAL_FOOTER_ITEMS_NOTE: `${_B_INTERNAL_FOOTER_ITEMS}-note`,
  INTERNAL_FOOTER_ITEMS_NOTE_TEXT: `${_B_INTERNAL_FOOTER_ITEMS}-note-text`,
  INTERNAL_FOOTER_ITEMS_NOTE_MORE: `${_B_INTERNAL_FOOTER_ITEMS}-note-more`,
  INTERNAL_FOOTER_ITEMS_NOTE_DOT: `${_B_INTERNAL_FOOTER_ITEMS}-note-dot`,
  INTERNAL_EXPAND: `${_B_INTERNAL}-expand`,
})

/**
 * The PROJECT_CLASSES constant.
 */
export const PROJECT_CLASSES = Object.freeze({
  PROJECT: 'project',
})
