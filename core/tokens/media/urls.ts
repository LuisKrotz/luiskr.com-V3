/**
 * @file tokens/media/urls.js
 * @description External base URLs split by function — grouped subsets of
 * URLS. All external URLs declared once — never inline in components.
 */

import { _K_SITE_URL } from '../base.js'

/**
 * Frozen cdn URL map — sole declaration site for these tokens; consumers read members and
 * never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the token
 * contract immutable at runtime.
 */
export const CDN_URLS = Object.freeze({
  CDN_BASE: 'https://storage.googleapis.com/luiskr.com/public/_v3/',
  FLAG_CDN: 'https://flagcdn.com/',
  FIREBASE_DB: 'https://luiskr-com.firebaseio.com',
})

/**
 * Frozen social URL map — sole declaration site for these tokens; consumers read members and
 * never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the token
 * contract immutable at runtime.
 */
export const SOCIAL_URLS = Object.freeze({
  SITE: _K_SITE_URL,
  GITHUB: 'https://github.com/LuisKrotz',
  GITHUB_REPO: 'https://github.com/LuisKrotz/luiskr.com-V3',
  LINKEDIN: 'https://www.linkedin.com/in/luis-kr%C3%B6tz/?locale=en_US',
})
