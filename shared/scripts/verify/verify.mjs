#!/usr/bin/env node
/**
 * @file verify.mjs
 * @description Single quality gate shared by `prebuild` and the git
 * pre-commit hook. Runs every check the project enforces:
 *
 *   1. console-scan   forbidden console.* callsites (debug leftovers)
 *   2. typecheck      tsc --noEmit over all .ts/.tsx sources
 *   3. eslint         all module areas (style governance, token rules)
 *   4. jest coverage  every module's suite incl. axe a11y scan + style
 *                     governance; writes experiments/docs/reports/ + <module>/reports/coverage/
 *   5. coverage-gate  per-file 100% on statements/branches/functions/lines
 *                     in every module
 *   6. security-scan  Snyk (SNYK_TOKEN) / yarn audit fallback
 *                     writes experiments/docs/reports/snyk-report.json
 *
 * Every step writes machine-readable reports consumed by
 * shared/scripts/build/deploy-info.mjs → dist/deploy-info/ → CMS
 * "Deploy Info" tab. Exits non-zero if ANY step fails — callers must not
 * build/commit.
 *
 * Escape hatch for local iteration: VERIFY_ONLY=lint,test limits the run.
 */

import { execSync } from 'node:child_process'

const STEPS = {
  format:
    'yarn prettier --check "**/*.{js,mjs,cjs,ts,tsx,scss,css,json,md,yml,yaml,html}" --ignore-unknown',
  'console-scan': 'node shared/scripts/verify/console-scan.mjs',
  typecheck: 'yarn tsc --noEmit',
  lint: 'yarn eslint shared core website cms experiments --max-warnings=0',
  stylelint: 'yarn stylelint "{shared,core,website,cms,experiments}/**/*.scss" --max-warnings=0',
  test: 'node shared/scripts/test/run-modules.mjs --coverage',
  'coverage-gate': 'node shared/scripts/verify/coverage-gate.mjs',
  'security-scan': 'node shared/scripts/verify/security-scan.mjs',
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
