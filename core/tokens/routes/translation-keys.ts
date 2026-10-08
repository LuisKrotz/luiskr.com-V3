/**
 * @file tokens/routes/translation-keys.js
 * @description Route meta translation keys — values used in
 * route.meta.translation to identify the Firebase translation doc.
 */

import {
  _B_ABOUT,
  _B_DOCS,
  _B_NOT_FOUND,
  _K_HOME,
  _K_PRIVACY_POLICY,
  _K_TERMS_OF_USE,
} from '../base.js'

/**
 * Frozen translation key map — sole declaration site for these tokens; consumers read
 * members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
 * the token contract immutable at runtime.
 */
export const TRANSLATION_KEYS = Object.freeze({
  HOME: _K_HOME,
  PRIVACY_POLICY: _K_PRIVACY_POLICY,
  GDPR: 'GDPR',
  TERMS_OF_USE: _K_TERMS_OF_USE,
  NOT_FOUND: _B_NOT_FOUND,
  ABOUT: _B_ABOUT,
  EARTH_PLAYGROUND: 'earth-playground',
  DOCS: _B_DOCS,
})
