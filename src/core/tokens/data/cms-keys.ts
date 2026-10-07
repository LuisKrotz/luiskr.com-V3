/**
 * @file tokens/data/cms-keys.js
 * @description CMS/Firebase node-key tokens — keys used to read the
 * translation and CMS data objects.
 */

import {
  _B_ABOUT,
  _B_CONTACT,
  _B_LANG_DIALOG,
  _K_ABOUT_SECTION,
  _K_EARTH_PLAYGROUND,
  _K_HOME,
  _K_LEGAL_FOOTER,
  _K_MEDIA,
  _K_PREFERENCES_MODAL,
  _K_RELATED,
  _K_SOURCE_CODE,
} from '../base.js'

/**
 * Frozen cms key map — sole declaration site for these tokens; consumers read members and
 * never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the token
 * contract immutable at runtime.
 */
export const CMS_KEYS = Object.freeze({
  ABOUT_SECTION: _K_ABOUT_SECTION,
  LEGAL_FOOTER: _K_LEGAL_FOOTER,
  RELATED_FOOTER: 'related-footer',
  AUTOPLAY: 'autoplay',
  RELATED: _K_RELATED,
  CONTACT: _B_CONTACT,
  LANG_DIALOG: _B_LANG_DIALOG,
  APP: 'APP',
  HOME: _K_HOME,
  ABOUT: _B_ABOUT,
  PORTFOLIOLIST: 'portfoliolist',
  MEDIA: _K_MEDIA,
  EARTH_PLAYGROUND: _K_EARTH_PLAYGROUND,
  SOURCE_CODE: _K_SOURCE_CODE,
  PREFERENCES_MODAL: _K_PREFERENCES_MODAL,
})
