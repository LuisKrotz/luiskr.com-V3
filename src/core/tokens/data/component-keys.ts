/**
 * @file tokens/data/component-keys.js
 * @description Dotted paths into translations/<locale>/components — grouped
 * subsets by component.
 */

import {
  _B_CONTACT,
  _B_LANG_DIALOG,
  _K_CLOSE,
  _K_LEGAL_FOOTER,
  _K_MEDIA,
  _K_RELATED,
  _K_SOURCE_CODE,
} from '../base.js'

/**
 * The LANG_COMPONENT_KEYS constant.
 */
export const LANG_COMPONENT_KEYS = Object.freeze({
  LANG_TITLE: `${_B_LANG_DIALOG}.title`,
  LANG_CLOSE: `${_B_LANG_DIALOG}.${_K_CLOSE}`,
})

/**
 * The MEDIA_COMPONENT_KEYS constant.
 */
export const MEDIA_COMPONENT_KEYS = Object.freeze({
  MEDIA_CLOSE: `${_K_MEDIA}.${_K_CLOSE}`,
  MEDIA_TO_OPEN: `${_K_MEDIA}.toOpen`,
})

/**
 * The LEGAL_COMPONENT_KEYS constant.
 */
export const LEGAL_COMPONENT_KEYS = Object.freeze({
  LEGAL_LINKS: `${_K_LEGAL_FOOTER}.links`,
})

/**
 * The SOURCE_COMPONENT_KEYS constant.
 */
export const SOURCE_COMPONENT_KEYS = Object.freeze({
  SOURCE_LABEL: `${_K_SOURCE_CODE}.label`,
  SOURCE_LINK: `${_K_SOURCE_CODE}.link`,
})

/**
 * The SECTION_COMPONENT_KEYS constant.
 */
export const SECTION_COMPONENT_KEYS = Object.freeze({
  RELATED_TITLE: `${_K_RELATED}.title`,
  CONTACT_TITLE: `${_B_CONTACT}.title`,
})
