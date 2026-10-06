#!/usr/bin/env node
/**
 * @file security-scan.mjs
 * @description Dependency vulnerability scan. Primary engine: Snyk
 * (`snyk test --json`, requires SNYK_TOKEN or `snyk auth`). Fallback engine:
 * `npm audit --json` (same GitHub Advisory data, no auth) so the gate still
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

const ROOT = process.cwd()
const REPORTS_DIR = path.join(ROOT, 'reports')
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
    const out = execSync('npx snyk test --json', {
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

const normalizeNpmAudit = (data) => {
  const vulnerabilities = []

  for (const [name, v] of Object.entries(data.vulnerabilities || {})) {
    const advisories = (v.via || []).filter((x) => typeof x === 'object')
    const chain = (v.effects || []).length ? `${name} → ${v.effects.join(' > ')}` : name

    if (!advisories.length) {
      vulnerabilities.push({
        packageName: name,
        severity: v.severity,
        advisoryId: null,
        title: `${name} affected via ${chain}`,
        from: chain,
        fixedIn: v.fixAvailable ? v.fixAvailable.version || 'yes' : null,
        isUpgradable: Boolean(v.fixAvailable),
        isPatchable: false,
        exploit: null,
        url: null,
      })
    } else {
      for (const a of advisories) {
        vulnerabilities.push({
          packageName: name,
          severity: v.severity,
          advisoryId: `GHSA-via-${a.source || a.url || ''}`,
          title: a.title,
          from: chain,
          range: a.range,
          fixedIn: v.fixAvailable ? v.fixAvailable.version || 'yes' : null,
          isUpgradable: Boolean(v.fixAvailable),
          isPatchable: false,
          exploit: null,
          url: a.url || null,
        })
      }
    }
  }

  return { scanner: 'npm-audit (snyk unavailable — set SNYK_TOKEN)', vulnerabilities, summary: '' }
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
      console.warn('⚠  snyk test failed — falling back to npm audit')
    }
  } else {
    console.log('ℹ  SNYK_TOKEN not set — using npm audit (same advisory data)')
  }

  if (!report) {
    let audit
    try {
      audit = JSON.parse(
        execFileSync('npm', ['audit', '--json'], {
          cwd: ROOT,
          encoding: 'utf-8',
          stdio: ['ignore', 'pipe', 'pipe'],
          maxBuffer: 32 * 1024 * 1024,
        })
      )
    } catch (err) {
      audit = JSON.parse(err.stdout?.toString?.() || '{}')
    }
    report = normalizeNpmAudit(audit)
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
