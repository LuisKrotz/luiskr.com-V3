/**
 * @file tokens/selectors/common.js
 * @description Generic/shared selector tokens — grouped subset of
 * SELECTORS.
 */

import { _B_ABOUT, _B_CONTACT, _B_PREF_THEME } from '../base.js'
import { HTML_TAGS } from '../elements/html.js'

/**
 * The COMMON_SELECTORS constant.
 */
export const COMMON_SELECTORS = Object.freeze({
  HOST: ':host',
  STYLE: HTML_TAGS.STYLE,
  DATA_CONTENT: '[data-content]',
  PREF_THEME_CANVAS: `.${_B_PREF_THEME}-canvas`,
  BUTTON_OR_ANCHOR: 'button, a',
  MEDIA_ELEMENTS: 'img, video, audio',
  ID_ABOUT: `#${_B_ABOUT}`,
  ID_CONTACT: `#${_B_CONTACT}`,
})
