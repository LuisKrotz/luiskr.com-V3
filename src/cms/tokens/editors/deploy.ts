/**
 * @file @cms/tokens/deploy.js
 * @description Deploy-info classes — score badges and deploy report table.
 */

import { _B_CMS_DEPLOY, _B_CMS_SCORE } from '../base.js'

/**
 * The CMS_DEPLOY_CLASSES constant.
 */
export const CMS_DEPLOY_CLASSES = Object.freeze({
  CMS_SCORE: _B_CMS_SCORE,
  CMS_SCORE_GOOD: `${_B_CMS_SCORE}--good`,
  CMS_SCORE_WARN: `${_B_CMS_SCORE}--warn`,
  CMS_SCORE_BAD: `${_B_CMS_SCORE}--bad`,
  CMS_DEPLOY_TABLE: `${_B_CMS_DEPLOY}-table`,
  CMS_DEPLOY_URL: `${_B_CMS_DEPLOY}-url`,
})
