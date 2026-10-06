/**
 * @file @cms/tokens/items.js
 * @description List-item classes — item controls, paragraph items, media
 * thumbnails, key-value editor rows.
 */

import { _B_CMS, _B_CMS_ITEM, _B_CMS_KV, _B_CMS_MEDIA, _B_CMS_PARA } from '../base.js'

/**
 * The CMS_ITEM_CLASSES constant.
 */
export const CMS_ITEM_CLASSES = Object.freeze({
  CMS_ITEM_CONTROLS: `${_B_CMS_ITEM}-controls`,
  CMS_PARA_ITEM: `${_B_CMS_PARA}-item`,
  CMS_MEDIA_THUMB_PLACEHOLDER: `${_B_CMS_MEDIA}-thumb-placeholder`,
  CMS_DROPZONE: `${_B_CMS}-dropzone`,
  CMS_PROGRESS_FILL: `${_B_CMS}-progress-fill`,
  CMS_KV_LIST: `${_B_CMS_KV}-list`,
  CMS_KV_KEY: `${_B_CMS_KV}-key`,
  CMS_KV_ITEM: `${_B_CMS_KV}-item`,
})
