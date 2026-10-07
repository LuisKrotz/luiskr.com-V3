/**
 * @file cms/deploy-info/data.ts — fetch orchestration for the Deploy
 * Info tab: the manifest gates the bundle (missing → "run deploy:info"
 * hint), each report then degrades independently.
 */

import type {
  AxeReport,
  ConsoleScanReport,
  CoverageReport,
  DeployIndex,
  LighthouseReport,
  SnykReport,
} from './types.js'
import type { CmsDeployInfo } from './CmsDeployInfo.js'

// The bundle lives next to index.html after deploy-info.mjs copies it.
/**
 * The DEPLOY_INFO_BASE constant.
 */
export const DEPLOY_INFO_BASE = '/deploy-info'

/** Fetches a report JSON; any missing/corrupt file degrades to null (section shows its "no data" hint). */
export async function fetchJson(url: string): Promise<unknown> {
  const res = await fetch(url, { cache: 'no-store' })

  if (!res.ok) return null

  return res.json().catch(() => null)
}

/**
 * Fetches the manifest then all five reports in parallel — the index
 * is the gate (missing bundle → "run yarn deploy:info" hint), each
 * report degrades independently so a partial bundle still renders.
 */
export async function loadReports(host: CmsDeployInfo): Promise<void> {
  const index = (await fetchJson(`${DEPLOY_INFO_BASE}/index.json`)) as DeployIndex | null

  if (!index) {
    host._fetchState = 'missing'

    host._updateDom()

    return
  }

  host.index = index

  const [lighthouse, coverage, axe, snyk, consoleScan] = await Promise.all([
    index.files?.lighthouse ? fetchJson(`${DEPLOY_INFO_BASE}/${index.files.lighthouse}`) : null,
    index.files?.coverage ? fetchJson(`${DEPLOY_INFO_BASE}/${index.files.coverage}`) : null,
    index.files?.axe ? fetchJson(`${DEPLOY_INFO_BASE}/${index.files.axe}`) : null,
    index.files?.snyk ? fetchJson(`${DEPLOY_INFO_BASE}/${index.files.snyk}`) : null,
    index.files?.consoleScan ? fetchJson(`${DEPLOY_INFO_BASE}/${index.files.consoleScan}`) : null,
  ])

  host.lighthouse = lighthouse as LighthouseReport | null
  host.coverage = coverage as CoverageReport | null
  host.axe = axe as AxeReport | null
  host.snyk = snyk as SnykReport | null
  host.consoleScan = consoleScan as ConsoleScanReport | null
  host._fetchState = 'ready'

  host._updateDom()
}
