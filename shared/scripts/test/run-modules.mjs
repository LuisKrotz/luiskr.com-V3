#!/usr/bin/env node
/**
 * @file run-modules.mjs
 * @description Runs the Jest suite of every module workspace SEQUENTIALLY —
 * shared, core, website, cms, earth-playground, docs — each with its own
 * jest.config.mjs and its own reports/ output. Sequential order keeps the
 * aggregate memory footprint bounded (one module's worker pool at a time)
 * while still covering the whole tree; per-module isolation means a CMS
 * change never re-runs the docs suite.
 *
 * Usage:
 *   node shared/scripts/test/run-modules.mjs [--coverage] [module…]
 */
import { execFileSync } from 'node:child_process'
import path from 'node:path'

import { discoverModules, REPO_ROOT } from '../modules.mjs'

// Module list is discovered, not hardcoded — experiments/<name>/ dirs with
// a jest.config.mjs self-register (see shared/scripts/modules.mjs).
const MODULES = discoverModules().map(({ name, root }) => [name, `${root}/jest.config.mjs`])

const args = process.argv.slice(2)
const coverage = args.includes('--coverage')
const only = args.filter((a) => !a.startsWith('--'))
const selected = MODULES.filter(([name]) => !only.length || only.includes(name))

const JEST = [
  '--experimental-vm-modules',
  '--disable-warning=ExperimentalWarning',
  path.join(REPO_ROOT, 'node_modules/jest/bin/jest.js'),
]

let failed = false

for (const [name, config] of selected) {
  process.stdout.write(`\n═══ jest: ${name} ═══\n`)

  try {
    execFileSync('node', [...JEST, '--config', config, ...(coverage ? ['--coverage'] : [])], {
      stdio: 'inherit',
      cwd: REPO_ROOT,
    })
  } catch {
    failed = true
    process.stderr.write(`✗ ${name} suite failed\n`)
  }
}

// Per-module runs instrument all authored source, so each raw map only
// reflects that module's suites. Union them and re-emit reports filtered
// per module — the merged reports are what coverage-gate enforces.
if (coverage) {
  try {
    execFileSync('node', ['shared/scripts/test/merge-coverage.mjs', ...only], {
      stdio: 'inherit',
      cwd: REPO_ROOT,
    })
  } catch {
    failed = true
    process.stderr.write('✗ coverage merge failed\n')
  }
}

process.exit(failed ? 1 : 0)
