/**
 * @file tokens/ids/cms.js
 * @description CMS root mount id token — token group.
 */

import { _B_CMS } from '../base.js'

/**
 * Frozen cms element-id map — sole declaration site for these tokens; consumers read members
 * and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the
 * token contract immutable at runtime.
 */
export const CMS_IDS = Object.freeze({
  CMS_ROOT: _B_CMS,
})
