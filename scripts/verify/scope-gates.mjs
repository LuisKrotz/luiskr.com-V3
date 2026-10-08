#!/usr/bin/env node
/**
 * @file scope-gates.mjs
 * @description Scoped quality-gate runner for the five-module workspace.
 * Git hooks (pre-commit / pre-push) and CI call this so a change inside one
 * module only pays for that module's gates — lint, stylelint, scoped `tsc`,
 * and the Jest slice that exercises it — instead of the whole monorepo.
 *
 * Usage:
 *   node scripts/verify/scope-gates.mjs run <scope…>          # run gates
 *   node scripts/verify/scope-gates.mjs run --all             # every scope
 *   node scripts/verify/scope-gates.mjs areas <diff-args…>    # map git diff → scopes
 *   node scripts/verify/scope-gates.mjs areas --staged        # map staged files
 *
 * Scope policy (from the workspace contract):
 *   cms   → never runs a11y (axe/contrast governance) or Lighthouse.
 *   docs, earth → Lighthouse never gates them (no performance watching).
 *   app, website, core → full gate set.
 */

import { execSync, execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()

/**
 * Scope registry: module dirs, the Jest roots that exercise them, the
 * per-folder tsconfig for scoped compilation, and policy flags.
 * `governance` is a virtual scope — cross-cutting scan tests that ride with
 * every non-CMS scope.
 */
const SCOPES = {
  app: {
    dirs: ['src'],
    tsconfig: 'tsconfig.json',
    tests: ['tests/app', 'tests/coverage/app'],
    lighthouse: true,
    a11y: true,
  },
  core: {
    dirs: ['core'],
    tsconfig: 'core/tsconfig.json',
    tests: [
      'tests/core',
      'tests/utils',
      'tests/data',
      'tests/routes/router',
      'tests/components/canvas',
      'tests/coverage/core',
      'tests/coverage/utils',
      'tests/coverage/canvas',
      'tests/coverage/legacy-polyfills',
      'tests/coverage/safari',
    ],
    // checkbox-webgl tails exercise the earth-playground widget, not core canvas.
    ignore: [/checkbox-webgl/],
    lighthouse: false,
    a11y: true,
  },
  website: {
    dirs: ['website'],
    tsconfig: 'website/tsconfig.json',
    tests: [
      'tests/components',
      'tests/routes',
      'tests/coverage/components',
      'tests/coverage/routes',
    ],
    // canvas dirs belong to core utils; router to core; docs to docs.
    ignore: [/canvas/, /docs/, /routes\/router/],
    lighthouse: true,
    a11y: true,
  },
  cms: {
    dirs: ['cms'],
    tsconfig: 'cms/tsconfig.json',
    tests: ['tests/cms', 'tests/coverage/cms'],
    ignore: [],
    // Contract: the CMS never runs accessibility scans or Lighthouse.
    lighthouse: false,
    a11y: false,
  },
  earth: {
    dirs: ['experiments/earth-playground'],
    tsconfig: 'experiments/earth-playground/tsconfig.json',
    tests: [
      'tests/playground',
      'tests/coverage/playground',
      'tests/coverage/canvas/widgets/checkbox-webgl-tails.test.js',
      'tests/coverage/canvas/widgets/checkbox-webgl-tails-2.test.js',
    ],
    ignore: [],
    // Contract: experiments never watch Lighthouse performance.
    lighthouse: false,
    a11y: true,
  },
  docs: {
    dirs: ['experiments/docs'],
    tsconfig: 'experiments/docs/tsconfig.json',
    tests: ['tests/build', 'tests/coverage/routes/docs', 'tests/routes/views/view-docs.test.js'],
    ignore: [],
    lighthouse: false,
    a11y: true,
  },
}

/** Ordered most-specific first — first match wins. */
const PATH_SCOPE_RULES = [
  [/^experiments\/earth-playground\//, 'earth'],
  [/^experiments\/docs\//, 'docs'],
  [/^website\//, 'website'],
  [/^core\//, 'core'],
  [/^cms\//, 'cms'],
  [/^src\//, 'app'],
  [/^tests\/coverage\/routes\/docs\//, 'docs'],
  [/^tests\/routes\/views\/view-docs/, 'docs'],
  [/^tests\/build\/docs-pipeline/, 'docs'],
  [/checkbox-webgl/, 'earth'],
  [/^tests\/(playground|coverage\/playground)/, 'earth'],
  [/^tests\/(cms|coverage\/cms)\//, 'cms'],
  [/^tests\/(core|utils|data)\//, 'core'],
  [/^tests\/coverage\/(core|utils|legacy-polyfills|safari|canvas)\//, 'core'],
  [/^tests\/components\/canvas\//, 'core'],
  [/^tests\/routes\/router\//, 'core'],
  [/^tests\/(coverage\/)?app\//, 'app'],
  [/^tests\/(components|routes|coverage\/components|coverage\/routes)\//, 'website'],
  [/^tests\//, 'shared'],
]

/** Files whose change ripples to every module (toolchain, lockfile, config). */
const GLOBAL_FILES =
  /^(package\.json|yarn\.lock|tsconfig\.json|jest\.config\.js|vite\.config\.js|eslint\.config\.js|\.stylelintrc|lighthouserc|\.github|scripts\/verify|scripts\/git-hooks|build\/)/

/** Maps one changed path to its scope (or 'shared' for test infra). */
const scopeForPath = (p) => {
  for (const [re, scope] of PATH_SCOPE_RULES) if (re.test(p)) return scope
  if (GLOBAL_FILES.test(p)) return 'all'
  return 'shared'
}

/** Expands a scope set: 'shared'/'all' resolve to concrete scopes. */
const expand = (scopes) => {
  if (scopes.has('all')) return Object.keys(SCOPES)

  const out = new Set([...scopes].filter((s) => s !== 'shared' && s in SCOPES))

  // Shared infra (test fixtures, governance, mocks) — run every scope's slice.
  if (scopes.has('shared')) for (const s of Object.keys(SCOPES)) out.add(s)

  return [...out]
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

  const testRoots = def.tests.filter(exists)

  if (testRoots.length) {
    run(`${scope} jest`, 'node', [
      ...JEST,
      ...testRoots,
      ...(def.ignore.length
        ? [`--testPathIgnorePatterns=/node_modules/|${def.ignore.map((r) => r.source).join('|')}`]
        : []),
    ])
  }

  // CMS is exempt from the a11y/contrast governance scans by contract.
  if (def.a11y && scope !== 'app' && exists('tests/governance/axe-scan.test.js')) {
    run(`${scope} governance`, 'node', [
      ...JEST,
      'tests/governance/axe-scan.test.js',
      'tests/governance/contrast-aaa.test.js',
    ])
  }
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
