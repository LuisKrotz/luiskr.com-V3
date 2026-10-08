/**
 * @file jest.preset.mjs
 * @description Shared Jest configuration factory for the seven module
 * workspaces (shared, core, website, cms, earth-playground, docs, plus the
 * root aggregate). Every module gets its own jest.config.mjs built by
 * `makeConfig` so `yarn test` inside a module runs ONLY that module's
 * suites — no cross-module monolith — while mocks, transformers, aliases,
 * and the RAM-derived worker budget stay identical everywhere.
 *
 * Paths are absolute (resolved from this file's location, not rootDir), so
 * module configs work regardless of which directory Jest is invoked from:
 * `<rootDir>` in a module config points at the MODULE, while mocks and the
 * resolver live here under shared/tests.
 */
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

/** Absolute path to shared/tests — home of mocks, fixtures, transformers. */
export const TESTS_DIR = path.dirname(fileURLToPath(import.meta.url))

/** Absolute path to the superproject root (shared/tests/../..). */
export const REPO_ROOT = path.dirname(path.dirname(TESTS_DIR))

/**
 * Worker budget derived from RAM, not cores: under istanbul instrumentation
 * each Jest worker keeps a ~1GB+ live heap (plus Node baseline and cache), so
 * CPU-derived caps (90% of 19 cores → 17 workers ≈ 17GB+) OOM-kill memory-
 * constrained hosts like WSL2. Plain runs budget ~2GiB per worker; coverage
 * runs (instrumented heaps, `?inline` SCSS payloads, three.js mocks) budget
 * ~3GiB per worker so the aggregate stays under the reclaim ceiling even
 * alongside a dev server and editor processes. `JEST_MAX_WORKERS` overrides
 * for CI hosts with different budgets.
 */
const RAM_GB_PER_WORKER = 2
const RAM_GB_PER_COVERAGE_WORKER = 3
export const workerBudget = () => {
  const coverage = process.argv.includes('--coverage')
  const perWorker = coverage ? RAM_GB_PER_COVERAGE_WORKER : RAM_GB_PER_WORKER
  const byRam = Math.floor(os.totalmem() / (perWorker * 1024 ** 3))
  const byCpu = Math.max(1, os.cpus().length - 1)
  const override = Number.parseInt(process.env.JEST_MAX_WORKERS ?? '', 10)

  return Number.isFinite(override) && override > 0 ? override : Math.max(2, Math.min(byRam, byCpu))
}

/**
 * Alias + mock map shared by every module config. `@tests/` resolves to
 * shared/tests so any module suite can import fixtures/mocks without
 * depth-counting relative paths. Module aliases (`@core/`, `@website/`,
 * `@cms/`, `@earth/`, `@docs/`, `@/`→shared/src) resolve against REPO_ROOT
 * so tests exercise the real sibling sources.
 */
export const moduleNameMapper = {
  '\\.(scss|css)(\\?inline)?$': path.join(TESTS_DIR, '__mocks__/styleMock.js'),
  '^virtual:i18n-fallback$': path.join(TESTS_DIR, '__mocks__/i18nFallbackMock.js'),
  '^virtual:i18n-boot-index$': path.join(TESTS_DIR, '__mocks__/i18nBootIndexMock.js'),
  '^virtual:docs-manifest$': path.join(TESTS_DIR, '__mocks__/docsManifestMock.js'),
  // mermaid is heavy + DOM-coupled — the docs mermaid module gets a stub
  // that records initialize/run calls and drops placeholder SVGs.
  '^mermaid$': path.join(TESTS_DIR, '__mocks__/mermaid.js'),
  '^@tests/(.*)$': path.join(TESTS_DIR, '$1'),
  '^@build/(.*)$': path.join(REPO_ROOT, 'shared/build/$1'),
  '^@core$': path.join(REPO_ROOT, 'core/index.js'),
  '^@core/(.*)$': path.join(REPO_ROOT, 'core/$1'),
  '^@website/(.*)$': path.join(REPO_ROOT, 'website/$1'),
  '^@cms/(.*)$': path.join(REPO_ROOT, 'cms/$1'),
  '^@earth/(.*)$': path.join(REPO_ROOT, 'experiments/earth-playground/$1'),
  '^@docs/(.*)$': path.join(REPO_ROOT, 'experiments/docs/$1'),
  '^@/(.*)$': path.join(REPO_ROOT, 'shared/src/$1'),
  // three.js is GPU-bound — replaced by chainable auto-mocks so the Earth
  // background engine can run its full lifecycle in tests.
  '^three$': path.join(TESTS_DIR, '__mocks__/three.js'),
  '^three/webgpu$': path.join(TESTS_DIR, '__mocks__/three-webgpu.js'),
  '^three/tsl$': path.join(TESTS_DIR, '__mocks__/three-tsl.js'),
  '^three/examples/jsm/controls/OrbitControls\\.js$': path.join(
    TESTS_DIR,
    '__mocks__/three-post.js'
  ),
  '^three/examples/jsm/tsl/display/BloomNode\\.js$': path.join(
    TESTS_DIR,
    '__mocks__/three-post.js'
  ),
  '^three/examples/jsm/tsl/display/ChromaticAberrationNode\\.js$': path.join(
    TESTS_DIR,
    '__mocks__/three-post.js'
  ),
  '^three/examples/jsm/tsl/display/FilmNode\\.js$': path.join(TESTS_DIR, '__mocks__/three-post.js'),
}

/**
 * Authored-source roots across the superproject. Every module config
 * instruments ALL of them — Jest only instruments files matching
 * collectCoverageFrom, so scoping a module's run to its own dir would lose
 * the coverage its tests produce in sibling sources (a website suite that
 * imports core utils, for example). shared/scripts/test/merge-coverage.mjs
 * then unions the per-module maps and re-emits reports filtered by module,
 * which is what coverage-gate enforces.
 */
// Experiment source roots are discovered (every experiments/<name>/ dir
// with a jest.config.mjs), so scaffolded modules instrument automatically —
// see shared/scripts/modules.mjs. Imported lazily here to keep the preset
// free of a hard dependency cycle on the scripts tree.
const EXPERIMENT_ROOTS = fs.existsSync(path.join(REPO_ROOT, 'experiments'))
  ? fs
      .readdirSync(path.join(REPO_ROOT, 'experiments'), { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => `experiments/${e.name}`)
      .filter((d) => fs.existsSync(path.join(REPO_ROOT, d, 'jest.config.mjs')))
  : []

export const SOURCE_ROOTS = ['shared/src', 'core', 'website', 'cms', ...EXPERIMENT_ROOTS]

const SOURCE_GLOBS = SOURCE_ROOTS.map((d) => `<rootDir>/${d}/**/*.{js,ts,tsx}`)

/** Coverage exclusions common to every module (generated + test trees). */
const COVERAGE_EXCLUDES = [
  '!**/*.d.ts',
  '!**/__mocks__/**',
  '!**/node_modules/**',
  '!**/tests/**',
  // Per-module library builds emit <module>/dist/ — generated bundles, never
  // authored source, so they must not enter the coverage surface.
  '!**/dist/**',
  // Per-module reports/ trees carry istanbul's own HTML report assets
  // (block-navigation.js, prettify.js, sorter.js) — generated artifacts.
  '!**/reports/**',
  // <module>/dev.ts files are standalone `vite dev` entry points — they
  // mount a view into document.body at import time, so they only run
  // under a real dev server. Each carries an `istanbul ignore file`
  // pragma documenting that (same class as vite.config.js).
  '!**/dev.ts',
  // <module>/public/ holds runtime-served static payloads (wasm binaries,
  // worker scripts, textures, meta files) — fetched as assets, never
  // imported, so instrumenting them is meaningless.
  '!**/public/**',
]

/**
 * Builds a complete per-module Jest config. `rootDir` is the REPO ROOT for
 * every module — Jest's glob resolution (`<rootDir>`-anchored) does not
 * honor absolute collectCoverageFrom patterns, so a shared rootDir is what
 * lets each module's run instrument all authored source while its
 * testMatch still selects only that module's own tests/ tree.
 *
 * @param {object} opts
 * @param {string} opts.name       Module name (used in report labeling).
 * @param {string} opts.dir        Module directory relative to the repo root.
 * @param {string[]} [opts.tests]  Test dirs inside the module (default: tests/).
 * @returns {object} Jest config object for the module's jest.config.mjs.
 */
export const makeConfig = ({ name, dir, tests = ['tests'] }) => ({
  displayName: name,
  rootDir: REPO_ROOT,
  testEnvironment: 'node',
  // TS migration: `.js` specifiers may resolve to `.ts`/`.tsx` sources.
  resolver: path.join(TESTS_DIR, 'resolver.js'),
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  transform: {
    '^.+\\.(mjs|[jt]sx?)$': path.join(TESTS_DIR, 'transformers/jsx-transformer.js'),
  },
  moduleNameMapper,
  setupFilesAfterEnv: [path.join(TESTS_DIR, 'setup.js')],
  testMatch: tests.map((d) => `<rootDir>/${dir}/${d}/**/*.test.{js,ts,tsx}`),
  // WebGL/engine suites await real async boot paths; instrumented parallel
  // runs starve real timers, so both the timeout and the worker cap are
  // sized for the coverage run, not the solo-run ideal.
  testTimeout: 120000,
  // RAM-derived worker cap (see workerBudget above): 15GiB WSL2 → 7 plain /
  // 5 coverage workers. workerIdleMemoryLimit below still recycles a worker
  // the moment its heap goes idle over the cap — the two bounds compose.
  maxWorkers: workerBudget(),
  // Recycle workers once their idle heap exceeds 512MB — keeps parallel
  // throughput high without the aggregate-RAM contention that produced
  // "worker failed to exit gracefully" under the old higher-worker runs.
  workerIdleMemoryLimit: '512MB',
  // Workers with large instrumented heaps legitimately need >500ms to tear
  // down under parallel load; jest's default grace force-kills them and
  // prints a leak warning despite zero actual open handles (verified via
  // --detectOpenHandles). 10s stays bounded — real hangs still get killed.
  workerGracefulExitTimeout: 10000,
  // Raw per-module map — every run emits the full-source coverage its own
  // suites exercised; merge-coverage.mjs unions these into the per-module
  // reports the gate reads. No coverageThreshold here: a single module's
  // run legitimately leaves sibling-module files at 0% — the merged
  // coverage-gate (100% per file) is the authoritative enforcer.
  collectCoverageFrom: [...SOURCE_GLOBS, ...COVERAGE_EXCLUDES],
  // Raw maps land in reports/coverage-run/; merge-coverage.mjs unions all
  // module raws into <module>/reports/coverage/ filtered to that module's
  // sources — the raw split keeps the merge idempotent and rerunnable.
  coverageDirectory: `${REPO_ROOT}/${dir}/reports/coverage-run`,
  // 'json' (coverage-final.json) feeds merge-coverage.mjs; json-summary
  // and html describe this run in isolation before the merge rewrites them.
  coverageReporters: ['text', 'json-summary', 'json'],
})
