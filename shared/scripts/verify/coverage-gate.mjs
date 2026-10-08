#!/usr/bin/env node
/**
 * @file coverage-gate.mjs
 * @description Per-file coverage enforcement, per module. Jest's
 * coverageThreshold only checks global aggregates — this gate additionally
 * requires every source file to meet the per-file bar (100%
 * statements/branches/functions/lines), matching the project rule
 * "100% of all in all".
 *
 * Each module's jest run writes <module>/reports/coverage/coverage-final.json
 * (the 'json' reporter output). This gate iterates every module, checks its
 * report against its own sources, and exits 1 listing every file below
 * threshold. It also fails when a module source file is ABSENT from that
 * module's report — an absent file has silently 0% coverage unless it
 * carries `istanbul ignore file`. Runs inside `yarn verify` after the
 * coverage suites.
 *
 * Usage: node shared/scripts/verify/coverage-gate.mjs [module…]
 */
import fs from 'node:fs'
import path from 'node:path'

import { discoverModules, REPO_ROOT } from '../modules.mjs'

const ROOT = REPO_ROOT

/**
 * Module → { root, src }: the module directory (where reports/coverage
 * lands) and its authored-source roots (relative to repo root). Mirrors
 * the jest.config.mjs collectCoverageFrom scopes: shared covers only
 * shared/src, the rest cover their whole tree minus the excluded
 * generated/test dirs below.
 */
const MODULES = Object.fromEntries(
  discoverModules().map((m) => [m.name, { root: m.root, src: m.src }])
)

const only = process.argv.slice(2).filter((a) => !a.startsWith('--'))
const selected = Object.entries(MODULES).filter(([n]) => !only.length || only.includes(n))

const THRESHOLD = 100
const IGNORE_RE = /istanbul ignore file/

// Generated trees inside module dirs are build output or test code, not
// authored source — dist bundles, per-module reports, and the tests tree
// itself are never coverage targets.
const SKIP_DIRS = new Set(['dist', 'node_modules', 'tests', 'reports', 'public'])

const pct = (covered, total) => (total === 0 ? 100 : (covered / total) * 100)

const listSrc = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name)
    return e.isDirectory()
      ? SKIP_DIRS.has(e.name)
        ? []
        : listSrc(p)
      : /\.(ts|tsx|js)$/.test(e.name) && !e.name.endsWith('.d.ts')
        ? [p]
        : []
  })

let failed = false

for (const [name, { root, src: srcDirs }] of selected) {
  const file = path.join(ROOT, root, 'reports', 'coverage', 'coverage-final.json')

  if (!fs.existsSync(file)) {
    console.error(
      `coverage-gate[${name}]: ${path.relative(ROOT, file)} not found — run the module's coverage suite first`
    )
    failed = true
    continue
  }

  const data = JSON.parse(fs.readFileSync(file, 'utf-8'))
  const uncovered = []

  for (const [f, cov] of Object.entries(data)) {
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
      uncovered.push(
        `${path.relative(ROOT, f)} — ${failing.map(([k, v]) => `${k} ${v.toFixed(1)}%`).join(', ')}`
      )
    }
  }

  // Absent-file check scoped to this module's source roots.
  const inReport = new Set(Object.keys(data).map((f) => path.resolve(f)))
  const absent = srcDirs
    .flatMap((d) => listSrc(path.join(ROOT, d)))
    .filter((f) => !inReport.has(path.resolve(f)) && !IGNORE_RE.test(fs.readFileSync(f, 'utf-8')))

  if (uncovered.length || absent.length) {
    failed = true
    if (uncovered.length) {
      console.error(`✗ coverage-gate[${name}]: ${uncovered.length} files below ${THRESHOLD}%:`)
      for (const u of uncovered.slice(0, 40)) console.error(`  ${u}`)
      if (uncovered.length > 40) console.error(`  …and ${uncovered.length - 40} more`)
    }
    if (absent.length) {
      console.error(
        `✗ coverage-gate[${name}]: ${absent.length} src files absent from the report (0% coverage):`
      )
      for (const f of absent.slice(0, 40)) console.error(`  ${path.relative(ROOT, f)}`)
      if (absent.length > 40) console.error(`  …and ${absent.length - 40} more`)
      console.error('  → add tests, or an `istanbul ignore file` pragma with justification')
    }
  } else {
    console.log(`✓ coverage-gate[${name}]: all files ≥${THRESHOLD}%, no absent src files`)
  }
}

process.exit(failed ? 1 : 0)
