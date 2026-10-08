#!/usr/bin/env node
/**
 * @file scope-gates.mjs
 * @description Scoped quality-gate runner for the module workspace. Git
 * hooks (pre-commit / pre-push) and CI call this so a change inside one
 * module only pays for that module's gates — scoped `tsc`, eslint,
 * stylelint, and the module's own Jest suite — instead of the whole
 * monorepo.
 *
 * Tests live inside their module (`<module>/tests`, `shared/tests` for the
 * app shell + cross-cutting governance). Each scope therefore delegates to
 * the module's jest.config.mjs rather than to path slices of one monolith.
 *
 * Usage:
 *   node shared/scripts/verify/scope-gates.mjs run <scope…>          # run gates
 *   node shared/scripts/verify/scope-gates.mjs run --all             # every scope
 *   node shared/scripts/verify/scope-gates.mjs areas <diff-args…>    # map git diff → scopes
 *   node shared/scripts/verify/scope-gates.mjs areas --staged        # map staged files
 *
 * Scope policy (from the workspace contract):
 *   cms        → never runs a11y (axe/contrast governance) or Lighthouse.
 *   docs,earth → Lighthouse never gates them (no performance watching).
 *   app,website,core → full gate set.
 *   local-modules / shared infra → ripple to every scope (toolchain-wide).
 */

import { execSync, execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..')

/**
 * Scope registry: module dirs, the per-module tsconfig and jest config,
 * and policy flags.
 *   dirs     — source roots eslint/stylelint scan.
 *   tsconfig — scoped compilation target.
 *   jest     — the module's own Jest config (its tests live inside it).
 *   governance — also run the cross-cutting scan suite in shared/tests.
 *   a11y     — include axe-scan + contrast-aaa in that governance run.
 *   lighthouse — the scope is eligible for Lighthouse performance checks.
 */
const SCOPES = {
  app: {
    dirs: ['shared/src'],
    tsconfig: 'tsconfig.json',
    jest: 'shared/jest.config.mjs',
    // shared's suite already contains governance — no second invocation.
    governance: false,
    a11y: true,
    lighthouse: true,
  },
  core: {
    dirs: ['core'],
    tsconfig: 'core/tsconfig.json',
    jest: 'core/jest.config.mjs',
    governance: true,
    a11y: true,
    lighthouse: false,
  },
  website: {
    dirs: ['website'],
    tsconfig: 'website/tsconfig.json',
    jest: 'website/jest.config.mjs',
    governance: true,
    a11y: true,
    lighthouse: true,
  },
  cms: {
    dirs: ['cms'],
    tsconfig: 'cms/tsconfig.json',
    jest: 'cms/jest.config.mjs',
    governance: true,
    // Contract: the CMS never runs accessibility scans or Lighthouse.
    a11y: false,
    lighthouse: false,
  },
  earth: {
    dirs: ['experiments/earth-playground'],
    tsconfig: 'experiments/earth-playground/tsconfig.json',
    jest: 'experiments/earth-playground/jest.config.mjs',
    governance: true,
    a11y: true,
    // Contract: experiments never watch Lighthouse performance.
    lighthouse: false,
  },
  docs: {
    dirs: ['experiments/docs'],
    tsconfig: 'experiments/docs/tsconfig.json',
    jest: 'experiments/docs/jest.config.mjs',
    governance: true,
    a11y: true,
    lighthouse: false,
  },
}

/** Ordered most-specific first — first match wins. */
const PATH_SCOPE_RULES = [
  [/^experiments\/earth-playground\//, 'earth'],
  [/^experiments\/docs\//, 'docs'],
  [/^website\//, 'website'],
  [/^core\//, 'core'],
  [/^cms\//, 'cms'],
  [/^shared\/src\//, 'app'],
  // Vendored publishable packages feed every module — a change ripples wide.
  [/^shared\/local-modules\//, 'all'],
  // Shared infra (scripts, build toolchain, test harness) ripples to all.
  [/^shared\/(scripts|build|tests)\//, 'shared'],
  [/^shared\//, 'app'],
]

/** Files whose change ripples to every module (toolchain, lockfile, config). */
const GLOBAL_FILES =
  /^(package\.json|yarn\.lock|tsconfig\.json|jest\.config\.js|vite\.config\.js|eslint\.config\.js|\.stylelintrc|lighthouserc|\.github)/

/**
 * Governance scans that are NOT accessibility checks — style, JSDoc, and
 * portability governance run for every gated scope including cms. The a11y
 * pair (axe-scan, contrast-aaa) is appended only when the scope's `a11y`
 * flag allows it.
 */
const GOVERNANCE_DIR = 'shared/tests/governance'
const A11Y_SCANS = [/^axe-scan\./, /^contrast-aaa\./]

/** Maps one changed path to its scope (or 'shared' for infra/toolchain). */
const scopeForPath = (p) => {
  for (const [re, scope] of PATH_SCOPE_RULES) if (re.test(p)) return scope
  if (GLOBAL_FILES.test(p)) return 'all'
  return 'shared'
}

/** Expands a scope set: 'shared'/'all' resolve to concrete scopes. */
const expand = (scopes) => {
  if (scopes.has('all') || scopes.has('shared')) return Object.keys(SCOPES)
  return [...scopes].filter((s) => s in SCOPES)
}

/**
 * Lists files changed in a diff range (or the index for --staged). The
 * 64 MiB maxBuffer absorbs mega-diffs — the default 1 MiB silently
 * truncated a ~21k-file push and produced an empty list. A diff failure
 * is fatal, not skippable: returning [] would push with zero gates.
 */
const changedFiles = (args) => {
  const opts = { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }

  if (args.includes('--staged')) {
    return execSync('git diff --cached --name-only', opts).split('\n').filter(Boolean)
  }

  const range = args.find((a) => !a.startsWith('-')) || 'HEAD'

  return execSync(`git diff --name-only ${range}`, opts).split('\n').filter(Boolean)
}

const exists = (p) => fs.existsSync(path.join(ROOT, p))

const run = (label, cmd, args) => {
  process.stdout.write(`\n── ${label}: ${cmd} ${args.join(' ')} ──\n`)
  execFileSync(cmd, args, { cwd: ROOT, stdio: 'inherit', shell: false })
}

const JEST = [
  '--experimental-vm-modules',
  '--disable-warning=ExperimentalWarning',
  'node_modules/jest/bin/jest.js',
]

/**
 * Runs the cross-cutting governance suite (shared/tests/governance) under
 * the shared module's Jest config. Scopes flagged `a11y: false` (cms)
 * exclude the axe/contrast pair per the workspace contract.
 */
const runGovernance = (scope, a11y) => {
  const dir = path.join(ROOT, GOVERNANCE_DIR)
  if (!fs.existsSync(dir)) return

  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.test.js'))
    .filter((f) => a11y || !A11Y_SCANS.some((re) => re.test(f)))
    .map((f) => path.join(GOVERNANCE_DIR, f))

  if (!files.length) return

  run(`${scope} governance`, 'node', [...JEST, '--config', 'shared/jest.config.mjs', ...files])
}

/** Runs the gate set for one scope. */
const runScope = (scope) => {
  const def = SCOPES[scope]
  const dirs = def.dirs.filter(exists)

  run(`${scope} tsc`, 'yarn', ['tsc', '-p', def.tsconfig, '--noEmit'])
  run(`${scope} eslint`, 'yarn', ['eslint', ...dirs, '--max-warnings=0'])

  const hasScss = dirs.some((d) =>
    execSync(`git ls-files "${d}/**/*.scss"`, { cwd: ROOT, encoding: 'utf8' }).trim()
  )

  if (hasScss) {
    run(`${scope} stylelint`, 'yarn', [
      'stylelint',
      ...dirs.map((d) => `${d}/**/*.scss`),
      '--max-warnings=0',
    ])
  }

  if (exists(def.jest)) {
    run(`${scope} jest`, 'node', [...JEST, '--config', def.jest])
  }

  if (def.governance) runGovernance(scope, def.a11y)
}

const [, , mode, ...args] = process.argv

if (mode === 'areas') {
  const files = changedFiles(args)

  if (!files.length) {
    console.log('')
    process.exit(0)
  }

  const scopes = expand(new Set(files.map(scopeForPath)))

  process.stdout.write(scopes.join(' ') + '\n')
} else if (mode === 'run') {
  const scopes = args.includes('--all') ? Object.keys(SCOPES) : expand(new Set(args))

  if (!scopes.length) {
    process.stdout.write('scope-gates: nothing to run\n')
    process.exit(0)
  }

  for (const scope of scopes) runScope(scope)
} else {
  process.stderr.write('usage: scope-gates.mjs run <scope…|--all> | areas <git-range|--staged>\n')
  process.exit(1)
}
