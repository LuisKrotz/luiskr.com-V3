/**
 * @file @cms/tokens/media.js
 * @description Media-converter classes + control IDs — dropzone state,
 * queue/result lists, progress fill, loader row. Both the render and
 * events modules reference these so the selector contract is single-source.
 */

import { _B_CMS, _B_CMS_DROPZONE_BASE, _B_CMS_MEDIA } from '../base.js'

/**
 * The CMS_MEDIA_CLASSES constant.
 */
export const CMS_MEDIA_CLASSES = Object.freeze({
  CMS_DROPZONE_OVER: `${_B_CMS_DROPZONE_BASE}--over`,
  CMS_DROPZONE_ICON: `${_B_CMS_DROPZONE_BASE}-icon`,
  CMS_MEDIA_LIST: `${_B_CMS_MEDIA}-list`,
  CMS_MEDIA_LIST_ERRORS: `${_B_CMS_MEDIA}-list ${_B_CMS_MEDIA}-list--errors`,
  CMS_MEDIA_LIST_ROW: `${_B_CMS_MEDIA}-list-row`,
  CMS_MEDIA_LIST_NAME: `${_B_CMS_MEDIA}-list-name`,
  CMS_MEDIA_LIST_SIZE: `${_B_CMS_MEDIA}-list-size`,
  CMS_MEDIA_LIST_GROUP: `${_B_CMS_MEDIA}-list-group`,
  CMS_MEDIA_LIST_OUT: `${_B_CMS_MEDIA}-list-out`,
  CMS_MEDIA_LIST_ERROR: `${_B_CMS_MEDIA}-list-error`,
  CMS_LIST_HEAD: `${_B_CMS}-list-head`,
  CMS_BTN_ROW: `${_B_CMS}-btn-row`,
  CMS_LOADER_ROW: `${_B_CMS}-loader-row`,
  CMS_SPINNER: `${_B_CMS}-spinner`,
  CMS_PROGRESS: `${_B_CMS}-progress`,
  CMS_ERROR_TEXT: `${_B_CMS}-error-text`,
})

/**
 * The CMS_MEDIA_IDS constant.
 */
export const CMS_MEDIA_IDS = Object.freeze({
  FILE_INPUT: 'cms-media-file-input',
  RUN: 'cms-media-run',
  RESET: 'cms-media-reset',
  CLEAR_LIST: 'cms-media-clear-list',
  DOWNLOAD: 'cms-media-download',
})
