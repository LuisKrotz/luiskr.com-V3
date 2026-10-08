# Testing

## Jest (`yarn test` — always run via the package script)

~370 suites / ~3900 tests across **per-module Jest configs** — there is no
monolithic suite. `yarn test` invokes `shared/scripts/test/run-modules.mjs`,
which discovers modules via `shared/scripts/modules.mjs` (platform modules
fixed; any `experiments/<name>/jest.config.mjs` self-registers) and runs
each module's `jest.config.mjs` sequentially. `yarn test <name…>` runs a
subset. Each config is built by `makeConfig` in
`shared/tests/jest.preset.mjs`: shared mocks/transformers/aliases, `rootDir`
at the repo root, `testMatch` scoped to the module's own `tests/` tree.

Every module owns its `tests/`, grouped by domain — no flat test dirs.
`shared/tests/` additionally holds shared infra (`fixtures/`, `__mocks__/`,
`transformers/`, `jest.preset.mjs`, `setup.js`) reachable from any suite via
the `@tests/` alias, plus the app-shell and governance suites. Coverage
tails live under `tests/coverage/<domain>/<subdomain>/` mirroring the
module's source tree — one file per describe, named after the module under
test.
Source-scan tests read real files via `readJs`/`readJsTree` entries in
`shared/tests/fixtures/test-constants.js`, so moving a file means updating
that path map (plus the few `readFileSync` paths).

## Memory-safe worker sizing

`jest.preset.mjs` derives `maxWorkers` from **RAM, not cores**: under
istanbul instrumentation each worker keeps a ~1GB+ live heap, so a
CPU-derived cap (`90%` of 19 cores → 17 workers ≈ 17GB+) OOM-kills
memory-constrained hosts like WSL2. Plain `yarn test` budgets
`~2GiB per worker` (15GiB → 7); `yarn test:coverage` detects the
`--coverage` flag in argv and budgets `~3GiB per worker` (15GiB → 5)
since instrumented heaps + `?inline` SCSS payloads run heavier. Both are
clamped to `cpus − 1`, and `JEST_MAX_WORKERS=<n>` overrides either for CI
hosts with different budgets. `workerIdleMemoryLimit: '512MB'` still
recycles a worker the moment its heap goes idle over the cap — the two
bounds compose. `shared/scripts/verify/scope-gates.mjs run --all` runs area
gates **sequentially**, and the gates never overlap with `yarn build` —
the verify pipeline is strictly sequential for the same reason.

| Suite family                                      | Guards                                                                                                                         |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `style-governance.test.js`                        | Every AGENTS.md rule (colors, spacing, classes, strings, JSX, `!important`, DRY selectors, blank lines)                        |
| `sass-structure.test.js`                          | Sass layer exists, `?inline` imports present, no stray hardcoding                                                              |
| `i18n-*` / `portfolio-data`                       | Locale structure mirrors `en`; all `UI_KEYS` resolve; project schema                                                           |
| `webgl-*`, `canvas-*`                             | Fallback marking, destroy()-on-mock safety, pool release                                                                       |
| `axe-scan.test.js` + `contrast-aaa.test.js`       | axe WCAG A/AA/AAA rule set (moderate+ violations fail) and computed token contrast floors — 7:1 text, 3:1 UI (SC 1.4.6/1.4.11) |
| `animations`, `nav-modals`, `shadow-dom-css-vars` | Animation tokens ↔ SCSS parity; nav/modal markup contracts; `--mf-*` var contract between host + media-figure shadow roots     |
| `e2e-fidelity`, `router-*`                        | Route parsing, locale prefixes, slug switching                                                                                 |
| `wasm-*`                                          | Layout/media worker interfaces                                                                                                 |

GL is mocked — canvas widgets must release resources defensively
(`if (gl.deleteX)` guards), and tests assert the loop/flag state rather than
pixels (`preserveDrawingBuffer` is off by design).

## String literals in tests — token imports only

Test files follow the same zero-hardcoding rule as the source areas
(AGENTS.md rule 5, enforced by style-governance Rule 11):

- Any string that exists in the token layer (`core/tokens/**`, surfaced
  through `core/constants.ts` as `TAGS`, `CLASSES`,
  `ATTRS`, `EVENTS`, `MUTATIONS`, `PATHS`, `SELECTORS`, `IDS`, `STORAGE_KEYS`,
  `LOCALES`, `THEME`, `STRINGS`, `CSS_PROPS`, `URLS`, `MEDIA`, `TEXT`,
  `ROUTE_NAMES`, `TRANSLATION_KEYS`, `UI_KEYS`, `COMPONENT_KEYS`, `CMS_KEYS`,
  `KEYS`, `ANIMATION`, …) or in `cms/tokens.ts` must be imported and
  referenced — never written as an inline literal in `describe`/`test` bodies,
  `expect()` assertions, `querySelector`, `setAttribute`, `store.commit`, or
  event dispatch.
- Test-only vocabulary (fixture element tags, sample project IDs/slugs,
  sample text, sample award names) lives once in
  `shared/tests/fixtures/test-constants.js` (`TEST_TAGS`, `TEST_TEXT`,
  `TEST_PROJECTS`, `TEST_AWARDS`) — import from there via `@tests/`.
- Exempt: import paths, `describe`/`test` names, Node API args (`'fs'`,
  `'utf-8'`), regex syntax fragments, one-off fixture data.
- `tests/constants.test.js` and the fixture file itself are exempt from the
  scan — they define/verify the token values.

## Adding a route/component checklist

1. Component under its domain (`components/<domain>/`, `cms/<feature>/`,
   `playground/`) — facade at the folder root, modules in a `<name>/`
   subfolder.
2. Route view under `<domain>/routes/`; register in `routes/router.ts`.
3. `readJs`/`readScss` entries in `shared/tests/fixtures/test-constants.js` if
   governance applies.
4. Translation keys into `database.json` for **all 16 locales** — run
   `shared/scripts/i18n/i18n-audit.py`.
5. No new string literals twice — extend the leaf group in `core/tokens/`.
6. Governance suite still green: `yarn test && yarn lint`.

## Lighthouse

Run against `vite preview` (not dev). Scores at last full pass:
home desktop 98 / a11y 100 / BP 100 / SEO 100; mobile perf is gated by
missing responsive image variants on the CDN (see build.md). Delete all
report artifacts (`lighthouse-reports/`, `.lighthouseci/`, stray `*.json`)
after reading — repo rule.

## Coverage

`yarn test:coverage` runs every module suite with instrumentation. Each
module run instruments ALL authored source and writes a raw map to
`<module>/reports/coverage-run/`; `shared/scripts/test/merge-coverage.mjs`
then unions the six raw maps and re-emits per-module reports (filtered to
each module's own sources) under `<module>/reports/coverage/` — that merged
output is what `coverage-gate.mjs` enforces at 100% per file. The summary
is packaged into `dist/deploy-info/` by `yarn deploy:info` and shown in
the CMS Deploy Info tab. Reports are gitignored.

## Verification pipeline

`yarn verify` is the single quality gate — it runs, in order:

1. `shared/scripts/verify/console-scan.mjs` — zero-console policy: **every** `console.*` callsite in the source modules (`shared/src|core|website|cms|experiments/**/*.ts|tsx|js`) is a violation (no allowlist). Diagnostics route through `core/devlog.ts` (`devWarn`/`devError`/`devInfo` — capped ring buffer, inspect in devtools via `__lkDevLog()`); report → `reports/console-scan.json`
2. `yarn eslint` — zero errors and warnings
3. `run-modules.mjs --coverage` — every module suite, including `shared/tests/governance/axe-scan.test.js` (axe-core WCAG A+AA+AAA rule tags → `reports/axe-report.json`; violations of moderate impact or higher fail — matching Lighthouse's binary a11y gate; the CMS surface is excluded per the scope policy), `contrast-aaa.test.js` (compiles the token sheet and enforces real WCAG AAA contrast ratios — 7:1 text, 3:1 UI/focus — since happy-dom cannot evaluate paint contrast and axe reports those checks as `incomplete`), and `style-governance.test.js` (zero-hardcoding + zero-console + no stack-emulation + no-codemod checks)
4. `shared/scripts/test/merge-coverage.mjs` — unions the per-module raw maps into per-module reports
5. `shared/scripts/verify/coverage-gate.mjs` — per-file **100%** statements/branches/functions/lines enforcement on the merged reports, plus an absent-file check: every source file across the modules must appear in its report or carry `/* istanbul ignore file */` — a file missing from the report has silently 0% coverage
6. `shared/scripts/verify/security-scan.mjs` — `snyk test` when `SNYK_TOKEN` is set, else `yarn audit`; **all** severities fail (critical/high/moderate/low) unless a `local-modules/` hardening replaces the package — see `local-modules/` — or a `security-exceptions.json` entry (requires justification + review date); report → `reports/snyk-report.json`

### Scoped gates

`shared/scripts/verify/scope-gates.mjs` maps changed files → affected areas and
runs only those areas' checks — `yarn gates:areas --staged` for the staged
set, `yarn gates:scope <area…>` (`app|core|website|cms|earth|docs`) to run
explicit scopes, `yarn gates` for every area sequentially. Each scope runs
its own `tsconfig.json`, eslint + stylelint on its tree, and its Jest test
slice. Shared/global edits (core, configs, scripts) expand to every
affected scope.

Gates:

- **Pre-commit**: `shared/scripts/git-hooks/pre-commit` (install once via `yarn hooks:install`) — Prettier re-stages changed files, then runs the scoped gate for staged areas only (`gates:areas --staged`).
- **Pre-push**: `shared/scripts/git-hooks/pre-push` — scoped gates for the push diff; falls back to all scopes for shared/global edits.
- **Pre-build**: `prebuild` runs verify — a failing check means no new `dist` is generated.

Reports: everything in `reports/` is bundled into `dist/deploy-info/` by `shared/scripts/build/deploy-info.mjs` and rendered in the CMS Deploy Info tab.

## Test conventions

- **JavaScript on purpose** — test files stay decoupled from internal type churn and exercise the runtime surface exactly as a browser would. Do not migrate tests to TS.
- **Tokens, never literals** — assert/query/dispatch with tokens from `core/constants.js` / `cms/tokens.js`; test-only fixture values live in `shared/tests/fixtures/test-constants.js` (`TEST_TAGS`, `TEST_TEXT`, `TEST_PROJECTS`, `TEST_UA`, …).
- **`waitFor(fn)` over fixed sleeps** — `waitFor` (in `test-constants.js`) polls until truthy with a 15s budget. Fixed `setTimeout` waits flake under parallel-suite CPU contention; use `waitFor` for anything that resolves asynchronously.
- **Zero console output during tests** — `shared/tests/setup.js` replaces `console.warn/error/info/log/debug/trace` with no-ops: src routes diagnostics through `core/devlog.ts`, so assert them via `getDevLog()`/`clearDevLog()`, never via console spies.
- **Area aliases for imports** — test files import source through the jest `moduleNameMapper` aliases (`@core/…`, `@website/…`, `@cms/…`, `@earth/…`, `@docs/…`, `@/…` for the app shell, `@tests/…` for shared fixtures/infra, `@build/…` for shared/build tooling), never deep `../../../src/…` relatives. Tests-internal imports (fixtures, mocks) may also stay relative within the same module.
- **Coverage tails organization** — tail suites live in `tests/coverage/<domain>/<subdomain>/` mirroring the module's source tree (`core/component`, `core/store`, `components/home`, `components/carousel`, `canvas/{infra,loaders,widgets}`, `cms/{deploy,editors,facade}`, `routes/{pages,router,docs}`, `playground/{earth,space}`, `utils/{data,gpu,media,motion,perf,wasm}`), plus `app/`, `legacy-polyfills/`, `safari/`, and `sweep/` for genuinely cross-domain files — one file per describe, named after the module under test.
- **Avoid `jest.resetModules()` mid-file** after exercising a module — istanbul counters are per module instance; re-instantiation can discard recorded hits in the merged report. If a test must reset (polyfill/registration suites), put coverage-critical calls in a reset-free file.
- **`bootPromise`** — `shared/src/main.ts` exports `bootPromise = start()`; tests that boot the app must await it so lazy `import()` calls never execute in a torn-down Jest registry.
