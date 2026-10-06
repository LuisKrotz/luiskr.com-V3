/**
 * @file tokens/classes/contact.js
 * @description Contact section class tokens — token group.
 */

import { _B_CONTACT, _B_CONTACT_OTHER, _B_CONTACT_SOCIAL } from '../base.js'

/**
 * contacts classes.
 */
export const CONTACT_CLASSES = Object.freeze({
  CONTACT: _B_CONTACT,
  CONTACT_TITLE: `${_B_CONTACT}-title`,
  CONTACT_SOCIAL: _B_CONTACT_SOCIAL,
  CONTACT_SOCIAL_LINK: `${_B_CONTACT_SOCIAL}-link`,
  CONTACT_OTHER: _B_CONTACT_OTHER,
  CONTACT_OTHER_LINK: `${_B_CONTACT_OTHER}-link`,
  CONTACT_SEPARATOR: `${_B_CONTACT_SOCIAL}-separator`,
})
