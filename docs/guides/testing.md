# Testing

## Jest (`npm test` — run via the package script, not bare `npx jest`)

68 suites, ~3400 tests. The tree mirrors `src/` — `tests/components/`
splits into the same domains (`canvas/`, `carousel/`, `media/`, `nav/`,
`dialogs/`, `feedback/`, `home/`); cross-component suites stay at the root.
Source-scan tests read real files via `readJs`/`readJsTree` entries in
`tests/fixtures/test-constants.js`, so moving a file means updating that
path map (plus the few `readFileSync` paths).

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

Test files follow the same zero-hardcoding rule as `src/` (AGENTS.md rule 5,
enforced by style-governance Rule 11):

- Any string that exists in the token layer (`src/core/tokens/**`, surfaced
  through `src/core/constants.ts` as `TAGS`, `CLASSES`,
  `ATTRS`, `EVENTS`, `MUTATIONS`, `PATHS`, `SELECTORS`, `IDS`, `STORAGE_KEYS`,
  `LOCALES`, `THEME`, `STRINGS`, `CSS_PROPS`, `URLS`, `MEDIA`, `TEXT`,
  `ROUTE_NAMES`, `TRANSLATION_KEYS`, `UI_KEYS`, `COMPONENT_KEYS`, `CMS_KEYS`,
  `KEYS`, `ANIMATION`, …) or in `src/cms/tokens.ts` must be imported and
  referenced — never written as an inline literal in `describe`/`test` bodies,
  `expect()` assertions, `querySelector`, `setAttribute`, `store.commit`, or
  event dispatch.
- Test-only vocabulary (fixture element tags, sample project IDs/slugs,
  sample text, sample award names) lives once in
  `tests/fixtures/test-constants.js` (`TEST_TAGS`, `TEST_TEXT`,
  `TEST_PROJECTS`, `TEST_AWARDS`) — import from there.
- Exempt: import paths, `describe`/`test` names, Node API args (`'fs'`,
  `'utf-8'`), regex syntax fragments, one-off fixture data.
- `tests/constants.test.js` and the fixture file itself are exempt from the
  scan — they define/verify the token values.

## Adding a route/component checklist

1. Component under its domain (`components/<domain>/`, `cms/<feature>/`,
   `playground/`) — facade at the folder root, modules in a `<name>/`
   subfolder.
2. Route view under `<domain>/routes/`; register in `routes/router.ts`.
3. `readJs`/`readScss` entries in `tests/fixtures/test-constants.js` if
   governance applies.
4. Translation keys into `database.json` for **all 16 locales** — run
   `scripts/i18n-audit.py`.
5. No new string literals twice — extend the leaf group in `core/tokens/`.
6. Governance suite still green: `npm test && npm run lint`.

## Lighthouse

Run against `vite preview` (not dev). Scores at last full pass:
home desktop 98 / a11y 100 / BP 100 / SEO 100; mobile perf is gated by
missing responsive image variants on the CDN (see build.md). Delete all
report artifacts (`lighthouse-reports/`, `.lighthouseci/`, stray `*.json`)
after reading — repo rule.

## Coverage

`npm run test:coverage` runs Jest with instrumentation and writes
`coverage/` (html + json-summary). The summary is packaged into
`dist/deploy-info/` by `npm run deploy:info` and shown in the CMS
Deploy Info tab. `coverage/` is gitignored.

## Verification pipeline

`npm run verify` is the single quality gate — it runs, in order:

1. `scripts/verify/console-scan.mjs` — fails on forbidden `console.log/debug/trace/table/group` in all `src/**/*.ts|tsx|js`; report → `reports/console-scan.json`
2. `npx eslint src tests` — zero errors and warnings
3. `jest --coverage` — full suite including `tests/governance/axe-scan.test.js` (axe-core WCAG A+AA+AAA rule tags → `reports/axe-report.json`; violations of moderate impact or higher fail — matching Lighthouse's binary a11y gate) and `tests/governance/contrast-aaa.test.js` (compiles the token sheet and enforces real WCAG AAA contrast ratios — 7:1 text, 3:1 UI/focus — since happy-dom cannot evaluate paint contrast and axe reports those checks as `incomplete`)
4. `scripts/verify/coverage-gate.mjs` — per-file **100%** statements/branches/functions/lines enforcement (jest.config.js enforces the same globally)
5. `scripts/verify/security-scan.mjs` — `snyk test` when `SNYK_TOKEN` is set, else `npm audit`; high/critical vulnerabilities fail unless listed in `security-exceptions.json` (dev-only, requires justification + review date); report → `reports/snyk-report.json`

Gates:

- **Pre-commit**: `.git/hooks/pre-commit` (install once via `bash scripts/install-hooks.sh`) runs the same verify.
- **Pre-build**: `prebuild` runs verify — a failing check means no new `dist` is generated.

Reports: everything in `reports/` is bundled into `dist/deploy-info/` by `scripts/build/deploy-info.mjs` and rendered in the CMS Deploy Info tab.

## Test conventions

- **JavaScript on purpose** — test files stay decoupled from internal type churn and exercise the runtime surface exactly as a browser would. Do not migrate tests to TS.
- **Tokens, never literals** — assert/query/dispatch with tokens from `src/core/constants.js` / `src/cms/tokens.js`; test-only fixture values live in `tests/fixtures/test-constants.js` (`TEST_TAGS`, `TEST_TEXT`, `TEST_PROJECTS`, `TEST_UA`, …).
- **`waitFor(fn)` over fixed sleeps** — `waitFor` (in `test-constants.js`) polls until truthy with a 15s budget. Fixed `setTimeout` waits flake under parallel-suite CPU contention; use `waitFor` for anything that resolves asynchronously.
- **Expected console noise is filtered** — `tests/setup.js` wraps `console.warn/error/info` and drops messages matching `TEST_NOISE` (documented in `test-constants.js` — Firebase offline writes, engine teardown races, deliberate warn-path exercises). Anything else still prints and must be investigated — test output stays at zero warnings/errors.
- **Coverage tails organization** — tail suites live in `tests/coverage/<domain>/<subdomain>/` mirroring the `src/` tree (`core/component`, `core/store`, `components/home`, `components/carousel`, `canvas/{infra,loaders,widgets}`, `cms/{deploy,editors,facade}`, `routes/{pages,router}`, `playground/{earth,space}`, `utils/{data,gpu,media,motion,perf,wasm}`), plus `app/`, `legacy-polyfills/`, `safari/`, and `sweep/` for genuinely cross-domain files — one file per describe, named after the module under test.
- **Avoid `jest.resetModules()` mid-file** after exercising a module — istanbul counters are per module instance; re-instantiation can discard recorded hits in the merged report. If a test must reset (polyfill/registration suites), put coverage-critical calls in a reset-free file.
- **`bootPromise`** — `src/main.ts` exports `bootPromise = start()`; tests that boot the app must await it so lazy `import()` calls never execute in a torn-down Jest registry.
