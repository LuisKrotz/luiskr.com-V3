import os from 'node:os'

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
const workerBudget = () => {
  const coverage = process.argv.includes('--coverage')
  const perWorker = coverage ? RAM_GB_PER_COVERAGE_WORKER : RAM_GB_PER_WORKER
  const byRam = Math.floor(os.totalmem() / (perWorker * 1024 ** 3))
  const byCpu = Math.max(1, os.cpus().length - 1)
  const override = Number.parseInt(process.env.JEST_MAX_WORKERS ?? '', 10)

  return Number.isFinite(override) && override > 0 ? override : Math.max(2, Math.min(byRam, byCpu))
}

export default {
  testEnvironment: 'node',
  // TS migration: `.js` specifiers may resolve to `.ts`/`.tsx` sources.
  resolver: '<rootDir>/tests/resolver.js',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  transform: {
    '^.+\\.(mjs|[jt]sx?)$': '<rootDir>/tests/transformers/jsx-transformer.js',
  },
  moduleNameMapper: {
    '\\.(scss|css)(\\?inline)?$': '<rootDir>/tests/__mocks__/styleMock.js',
    '^virtual:i18n-fallback$': '<rootDir>/tests/__mocks__/i18nFallbackMock.js',
    '^virtual:i18n-boot-index$': '<rootDir>/tests/__mocks__/i18nBootIndexMock.js',
    '^virtual:docs-manifest$': '<rootDir>/tests/__mocks__/docsManifestMock.js',
    // mermaid is heavy + DOM-coupled — the docs mermaid module gets a stub
    // that records initialize/run calls and drops placeholder SVGs.
    '^mermaid$': '<rootDir>/tests/__mocks__/mermaid.js',
    '^@core$': '<rootDir>/core/index.js',
    '^@core/(.*)$': '<rootDir>/core/$1',
    '^@website/(.*)$': '<rootDir>/website/$1',
    '^@cms/(.*)$': '<rootDir>/cms/$1',
    '^@earth/(.*)$': '<rootDir>/experiments/earth-playground/$1',
    '^@docs/(.*)$': '<rootDir>/experiments/docs/$1',
    '^@/(.*)$': '<rootDir>/src/$1',
    // three.js is GPU-bound — replaced by chainable auto-mocks so the Earth
    // background engine can run its full lifecycle in tests.
    '^three$': '<rootDir>/tests/__mocks__/three.js',
    '^three/webgpu$': '<rootDir>/tests/__mocks__/three-webgpu.js',
    '^three/tsl$': '<rootDir>/tests/__mocks__/three-tsl.js',
    '^three/examples/jsm/controls/OrbitControls\\.js$': '<rootDir>/tests/__mocks__/three-post.js',
    '^three/examples/jsm/tsl/display/BloomNode\\.js$': '<rootDir>/tests/__mocks__/three-post.js',
    '^three/examples/jsm/tsl/display/ChromaticAberrationNode\\.js$':
      '<rootDir>/tests/__mocks__/three-post.js',
    '^three/examples/jsm/tsl/display/FilmNode\\.js$': '<rootDir>/tests/__mocks__/three-post.js',
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  testMatch: ['<rootDir>/tests/**/*.test.{js,ts,tsx}'],
  // WebGL/engine suites await real async boot paths; instrumented parallel
  // runs starve real timers, so both the timeout and the worker cap are
  // sized for the coverage run, not the solo-run ideal.
  testTimeout: 120000,
  // RAM-derived worker cap (see workerBudget above): 15GiB WSL2 → 7 plain /
  // 5 coverage workers. workerIdleMemoryLimit below still recycles a worker
  // the moment its heap goes idle over the cap — the two bounds compose.
  maxWorkers: workerBudget(),
  // Recycle workers once their idle heap exceeds 4GB — keeps parallel
  // throughput high without the aggregate-RAM contention that produced
  // "worker failed to exit gracefully" under the old higher-worker runs.
  workerIdleMemoryLimit: '512MB',
  // Workers with large instrumented heaps legitimately need >500ms to tear
  // down under parallel load; jest's default grace force-kills them and
  // prints a leak warning despite zero actual open handles (verified via
  // --detectOpenHandles). 10s stays bounded — real hangs still get killed.
  workerGracefulExitTimeout: 10000,
  collectCoverageFrom: [
    '{src,core,website,cms,experiments}/**/*.{js,ts,tsx}',
    '!**/*.d.ts',
    '!**/__mocks__/**',
    '!**/node_modules/**',
    // Per-area library builds emit <area>/dist/ — generated bundles, never
    // authored source, so they must not enter the coverage surface.
    '!**/dist/**',
  ],
  coverageDirectory: 'coverage',
  // 'json' (coverage-final.json) is required by scripts/verify/coverage-gate.mjs for
  // per-file enforcement; json-summary feeds the deploy-info CMS bundle.
  coverageReporters: ['text', 'json-summary', 'json', 'html'],
  // Gate: 100% on all metrics — failure blocks `npm run verify` (pre-commit +
  // prebuild), so no dist ships below the bar.
  // see docs/guides/testing.md for the per-file enforcement script.
  coverageThreshold: {
    global: {
      statements: 100,
      branches: 100,
      functions: 100,
      lines: 100,
    },
  },
}
