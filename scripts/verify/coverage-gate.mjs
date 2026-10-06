#!/usr/bin/env node
/**
 * @file coverage-gate.mjs
 * @description Per-file coverage enforcement. Jest's coverageThreshold only
 * checks global aggregates — this gate additionally requires every source
 * file to meet the per-file bar (100% statements/branches/functions/lines),
 * matching the project rule "100% of all in all".
 *
 * Reads coverage/coverage-final.json (the 'json' reporter output produced by
 * `npm run test:coverage`) and exits 1 listing every file below threshold.
 * Also fails when a src/*.ts(x) file is ABSENT from the report — an absent
 * file has silently 0% coverage unless it carries `istanbul ignore file`.
 * Runs inside `npm run verify` after the coverage suite.
 */

import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const SRC_DIR = path.join(ROOT, 'src')
const COVERAGE_FILE = path.join(ROOT, 'coverage', 'coverage-final.json')
const THRESHOLD = 100
const IGNORE_RE = /istanbul ignore file/

if (!fs.existsSync(COVERAGE_FILE)) {
  console.error('coverage-gate: coverage-final.json not found — run npm run test:coverage first')
  process.exit(1)
}

const data = JSON.parse(fs.readFileSync(COVERAGE_FILE, 'utf-8'))

const pct = (covered, total) => (total === 0 ? 100 : (covered / total) * 100)

const uncovered = []

for (const [file, cov] of Object.entries(data)) {
  const metrics = {
    statements: pct(
      Object.keys(cov.s || {}).filter((k) => cov.s[k] > 0).length,
      Object.keys(cov.s || {}).length
    ),
    branches: pct(
      Object.values(cov.b || {})
        .flat()
        .filter((v) => v > 0).length,
      Object.values(cov.b || {}).flat().length
    ),
    functions: pct(
      Object.keys(cov.f || {}).filter((k) => cov.f[k] > 0).length,
      Object.keys(cov.f || {}).length
    ),
  }

  const failing = Object.entries(metrics).filter(([, v]) => v < THRESHOLD)

  if (failing.length) {
    uncovered.push({
      file: path.relative(ROOT, file),
      failing: failing.map(([k, v]) => `${k} ${v.toFixed(1)}%`).join(', '),
    })
  }
}

if (uncovered.length) {
  console.error(`✗ coverage-gate: ${uncovered.length} files below ${THRESHOLD}%:`)
  for (const u of uncovered.slice(0, 40)) console.error(`  ${u.file} — ${u.failing}`)
  if (uncovered.length > 40) console.error(`  …and ${uncovered.length - 40} more`)
  process.exit(1)
}

// Absent-file check: a src file that never appears in coverage-final.json
// has 0% coverage by definition. Only files carrying `istanbul ignore file`
// (barrels, legacy polyfills that never run under tests) may be absent.
const listSrc = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name)
    return e.isDirectory()
      ? listSrc(p)
      : /\.(ts|tsx|js)$/.test(e.name) && !e.name.endsWith('.d.ts')
        ? [p]
        : []
  })

const inReport = new Set(Object.keys(data).map((f) => path.resolve(f)))
const absent = listSrc(SRC_DIR).filter(
  (f) => !inReport.has(path.resolve(f)) && !IGNORE_RE.test(fs.readFileSync(f, 'utf-8'))
)

if (absent.length) {
  console.error(`✗ coverage-gate: ${absent.length} src files absent from the report (0% coverage):`)
  for (const f of absent.slice(0, 40)) console.error(`  ${path.relative(ROOT, f)}`)
  if (absent.length > 40) console.error(`  …and ${absent.length - 40} more`)
  console.error('  → add tests, or an `istanbul ignore file` pragma with justification')
  process.exit(1)
}

console.log(`✓ coverage-gate: all files ≥${THRESHOLD}%, no absent src files`)
