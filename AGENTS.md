# Project Rules & Persistent Memory

## Critical Rule: Zero Hardcoding Allowed Anywhere

Under NO circumstances may any hardcoded values be introduced into any file in this codebase:

1. **Zero Hardcoded Colors**:
   - Never use raw hex codes (`#ffffff`, `#262626`, `#0b0c10`, etc.).
   - Never use raw rgb/rgba functions with literal color channels (e.g. `rgba(200,200,200,0.15)`).
   - Never use fallback color values inside CSS variables (e.g. `var(--bg-dark, #262626)`).
   - All colors must strictly use SCSS tokens (`$color-*`, `$cms-*`) or root CSS custom properties (`var(--bg-primary)`, `var(--skel-bg-1)`, `var(--skel-bg-2)`, `var(--skel-bg-3)`).
   - **Exception**: CSS custom property declarations in `_structure.scss` may use `rgba(0,0,0,…)` / `rgba(255,255,255,…)` only inside the shadow token definitions (`--shadow-card-*`) because `to-rem()` is a compile-time SCSS function and cannot be embedded in a CSS var string.

2. **Zero Hardcoded Spacing & Dimensions**:
   - All spacing, margins, paddings, and layout dimensions must come from the Fibonacci token scale via `to-rem($space-*)` or `var(--space-*)`.
   - Never write inline dimension styles with raw numbers (e.g. `height: 180px;`, `width: 35%;`, `height: 1em;`).
   - CSS custom property _values_ in `_structure.scss` that contain lengths must use raw `rem` literals (e.g. `0.125rem`) because `to-rem()` is SCSS-only and is not valid inside a CSS var string.

3. **Zero Hardcoded Border Radii**:
   - Border radii must come from CSS tokens (`var(--radius-*)`, `to-rem($space-2xs)`).
   - Never use raw pixel (`border-radius: 4px`, `16px`) or raw rem (`border-radius: 0.25rem`) values.

4. **Zero Hardcoded Class Names (100% DRY)**:
   - All class names used in JSX/DOM must be imported from `CLASSES` in `core/constants.js`.
   - Base blocks (`_B_*`) must be declared once and composed without repeating string literals.
   - Any class that appears in more than one place must be moved to `CLASSES` and referenced via constant.

5. **Zero Hardcoded Strings in JS/JSX (100% DRY)**:
   - Every string literal that appears more than once anywhere in the codebase — class name, tag name, event name, route path, URL prefix, CMS key, attribute name, localStorage key, Firebase path prefix, query parameter, or data-attribute — MUST be declared once in `core/constants.js` and imported everywhere it is used.
   - Examples of what must live in `constants.js` (not as inline strings):
     - `'router-link-active'` → `CLASSES.ROUTER_LINK_ACTIVE`
     - `'/components/related'` → `PATHS.COMPONENTS_RELATED`
     - `'covers/'` → `PATHS.COVERS`
     - `'https://storage.googleapis.com/luiskr.com/public/_v3/'` → `URLS.CDN_BASE`
     - `'about-section'`, `'legal-footer'` → `CMS_KEYS.ABOUT_SECTION`, `CMS_KEYS.LEGAL_FOOTER`
     - `'decoding'`, `'loading'`, `'trigger'` → `ATTRS.DECODING`, `ATTRS.LOADING`, `ATTRS.TRIGGER`
     - All event names (e.g. `'cookieAction'`, `'resize'`) → `EVENTS.*`
   - **Test files (`<module>/tests/**/*.js`) follow the same rule**: tests must import all application string values from `core/constants.js` (`TAGS`, `CLASSES`, `ATTRS`, `EVENTS`, `MUTATIONS`, `PATHS`, `SELECTORS`, `IDS`, `STORAGE_KEYS`, `LOCALES`, `THEME`, `STRINGS`, `CSS_PROPS`, `URLS`, `MEDIA`, `TEXT`, `ROUTE_NAMES`, `TRANSLATION_KEYS`, `UI_KEYS`, `COMPONENT_KEYS`, `CMS_KEYS`, `KEYS`, `ANIMATION`, …) or CMS tokens from `cms/tokens.js` — never assert against, query, or dispatch with inline string literals when a token exists.
   - Test-only vocabulary (fixture element tags, sample project IDs/slugs, sample text, sample award names) must be declared once in `shared/tests/fixtures/test-constants.js` (`TEST_TAGS`, `TEST_TEXT`, `TEST_PROJECTS`, `TEST_AWARDS`) and imported from there — never repeated inline.
   - Strings that are legitimately not tokens — import paths, test `describe()`/`test()` names, Node API arguments (`'fs'`, `'path'`, `'utf-8'`), regex syntax fragments, and unique one-off fixture data — may remain literal.

6. **JSX Only (No HTML String Interpolation)**:
   - All components returning DOM structure must return native JSX elements using `h` and `Fragment` from `core/jsx.js`.
   - Never use template string interpolation (`` `<div class="${...}">` ``) or `innerHTML` for component templates.

7. **Zero `!important`**:
   - `!important` is strictly forbidden in any stylesheet, inline style, or runtime script.

8. **All SASS Files Must Use CSS Variables — Never SCSS Variables for Runtime Values**:
   - SCSS variables (`$color-*`, `$space-*`) are compile-time constants and must ONLY be used as the source-of-truth to define CSS custom properties in `_structure.scss`.
   - All component SCSS files (e.g. `home-mosaic.scss`, `carousel.scss`, etc.) must consume CSS custom properties (`var(--bg-primary)`, `var(--shadow-card)`, etc.) — never raw `$color-*` or `$space-*` SCSS variables directly.
   - Only `_structure.scss`, `_variables.scss`, `_mixins.scss`, and `_placeholders.scss` may reference `$` SCSS variables.
   - Violation: `color: $color-white` in a component stylesheet. Fix: `color: var(--color-white-raw)` or a themed token.

9. **DRY CSS — No Repeated Selectors or Pattern Strings**:
   - Any CSS class or selector that appears more than once in SCSS must use `@extend` or be composed via BEM `&--modifier` from a single root block.
   - Base block strings (e.g. `expand-modal`, `modal-media`, `internal-footer`) must be defined once using `$_B_*` SCSS variables and composed everywhere else.
   - Pattern: define `$_B_MODAL: 'modal'`, then use `#{$_B_MODAL}-open`, `#{$_B_MODAL}-close`, etc.
   - Never repeat a block prefix string more than once in any `.scss` file.

10. **Logic Blocks Separated by Blank Lines**:
    - Every distinct logical step within a function must be separated from adjacent steps by exactly one blank line.
    - Correct:
      ```js
      const dbpath = `${lang?.database || 'translations/'}${locale}/components`

      fetchFirebaseDb(dbpath)
      ```
    - Incorrect (no blank line between assignment and call):
      ```js
      const dbpath = `${lang?.database || 'translations/'}${locale}/components`
      fetchFirebaseDb(dbpath)
      ```
    - This applies to: variable declarations followed by function calls, conditionals followed by assignments, loops followed by returns, and any other logical boundary.

11. **Continuous Automated Governance**:
    - `shared/tests/governance/style-governance.test.js` must validate and pass all these rules automatically on every test run.
    - When a new rule is added here, a corresponding automated check must be added to `style-governance.test.js`.

12. **Zero Console Calls**:
    - Every `console.*` call is forbidden anywhere in `shared/src/`, `core/`, `website/`, `cms/`, `experiments/` — no exceptions.
    - All diagnostics route through `core/devlog.ts` (`devWarn` / `devError` / `devInfo`), which buffers entries in a capped ring buffer; inspect in devtools via `__lkDevLog()` or assert in tests via `getDevLog()`.
    - Enforced by `shared/scripts/verify/console-scan.mjs` → `reports/console-scan.json`; any callsite is a violation that fails the gate.

13. **Security Scans Gate the Build**:
    - `shared/scripts/verify/security-scan.mjs` runs `snyk test` when `SNYK_TOKEN` is set, falling back to `yarn audit` (same advisory data). High/critical vulnerabilities fail the gate; unfixable dev-only risks live in `security-exceptions.json` with justification + review date — never blanket-suppress.
    - `shared/tests/governance/axe-scan.test.js` runs axe-core (WCAG A/AA/AAA rule tags) on real mounted surfaces — violations of moderate impact or higher fail the suite; `shared/tests/governance/contrast-aaa.test.js` enforces computed WCAG AAA contrast ratios on the compiled token sheet (7:1 text / 3:1 UI) since happy-dom cannot measure paint contrast.

14. **Verification Pipeline (commit → push → build)**:
    - `pre-commit` stays fast: Prettier writes/re-stages changed files, then `yarn typecheck` blocks TypeScript errors.
    - `pre-push` runs `yarn test` in parallel without coverage instrumentation.
    - `yarn verify` is the complete prebuild gate: format check → console-scan → typecheck → eslint/stylelint → Jest with coverage (incl. axe scan) → per-file coverage gate → security scan. A failure prevents new `dist` output.
    - Lighthouse runs only after a successful build when explicitly requested with `yarn build --verify-lighthouse`; ordinary builds do not run Lighthouse.
    - Test coverage must be **100% on every file** for statements, branches, functions, and lines — per-module `jest.config.mjs` (shared preset) + `shared/scripts/verify/coverage-gate.mjs` per-file enforcement.
    - All scan reports land in `reports/` → bundled into `dist/deploy-info/` by `shared/scripts/build/deploy-info.mjs` → shown in the CMS "Deploy Info" tab.

15. **Component Self-Containment (Portability)**:
    - A component folder must be copyable (JS/TS + SCSS) into another project and work with different data.
    - No component may import from another component's folder; shared helpers live in `core/utils/` or `core/`.
    - Components may only import from shared roots: `core`, `core/utils`, `core/sass`, `core/firebase`, plus the `router`/`types` infra singletons.
    - Never import from `website/views` (view logic), `cms`, or `shared/src/app` inside `website/components`.
    - Enforced by `shared/tests/governance/component-portability.test.js`.

16. **Deployment Prohibition**:
    - Agents must NEVER run `yarn deploy`, `firebase deploy`, or any deployment command without an explicit, in-conversation user instruction for that specific deploy.
    - Verification, builds, and tests never include a deploy step.

17. **Tests Are JavaScript On Purpose**:
    - All files under each module's `tests/` are written in JavaScript by design — they exercise the runtime surface as a consumer/browser would and stay decoupled from internal type churn.
    - Do not migrate tests to TypeScript; do still enforce token imports and the zero-hardcoding rule in tests.

18. **Debug URL Parameters**:
    - `?debug=sendNotificationTest` mounts a real `<site-toast>` test notification.
    - `?debug=webGLMode:active` forces normal WebGL probing; `?debug=webGLMode:fallback` forces every WebGL acquisition to fail → the CSS/2D fallback path.
    - All WebGL `getContext` calls must go through `core/utils/canvas/webgl-mode.ts` (`webglContext`) so the fallback param stays authoritative — never call `canvas.getContext('webgl…')` directly.

19. **Coverage Tails Organization**:
    - Coverage-tail tests live under `<module>/tests/coverage/<domain>/<subdomain>/` mirroring that module's source tree — `core/{component,env,firebase,jsx,loader,schema,store,ui,utils}`, `components/{carousel,dialogs,feedback,footer,home,media}`, `canvas/{infra,loaders,widgets}`, `cms/{deploy,editors,facade}`, `routes/{pages,router}`, `playground/{earth,space}`, `utils/{data,gpu,media,motion,perf,wasm}`, plus `app/`, `legacy-polyfills/`, `safari/`, and `sweep/` (cross-domain grab-bags only) — one file per describe, named after the module under test.
    - Never call `jest.resetModules()` mid-file after exercising a module: istanbul counters are per module instance, and re-instantiation discards previously recorded hits in the merged report. Reset-free tails files exist for post-reset coverage.

20. **Recursion Preferred for Self-Similar Traversal & Compute Placement**:
    - When logic walks a self-similar structure (nested children, filesystem trees, token groups, DOM subtrees), write a recursive function — do NOT hand-roll stack/queue emulation (`const stack=[...]; while(stack.length){ pop/push }`).
    - Recursion must be total: every path reaches a base case; graph-shaped input guards cycles with a visited set. Generators (`yield*`) are the preferred recursive shape for streaming traversal (see `cms/media-convert/files.ts` `traverseEntry`).
    - Bounded dismissal/drain loops (`while (list.length > CAP)`) and async pagination (`readEntries` batches) are legitimately iterative — annotate why when the shape could read as stack emulation.
    - **Compute placement for performance**: per-frame canvas/WebGL math lives in GPU shaders or local synchronous math — never `await`ed per frame. Batch CPU work (mosaic layout, spring physics, text timing, media hashing, image decode) routes through `core/utils/wasm/wasm-pool.ts` worker dispatch with JS fallbacks. three.js scenes likewise keep per-frame work on the GPU (WebGPU/GLSL/TSL); only non-per-frame batch work is a wasm-pool candidate.
    - Checked by `shared/tests/governance/style-governance.test.js` — flags manual stack-emulation traversal patterns.

21. **JSDoc Required on All Declarations**:
    - Every exported declaration (function, class, const, type, interface) must carry a JSDoc block (`/** ... */`) stating its purpose, what it does, and its effect — with `@param`/`@returns` tags where the signature has them.
    - Internal top-level helpers and class members follow the same rule — purpose + effect, not a name restatement.
    - Calculations, WebGL draw/calc code, and three.js plumbing get _detailed_ multi-line explanations (the math, the units, why the constants are what they are).
    - Every `.scss` file opens with a header comment block explaining which UI surface/component it styles and whether it is shared.
    - Enforced by `shared/tests/governance/jsdoc-coverage.test.js`.

22. **Yarn + Zsh Are the Toolchain Defaults**:
    - Yarn is the only package manager — `yarn install`, `yarn add`, `yarn remove`, `yarn <script>`; never `npm`/`npx`/`pnpm` in commands, scripts, hooks, CI, or docs. `yarn.lock` is the sole lockfile — never regenerate `package-lock.json`.
    - Dependency pinning uses the `resolutions` field (yarn 1.x mechanism) — `overrides` is npm-only and ignored by yarn.
    - Zsh is the default shell — terminal commands, git hooks, and helper scripts run under zsh (`#!/usr/bin/env zsh`); do not introduce bash-only syntax.
    - Mirrors `.agents/rules/default-package-manager.md` and `.agents/rules/default-terminal.md`.

23. **No Automated Codemods or Bulk-Rewrite Scripts**:
    - Agents must NEVER write or run automated codemods, AST rewriters, or scripted bulk-refactors that modify source/test files en masse (e.g. splitting files, rewriting imports, pruning code by name matching).
    - Every change to source or tests is made file-by-file with the edit tool, reviewed in context — no exception for "it would take too long"; break the work into batches instead.
    - One-off data transforms that never touch the repo (e.g. generating a report) are fine; anything that writes into `shared/`, `core/`, `website/`, `cms/`, `experiments/`, or any `tests/` tree is forbidden.
    - No `codemod/` or `codemods/` directories, files, or script entries may exist in the repository — enforced by `shared/tests/governance/style-governance.test.js`.

24. **Fail-Fast Test Iteration**:
    - When iterating on a failing suite, always run Jest with `--bail` so the run stops at the first failed suite — never burn a full 100+ suite run to discover one failure.
    - Escalate to the complete suite only after the focused/bail run is green.

25. **Process Hygiene — No Leaked Children**:
    - Headless Chrome/puppeteer, dev servers (vite), Jest workers, and any watch/batch jobs MUST be fully reaped after use — leaked zombie processes have filled the swap partition and killed the session.
    - Browser automation scripts must wrap usage in `try/finally` (`await browser.close()`, then `browser.process()?.kill('SIGKILL')` as backstop), launch with `--no-zygote --single-process --disable-dev-shm-usage`, and carry a hard self-terminating timeout.
    - Kill dev servers you started when done, and verify with `ps` that no chrome/jest/vite processes survive.
