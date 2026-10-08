/**
 * @file scripts/build/deploy-info.mjs
 * @description Assembles `dist/deploy-info/` — the "last deploy" bundle the CMS
 * exposes in its restricted Deploy Info tab.
 *
 * Sources:
 *   - .lighthouseci/manifest.json   latest Lighthouse CI run (representative runs only)
 *   - <module>/reports/coverage/coverage-summary.json  per-module Jest summaries
 *   - experiments/docs/reports/axe-report.json      axe-core WCAG accessibility scan
 *   - experiments/docs/reports/snyk-report.json     Snyk / yarn-audit dependency scan
 *   - experiments/docs/reports/console-scan.json    console.* usage policy scan
 *
 * Outputs:
 *   - dist/deploy-info/index.json               manifest {generatedAt, commit, files}
 *   - dist/deploy-info/lighthouse-summary.json  per-URL scores + failing audits
 *   - dist/deploy-info/coverage-summary.json    Jest coverage totals + per-module
 *   - dist/deploy-info/axe-report.json          a11y violations per surface
 *   - dist/deploy-info/snyk-report.json         dependency vulnerabilities
 *   - dist/deploy-info/console-scan.json        console.* usage findings
 *
 * Side effect: prunes .lighthouseci/ so ONLY the last run's representative
 * artifacts remain on disk (all other lhr-* reports are discarded).
 */

import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'

const ROOT = process.cwd()
const LHCI_DIR = path.join(ROOT, '.lighthouseci')
// Verify-pipeline scan reports live inside the docs module (served at
// /docs/reports/); dist/deploy-info bundles them from there.
const REPORTS_DIR = path.join(ROOT, 'experiments', 'docs', 'reports')
const OUT_DIR = path.join(ROOT, 'dist', 'deploy-info')

/**
 * Module workspaces that publish a coverage report — mirrors the
 * run-modules.mjs runner order.
 */
const COVERAGE_MODULES = [
  'shared',
  'core',
  'website',
  'cms',
  'experiments/earth-playground',
  'experiments/docs',
]

const readJson = (file) => {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'))
  } catch {
    return null
  }
}

const gitCommit = () => {
  try {
    return execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim()
  } catch {
    return null
  }
}

// ─── Lighthouse ──────────────────────────────────────────────────────────────
const collectLighthouse = () => {
  const manifest = readJson(path.join(LHCI_DIR, 'manifest.json'))
  if (!Array.isArray(manifest) || !manifest.length) return null

  const keep = new Set()

  const urls = manifest
    .filter((run) => run.isRepresentativeRun)
    .map((run) => {
      const lhr = run.jsonPath ? readJson(path.resolve(LHCI_DIR, run.jsonPath)) : null

      ;[run.jsonPath, run.htmlPath].forEach((p) => {
        if (p) keep.add(path.resolve(LHCI_DIR, p))
      })

      const failedAudits = lhr
        ? Object.values(lhr.audits || {})
            .filter((a) => a.score !== null && a.score !== undefined && a.score < 1)
            .map((a) => ({ id: a.id, title: a.title, score: a.score }))
        : []

      return {
        url: run.url,
        scores: run.summary || null,
        failedAudits,
      }
    })

  // Keep only the last run's representative artifacts — discard everything else.
  for (const entry of fs.readdirSync(LHCI_DIR)) {
    const full = path.join(LHCI_DIR, entry)

    if (entry === 'manifest.json' || keep.has(full)) continue

    try {
      fs.rmSync(full, { force: true, recursive: true })
    } catch {
      // Best-effort prune.
    }
  }

  return { urls }
}

// ─── Coverage ────────────────────────────────────────────────────────────────
// Each module writes reports/coverage/coverage-summary.json; the bundle
// carries a merged `total` (the CMS renders it directly) plus the
// per-module summaries under `modules`.
const collectCoverage = () => {
  const modules = {}
  const totals = {}

  for (const mod of COVERAGE_MODULES) {
    const summary = readJson(path.join(ROOT, mod, 'reports', 'coverage', 'coverage-summary.json'))
    if (!summary?.total) continue

    modules[mod] = summary.total

    for (const [metric, m] of Object.entries(summary.total)) {
      const acc = (totals[metric] ||= { covered: 0, total: 0, skipped: 0, pct: 0 })
      acc.covered += m.covered || 0
      acc.total += m.total || 0
      acc.skipped += m.skipped || 0
    }
  }

  if (!Object.keys(modules).length) return null

  for (const m of Object.values(totals)) {
    m.pct = m.total ? Math.round((m.covered / m.total) * 10000) / 100 : 100
  }

  return { total: totals, modules }
}

// ─── Assemble ────────────────────────────────────────────────────────────────
const main = () => {
  const lighthouse = collectLighthouse()

  const coverage = collectCoverage()

  fs.mkdirSync(OUT_DIR, { recursive: true })

  const files = {}

  if (lighthouse) {
    fs.writeFileSync(
      path.join(OUT_DIR, 'lighthouse-summary.json'),
      JSON.stringify(lighthouse, null, 2)
    )
    files.lighthouse = 'lighthouse-summary.json'
  }

  if (coverage) {
    fs.writeFileSync(path.join(OUT_DIR, 'coverage-summary.json'), JSON.stringify(coverage, null, 2))
    files.coverage = 'coverage-summary.json'
  }

  // Scan reports produced by the verify pipeline (axe jest suite, security-scan,
  // console-scan) — copied verbatim so the CMS shows exactly what gated the build.
  for (const [key, file] of [
    ['axe', 'axe-report.json'],
    ['snyk', 'snyk-report.json'],
    ['consoleScan', 'console-scan.json'],
  ]) {
    const report = readJson(path.join(REPORTS_DIR, file))
    if (report) {
      fs.writeFileSync(path.join(OUT_DIR, file), JSON.stringify(report, null, 2))
      files[key] = file
    }
  }

  const index = {
    generatedAt: new Date().toISOString(),
    commit: gitCommit(),
    files,
  }

  fs.writeFileSync(path.join(OUT_DIR, 'index.json'), JSON.stringify(index, null, 2))

  console.log(
    `[deploy-info] wrote ${OUT_DIR} (${Object.keys(files).join(', ') || 'no sources found'})`
  )
}

main()
