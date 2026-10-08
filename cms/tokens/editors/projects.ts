/**
 * @file @cms/tokens/projects.js
 * @description Projects-editor classes + control IDs — section cards,
 * media items, cover layout, and the editor root. Both the render and
 * events modules reference these so the selector contract is single-source.
 */

import { _B_CMS, _B_CMS_CARD, _B_CMS_FIELD, _B_CMS_MEDIA, _B_CMS_SECTION } from '../base.js'

/**
 * Frozen cms projects class-name map — sole declaration site for these tokens; consumers
 * read members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze
 * makes the token contract immutable at runtime.
 */
export const CMS_PROJECTS_CLASSES = Object.freeze({
  CMS_SECTION_CARD: `${_B_CMS_SECTION}-card`,
  CMS_MEDIA_ITEM: `${_B_CMS_MEDIA}-item`,
  CMS_MEDIA_THUMB: `${_B_CMS_MEDIA}-thumb`,
  CMS_MEDIA_FIELDS: `${_B_CMS_MEDIA}-fields`,
  CMS_COVER_LAYOUT: `${_B_CMS}-cover-layout`,
  CMS_COVER_THUMB: `${_B_CMS}-cover-thumb`,
  CMS_COVER_FIELDS: `${_B_CMS}-cover-fields`,
  CMS_FIELD_GROUP_SMALL: `${_B_CMS_FIELD}-group--small`,
  CMS_CARD_HEADER: `${_B_CMS_CARD}--header`,
  CMS_CHECKBOX_LABEL: `${_B_CMS}-checkbox-label`,
  CMS_PROJECTS_MANAGER: `${_B_CMS}-projects-manager`,
  CMS_SECTIONS_LIST: `${_B_CMS}-sections-list`,
  SEC_UP: 'sec-up-btn',
  SEC_DOWN: 'sec-down-btn',
  SEC_DEL: 'sec-del-btn',
  SEC_ADD_TEXT: 'sec-add-text',
  SEC_ADD_MEDIA: 'sec-add-media',
  SEC_TEXT_INPUT: 'sec-text-input',
  SEC_TEXT_DEL: 'sec-text-del',
  MEDIA_SRC: 'media-src',
  MEDIA_LABEL: 'media-label',
  MEDIA_TYPE: 'media-type',
  MEDIA_W: 'media-w',
  MEDIA_H: 'media-h',
  MEDIA_DEL: 'media-del',
})

/**
 * Frozen cms projects element-id map — sole declaration site for these tokens; consumers
 * read members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze
 * makes the token contract immutable at runtime.
 */
export const CMS_PROJECTS_IDS = Object.freeze({
  BTN_CREATE: 'btn-create-proj',
  BTN_DELETE: 'btn-delete-proj',
  BTN_SAVE: 'btn-save-proj',
  BTN_ADD_SECTION: 'btn-add-section',
  SELECT_LANG: 'select-proj-lang',
  SELECT_KEY: 'select-proj-key',
  PROJ_TITLE: 'proj-title-input',
  PROJ_FOLDER: 'proj-folder-input',
  PROJ_NOINDEX: 'proj-noindex',
  COVER_SRC: 'cover-src-input',
  COVER_LABEL: 'cover-label-input',
  COVER_ISVIDEO: 'cover-isvideo',
  COVER_W: 'cover-w-input',
  COVER_H: 'cover-h-input',
})
