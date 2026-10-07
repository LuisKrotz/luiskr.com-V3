#!/usr/bin/env node
/**
 * @file verify.mjs
 * @description Single quality gate shared by `prebuild` and the git
 * pre-commit hook. Runs every check the project enforces:
 *
 *   1. console-scan   forbidden console.* callsites (debug leftovers)
 *   2. typecheck      tsc --noEmit over all .ts/.tsx sources
 *   3. eslint         src + tests (style governance, token rules)
 *   4. jest coverage  full suite incl. axe a11y scan + style governance;
 *                     writes reports/axe-report.json + coverage/
 *   5. coverage-gate  per-file ≥95% on statements/branches/functions
 *   6. security-scan  Snyk (SNYK_TOKEN) / yarn audit fallback
 *                     writes reports/snyk-report.json
 *
 * Every step writes machine-readable reports consumed by
 * scripts/build/deploy-info.mjs → dist/deploy-info/ → CMS "Deploy Info" tab.
 * Exits non-zero if ANY step fails — callers must not build/commit.
 *
 * Escape hatch for local iteration: VERIFY_ONLY=lint,test limits the run.
 */

import { execSync } from 'node:child_process'

// FORCE_COLOR=1 keeps ANSI colors on jest/eslint/stylelint output even when
// the gate runs piped (pre-commit hook, CI log capture) — the tool CLIs
// would otherwise auto-disable color on non-TTY stdio.
const JEST =
  'node --experimental-vm-modules --disable-warning=ExperimentalWarning node_modules/jest/bin/jest.js --coverage'

const STEPS = {
  format:
    'yarn prettier --check "**/*.{js,mjs,cjs,ts,tsx,scss,css,json,md,yml,yaml,html}" --ignore-unknown',
  'console-scan': 'node scripts/verify/console-scan.mjs',
  typecheck: 'yarn tsc --noEmit',
  lint: 'yarn eslint src tests --max-warnings=0',
  stylelint: 'yarn stylelint "src/**/*.scss" --max-warnings=0',
  test: JEST,
  'coverage-gate': 'node scripts/verify/coverage-gate.mjs',
  'security-scan': 'node scripts/verify/security-scan.mjs',
}

const only = (process.env.VERIFY_ONLY || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

const steps = Object.entries(STEPS).filter(([name]) => !only.length || only.includes(name))

const failures = []

for (const [name, cmd] of steps) {
  console.log(`\n═══ verify: ${name} ═══`)

  try {
    execSync(cmd, {
      stdio: 'inherit',
      cwd: process.cwd(),
      env: { ...process.env, FORCE_COLOR: '1' },
    })
    console.log(`✓ ${name}`)
  } catch {
    failures.push(name)
    console.error(`✗ ${name} FAILED`)
  }
}

if (failures.length) {
  console.error(`\n✗ verify FAILED: ${failures.join(', ')} — fix before building/committing`)
  process.exit(1)
}

console.log('\n✓ verify: all checks passed')
