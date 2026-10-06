export default {
  testEnvironment: 'node',
  // TS migration: `.js` specifiers may resolve to `.ts`/`.tsx` sources.
  resolver: '<rootDir>/tests/resolver.js',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  transform: {
    '^.+\\.[jt]sx?$': '<rootDir>/tests/transformers/jsx-transformer.js',
  },
  moduleNameMapper: {
    '\\.(scss|css)(\\?inline)?$': '<rootDir>/tests/__mocks__/styleMock.js',
    '^virtual:i18n-fallback$': '<rootDir>/tests/__mocks__/i18nFallbackMock.js',
    '^virtual:i18n-boot-index$': '<rootDir>/tests/__mocks__/i18nBootIndexMock.js',
    '^@core$': '<rootDir>/src/core/index.js',
    '^@core/(.*)$': '<rootDir>/src/core/$1',
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
  testTimeout: 60000,
  // ~50% of cores: at 60%+ the instrumented coverage heaps (≈1GB+ each on
  // this 19-core/15GB box) contended for RAM, making workers slow enough at
  // teardown to trip jest's "failed to exit gracefully" warning. Fewer
  // workers = CPU + heap headroom, cleaner exits.
  maxWorkers: '50%',
  // Workers with large instrumented heaps legitimately need >500ms to tear
  // down under parallel load; jest's default grace force-kills them and
  // prints a leak warning despite zero actual open handles (verified via
  // --detectOpenHandles). 10s stays bounded — real hangs still get killed.
  workerGracefulExitTimeout: 10000,
  collectCoverageFrom: [
    'src/**/*.{js,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/__mocks__/**',
    '!**/node_modules/**',
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
