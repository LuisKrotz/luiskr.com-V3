/**
 * @file @cms/tokens/form.js
 * @description Form-field classes — field groups/rows, subsections, labels,
 * inputs, textareas, selects, hints.
 */

import { _B_CMS, _B_CMS_FIELD, _B_CMS_SUBSECTION } from '../base.js'

/**
 * The CMS_FORM_CLASSES constant.
 */
export const CMS_FORM_CLASSES = Object.freeze({
  CMS_FIELD_GROUP: `${_B_CMS_FIELD}-group`,
  CMS_FIELD_ROW: `${_B_CMS_FIELD}-row`,
  CMS_SUBSECTION: _B_CMS_SUBSECTION,
  CMS_SUBSECTION_HEADER: `${_B_CMS_SUBSECTION}-header`,
  CMS_SUBSECTION_TITLE: `${_B_CMS_SUBSECTION}-title`,
  CMS_LABEL: `${_B_CMS}-label`,
  CMS_INPUT: `${_B_CMS}-input`,
  CMS_TEXTAREA: `${_B_CMS}-textarea`,
  CMS_SELECT: `${_B_CMS}-select`,
  CMS_HINT: `${_B_CMS}-hint`,
})
