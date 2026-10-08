#!/usr/bin/env node
/**
 * @file security-scan.mjs
 * @description Dependency vulnerability scan. Primary engine: Snyk
 * (`snyk test --json`, requires SNYK_TOKEN or `snyk auth`). Fallback engine:
 * `yarn audit --json` (same GitHub Advisory data, no auth; yarn.lock is the
 * project's authoritative lockfile) so the gate still
 * runs — and the CMS report is still produced — on machines without a token.
 *
 * Output: reports/snyk-report.json → bundled into dist/deploy-info/ by
 * scripts/build/deploy-info.mjs and rendered in the CMS "Deploy Info" tab.
 *
 * Gate: exits 1 when un-exceptioned vulnerabilities at `high`/`critical`
 * severity are found. Accepted risks live in security-exceptions.json with
 * justification + review date (the Snyk `.snyk ignore` equivalent).
 */

import { execFileSync, execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..')
// Scan outputs live inside the docs module — the portal serves them under
// /docs/reports/ and deploy-info bundles them from there (root stays clean).
const REPORTS_DIR = path.join(ROOT, 'experiments', 'docs', 'reports')
const REPORT_FILE = path.join(REPORTS_DIR, 'snyk-report.json')
const EXCEPTIONS_FILE = path.join(ROOT, 'security-exceptions.json')
const FAIL_SEVERITIES = new Set(['high', 'critical'])

const loadExceptions = () => {
  if (!fs.existsSync(EXCEPTIONS_FILE)) return []
  return JSON.parse(fs.readFileSync(EXCEPTIONS_FILE, 'utf-8')).exceptions || []
}

const isExcepted = (vuln, exceptions) =>
  exceptions.some(
    (e) =>
      (e.package === '*' || e.package === vuln.packageName) &&
      (e.advisory === '*' || !vuln.advisoryId || e.advisory === vuln.advisoryId)
  )

/** Runs the real Snyk CLI; returns parsed JSON or null on any failure. */
const runSnyk = () => {
  try {
    const out = execSync('yarn snyk test --json', {
      cwd: ROOT,
      stdio: ['ignore', 'pipe', 'pipe'],
      timeout: 300000,
      maxBuffer: 32 * 1024 * 1024,
    })
    return JSON.parse(out)
  } catch (err) {
    // snyk test exits non-zero when vulns exist — stdout still carries the report
    const out = err.stdout?.toString?.() || ''
    try {
      return JSON.parse(out)
    } catch {
      return null
    }
  }
}

const normalizeSnyk = (data) => ({
  scanner: `snyk@${process.env.SNYK_VERSION || 'cli'}`,
  vulnerabilities: (data.vulnerabilities || []).map((v) => ({
    packageName: v.packageName,
    severity: v.severity,
    advisoryId: v.id,
    title: v.title,
    from: (v.from || []).join(' > '),
    fixedIn: v.fixedIn || null,
    isUpgradable: Boolean(v.isUpgradable),
    isPatchable: Boolean(v.isPatchable),
    exploit: v.exploit || null,
    url: `https://security.snyk.io/vuln/${v.id}`,
  })),
  summary: data.displayTargetFile || '',
})

/**
 * `yarn audit --json` emits NDJSON — one JSON object per line: `auditAdvisory`
 * records (resolution path + advisory payload) and a closing `auditSummary`.
 * Parse line-by-line and map each advisory to the report's vuln shape.
 */
const normalizeYarnAudit = (ndjson) => {
  const vulnerabilities = []

  for (const line of ndjson.split('\n')) {
    if (!line.trim()) continue

    let rec
    try {
      rec = JSON.parse(line)
    } catch {
      continue
    }

    if (rec.type !== 'auditAdvisory') continue

    const a = rec.data?.advisory || {}
    const res = rec.data?.resolution || {}
    // yarn reports unfixable advisories as patched_versions '<0.0.0'
    const fixable = Boolean(
      a.patched_versions && a.patched_versions !== '<none>' && a.patched_versions !== '<0.0.0'
    )

    vulnerabilities.push({
      packageName: a.module_name,
      severity: a.severity,
      advisoryId: a.github_advisory_id || (a.url || '').split('/').pop() || null,
      title: a.title,
      from: res.path || (a.findings?.[0]?.paths || []).join(' > '),
      range: a.vulnerable_versions,
      fixedIn: fixable ? a.patched_versions : null,
      isUpgradable: fixable,
      isPatchable: false,
      exploit: null,
      url: a.url || null,
    })
  }

  // yarn emits one auditAdvisory record per resolution path — the same
  // advisory can repeat for every dependent chain. Dedupe by advisory +
  // package, keeping the first (shortest) resolution path as `from`.
  const seen = new Set()

  return {
    scanner: 'yarn-audit (snyk unavailable — set SNYK_TOKEN)',
    vulnerabilities: vulnerabilities.filter((v) => {
      const key = `${v.advisoryId}|${v.packageName}`

      if (seen.has(key)) return false

      seen.add(key)

      return true
    }),
    summary: '',
  }
}

const tally = (vulns) => {
  const t = { critical: 0, high: 0, moderate: 0, low: 0, info: 0, total: vulns.length }
  for (const v of vulns) if (t[v.severity] !== undefined) t[v.severity] += 1
  return t
}

const main = async () => {
  const exceptions = loadExceptions()
  let report

  if (process.env.SNYK_TOKEN) {
    const snyk = runSnyk()
    report = snyk ? normalizeSnyk(snyk) : null
    if (!report) {
      console.warn('⚠  snyk test failed — falling back to yarn audit')
    }
  } else {
    console.log('ℹ  SNYK_TOKEN not set — using yarn audit (same advisory data)')
  }

  if (!report) {
    let ndjson
    try {
      // yarn audit exits non-zero when vulns exist — stdout still carries NDJSON
      ndjson = execFileSync('yarn', ['audit', '--json'], {
        cwd: ROOT,
        encoding: 'utf-8',
        stdio: ['ignore', 'pipe', 'pipe'],
        maxBuffer: 32 * 1024 * 1024,
      })
    } catch (err) {
      ndjson = err.stdout?.toString?.() || ''
    }
    report = normalizeYarnAudit(ndjson)
  }

  const withStatus = report.vulnerabilities.map((v) => ({
    ...v,
    acceptedRisk: isExcepted(v, exceptions),
  }))

  const actionable = withStatus.filter((v) => FAIL_SEVERITIES.has(v.severity) && !v.acceptedRisk)

  const reportDoc = {
    generatedAt: new Date().toISOString(),
    scanner: report.scanner,
    ok: actionable.length === 0,
    totals: tally(withStatus),
    failSeverities: [...FAIL_SEVERITIES],
    exceptions,
    vulnerabilities: withStatus,
  }

  fs.mkdirSync(REPORTS_DIR, { recursive: true })
  fs.writeFileSync(REPORT_FILE, JSON.stringify(reportDoc, null, 2))

  const t = reportDoc.totals
  console.log(
    `🔒 ${reportDoc.scanner}: ${t.total} vulns (critical ${t.critical}, high ${t.high}, moderate ${t.moderate}, low ${t.low}) — ${withStatus.filter((v) => v.acceptedRisk).length} accepted-risk`
  )

  if (actionable.length) {
    console.error(`\n✗ ${actionable.length} actionable high/critical vulnerabilities:`)
    for (const v of actionable) {
      console.error(`  [${v.severity}] ${v.packageName} — ${v.title} (fix: ${v.fixedIn || 'none'})`)
    }
    console.error(`\nReport: ${path.relative(ROOT, REPORT_FILE)}`)
    process.exit(1)
  }

  console.log(`✓ No actionable vulnerabilities → ${path.relative(ROOT, REPORT_FILE)}`)
}

main().catch((err) => {
  console.error('security-scan failed:', err)
  process.exit(1)
})
