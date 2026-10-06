/**
 * @file tokens/routes/translation-keys.js
 * @description Route meta translation keys — values used in
 * route.meta.translation to identify the Firebase translation doc.
 */

import { _B_ABOUT, _B_NOT_FOUND, _K_HOME, _K_PRIVACY_POLICY, _K_TERMS_OF_USE } from '../base.js'

/**
 * The TRANSLATION_KEYS constant.
 */
export const TRANSLATION_KEYS = Object.freeze({
  HOME: _K_HOME,
  PRIVACY_POLICY: _K_PRIVACY_POLICY,
  GDPR: 'GDPR',
  TERMS_OF_USE: _K_TERMS_OF_USE,
  NOT_FOUND: _B_NOT_FOUND,
  ABOUT: _B_ABOUT,
  EARTH_PLAYGROUND: 'earth-playground',
})
