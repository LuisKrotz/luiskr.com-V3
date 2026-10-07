/**
 * @file CmsDeployInfo.js
 * @description <cms-deploy-info> — the Deploy Info tab: renders the
 * quality bundle from dist/deploy-info/ (written by scripts/build/deploy-info.mjs
 * at build time) — Lighthouse scores per URL, Jest coverage totals,
 * axe-core violations, Snyk/yarn-audit vulnerabilities, and the console-*
 * governance scan, grouped as one report wall.
 *
 * Facade — report types/fetch/JSX live in ../deploy-info/.
 */

import { CMS_TAGS } from '@/cms/tokens.js'
import { h } from '@/core/jsx.js'
import { BaseComponent } from '@/core/Component.js'
import { loadReports } from './data.js'
import {
  renderDeployInfo,
  renderLighthouse,
  renderCoverage,
  renderAxe,
  renderSnyk,
  renderConsoleScan,
  renderScores,
  scoreClass,
  pct,
} from './render.js'
import type {
  AxeReport,
  ConsoleScanReport,
  CoverageReport,
  DeployFetchState,
  DeployIndex,
  LighthouseReport,
  SnykReport,
} from './types.js'
import cmsStyles from '@/cms/sass/cms.scss?inline'

/**
 * The CmsDeployInfo — deploy info class.
 */
export class CmsDeployInfo extends BaseComponent {
  _fetchState: DeployFetchState = 'loading'
  index: DeployIndex | null = null // deploy-info manifest (file names + generatedAt + commit)
  lighthouse: LighthouseReport | null = null // lighthouse report JSON
  coverage: CoverageReport | null = null // jest coverage-summary JSON
  axe: AxeReport | null = null // axe-scan report JSON
  snyk: SnykReport | null = null // snyk/yarn-audit report JSON
  consoleScan: ConsoleScanReport | null = null // console-scan report JSON

  constructor() {
    super(cmsStyles)
  }

  /**
   * Fetches the manifest then all five reports in parallel — the index
   * is the gate (missing bundle → "run yarn deploy:info" hint), each
   * report degrades independently so a partial bundle still renders.
   */
  override async onMounted() {
    await loadReports(this)
  }

  /** Maps a 0–1 score to the green/amber/red chip class (Lighthouse conventions). */

  _scoreClass(value: unknown): string {
    return scoreClass(value)
  }

  /** Formats a 0–1 score as a whole percentage; non-numbers render an em-dash. */

  _pct(value: unknown): string {
    return pct(value)
  }

  /** Renders the Lighthouse section (scores + failing audits). */

  _renderLighthouse() {
    return renderLighthouse(this)
  }

  /** Renders the Lighthouse category score cells for one URL entry. */

  _renderScores(scores: Record<string, number> | undefined) {
    return renderScores(scores)
  }

  /** Renders the Jest coverage summary table. */

  _renderCoverage() {
    return renderCoverage(this)
  }

  /** Renders the axe-core accessibility scan (violations grouped by surface). */

  _renderAxe() {
    return renderAxe(this)
  }

  /** Renders the dependency vulnerability scan (Snyk or yarn-audit fallback). */

  _renderSnyk() {
    return renderSnyk(this)
  }

  /** Renders the console.* usage scan (debug-leftover policy). */

  _renderConsoleScan() {
    return renderConsoleScan(this)
  }

  /** JSX template — loading/missing gates then the report wall. */

  override render() {
    return renderDeployInfo(this)
  }
}

if (!customElements.get(CMS_TAGS.CMS_DEPLOY_INFO)) {
  customElements.define(CMS_TAGS.CMS_DEPLOY_INFO, CmsDeployInfo)
}
