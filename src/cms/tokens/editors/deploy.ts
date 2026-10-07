/**
 * @file @cms/tokens/deploy.js
 * @description Deploy-info classes — score badges and deploy report table.
 */

import { _B_CMS_DEPLOY, _B_CMS_SCORE } from '../base.js'

/**
 * Frozen cms deploy class-name map — sole declaration site for these tokens; consumers read
 * members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
 * the token contract immutable at runtime.
 */
export const CMS_DEPLOY_CLASSES = Object.freeze({
  CMS_SCORE: _B_CMS_SCORE,
  CMS_SCORE_GOOD: `${_B_CMS_SCORE}--good`,
  CMS_SCORE_WARN: `${_B_CMS_SCORE}--warn`,
  CMS_SCORE_BAD: `${_B_CMS_SCORE}--bad`,
  CMS_DEPLOY_TABLE: `${_B_CMS_DEPLOY}-table`,
  CMS_DEPLOY_URL: `${_B_CMS_DEPLOY}-url`,
})
