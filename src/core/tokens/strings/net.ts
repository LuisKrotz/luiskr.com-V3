/**
 * @file tokens/strings/net.js
 * @description Network/URL string tokens — token group.
 */

import { _K_SITE_URL } from '../base.js'

/**
 * Frozen net string map — sole declaration site for these tokens; consumers read members and
 * never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the token
 * contract immutable at runtime.
 */
export const NET_STRINGS = Object.freeze({
  SITE_URL: _K_SITE_URL,
  GRAVATAR_BASE: 'https://www.gravatar.com/avatar/',
  GRAVATAR_HOSTNAME: 'gravatar.com',
  GRAVATAR_HOSTNAME_SUFFIX: '.gravatar.com',
  HTTP_LOCALHOST: 'http://localhost',
  BLOB_COLON: 'blob:',
  IMAGE_PNG: 'image/png',
})
