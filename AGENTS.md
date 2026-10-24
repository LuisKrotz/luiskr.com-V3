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
    - Every module is its own repository with its own hooks — `yarn hooks:install` propagates the versioned hooks into each submodule. Commit/push **inside a module** runs only that module's gates (`tsc`, eslint, stylelint, jest + governance) and stamps `<module>/reports/gate-result.json`.
    - `pre-commit` stays fast: Prettier writes/re-stages changed files, then a scoped `tsc` — a module's own tsconfig inside a submodule, or `scope-gates.mjs areas --staged` at the root.
    - Root `pre-push` diffs the push range; bare gitlink bumps map to `link:<path>` entries that **validate the module's stored result** (sha must match the recorded gitlink) instead of re-running suites. Missing/stale stamps fall back to the full gate set — never skipped silently.
    - `yarn verify` is the complete prebuild gate: format check → console-scan → typecheck → eslint/stylelint → `links` stored-result validation (module suites run with coverage only when a stamp or coverage summary is absent) → per-file coverage gate → security scan. A failure prevents new `dist` output.
    - Lighthouse runs only after a successful build when explicitly requested with `yarn build --verify-lighthouse`; ordinary builds do not run Lighthouse.
    - Test coverage must be **100% on every file** for statements, branches, functions, and lines — per-module `jest.config.mjs` (shared preset) + `shared/scripts/verify/coverage-gate.mjs` per-file enforcement.
    - All scan reports land in `reports/` → bundled into `dist/deploy-info/` by `shared/scripts/build/deploy-info.mjs` → shown in the CMS "Build" tab.

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
    - `?debug=webgpuWidgets:active` opts into the WebGPU widget layer (render-worker `OffscreenCanvas` route → in-page fallback). The layer is OFF by default — `mountWebGpuWidget` returns null and the WebGL/CSS renderers stay authoritative — until the worker route is verified on real hardware.
    - All WebGL `getContext` calls must go through `core/utils/canvas/webgl-mode.ts` (`webglContext`) so the fallback param stays authoritative — never call `canvas.getContext('webgl…')` directly.
    - WebGPU widget mounts must all funnel through `core/utils/gpu/webgpu-widget.ts` (`mountWebGpuWidget`) so the kill switch and the worker route stay authoritative — never instantiate widget artifacts directly.

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

22. **Yarn + POSIX Bash Are the Toolchain Defaults**:
    - Yarn is the only package manager — `yarn install`, `yarn add`, `yarn remove`, `yarn <script>`; never `npm`/`npx`/`pnpm` in commands, scripts, hooks, CI, or docs. `yarn.lock` is the sole lockfile — never regenerate `package-lock.json`.
    - Dependency pinning uses the `resolutions` field (yarn 1.x mechanism) — `overrides` is npm-only and ignored by yarn.
    - Shell code must be POSIX-portable bash (`#!/usr/bin/env bash`) — git hooks and helper scripts must run identically on Windows (Git Bash), macOS, and Linux; never use zsh-only or GNU-only syntax (`print -r`, `${(s: :)…}`, `${arr[@]}`, `readlink -f` without fallback).
    - WSL must never be used — Windows commands run in Git Bash natively.
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

26. **Complete-Scope Delivery — "All Content" Means All Content**:
    - When the user requests a coverage scope ("all content", "every page", "all languages"), implement the FULL literal scope — never reduce it because the volume seems large; thousands of pages is a reason to build a generator, never a reason to skip pages.
    - Every public route must ship build-time-prerendered HTML that is fully readable without JavaScript — SEO crawlers and AI agents do not run the SPA. That includes: docs portal pages (files AND directory listings), project internas (all section text + every media figure), every media-modal deep link, every star-field body dossier, and home/about/contact/legal — in EVERY locale.
    - Prerendered pages carry the page's real body content inside `<div id="app">` (the SPA replaces it on mount via `replaceChildren`), translated title/description, canonical, hreflang alternates, and rich route-specific JSON-LD (Article, TechArticle, ImageObject, VideoObject, ItemList, BreadcrumbList).
    - New public content types must join the build-time emit pipeline (`shared/scripts/build/build-locale-pages.mjs` + `shared/scripts/build/generate-sitemap.js`) before the feature ships — runtime-only rendering of public content is a defect.

27. **Animation Frame Budget — 120Hz Mobile / 240Hz Desktop**:
    - Every animation/frame path must complete its synchronous work inside the frame-budget tokens (`core/tokens/motion/frame-budget.ts` → `FRAME_BUDGET.MOBILE_MS` ≈8.33ms, `FRAME_BUDGET.DESKTOP_MS` ≈4.16ms). Target: JS/CSS that skips Layout and Paint and goes straight to Composite.
    - Enforced by `shared/tests/governance/animation-frame-budget.test.js` (CMS exempt): scroll-blocking listeners (`pointermove`/`mousemove`/`wheel`/`touchmove`/`touchstart`/`scroll`) must register `{ passive: true }`; `pointermove` bindings must consume `event.getCoalescedEvents()`; every rAF callback is timed while components/views mount — over-budget sync work fails the gate.
    - Frame loops are zero-allocation: no objects/arrays/closures/template strings inside rAF ticks or per-event input handlers — preallocated scalars and pooled objects (raycasters, NDC vectors, scratch state); TypedArray/SoA layouts for bulk state; monomorphic signatures, no `delete`, no rest/`arguments`, `x | 0` int coercion in hot paths.
    - Rects/metrics are captured once per gesture/frame, never per pointer event. High-rate input stores scalars and schedules ONE rAF tick per frame; the heavy work (raycast, physics, picking) runs there.
    - Frame loops self-stop when hidden/idle (IntersectionObserver, prefs) and are cancelable on destroy. Batch CPU >1ms routes through the WASM pool (rule 20); canvas hot paths prefer `desynchronized:true`, `alpha:false`, and offscreen double-buffering.
    - Full engineering contract lives in the `perf-animation-frame` agent skill (`.agents/skills/perf-animation-frame/SKILL.md`).

28. **Adopted Stylesheets — Never Inline CSS**:
    - CSS rules are authored in `.scss` files and reach a root only through a compiled stylesheet. No JS string is a stylesheet — never hand-author CSS rule text in token/util files; JS only transports compiled `?inline` output.
    - `element.style.cssText = 'decl:val;decl:val'` multi-declaration payloads are forbidden, as is `setAttribute('style', …)` carrying rules. Sole exception: `core/jsx.ts`, the runtime that compiles the JSX `style` prop.
    - Document/light-DOM rules live in `core/sass/base/structure/` partials imported by `_structure.scss` (the global `<link>` sheet). Rules that must exist in EVERY shadow root are `?inline`-compiled into `BASE_HOST_STYLES` (`core/tokens/styles.ts`), which `BaseComponent._renderInitial` prepends to each component's adopted stylesheet — and to the `<style>`-node fallback on engines without constructable sheets. Component-scoped rules live in the component's own `styles.scss?inline`.
    - Document stylesheets never cross the shadow boundary — a document-level class rule silently does not apply to shadow-injected nodes; their rules must ride `BASE_HOST_STYLES` or the component sheet.
    - A helper that adopts a runtime sheet appends it: `root.adoptedStyleSheets = [...root.adoptedStyleSheets, sheet]` — never replace the array — and re-checks `.includes(sheet)` on every call (re-mounts re-assign the array and evict foreign sheets).
    - Dynamic value plumbing is not stylesheet delivery and stays legal: JSX `style={{…}}` props, `style.setProperty()`, and single-property writes driven by runtime state.
    - `display:none` is forbidden on accessibility/crawler content — it evicts the node from the accessibility tree; use the clipped-1px visually-hidden pattern (`_a11y.scss` `.sr-only`).
    - Full contract lives in the `adopted-stylesheets` agent skill (`.agents/skills/adopted-stylesheets/SKILL.md`); enforced by `shared/tests/governance/style-governance.test.js`.

29. **Chunk-Size Budgets — Split for Parallel Delivery**:
    - Emitted JS chunks are capped at 50 KiB minified; ~10–30 KiB per chunk is the preferred granularity — h2/h3 multiplexing makes that range the best trade between request overhead, compression context, and per-chunk parse cost. CSS files are capped at 32 KiB — stylesheets are atomic cascade units, so the cap guards growth rather than chasing a smaller number.
    - Splitting is configured in `vite.config.js` via `output.codeSplitting` (`maxSize` is in SOURCE bytes — terser lands minified ≈ ⅓ of source). Groups: `vendor-firebase`, `three`, `i18n-data`, `docs-data`, `vendor` (entriesAware), `app` catch-all. The legacy `ie` tier is exempt — ES5 engines cannot load module chunks.
    - Module-atomic artifacts that cannot be split (pre-bundled vendor dists like three.webgpu/@firebase, generated per-locale payload modules, virtual:docs-manifest) live in `chunk-budget-exceptions.json` with justification + review date — never blanket-exempt.
    - Enforced by `shared/scripts/verify/chunk-budget.mjs`, wired into `build-targets.mjs` before the locale-pages fan-out → `experiments/docs/reports/chunk-budget.json` → CMS "Build" tab.

30. **Done Means Build Green**:
    - Work is NOT finished until `yarn build` (which runs `yarn verify`) completes green in the current session — committed/pushed code with a failing verification pipeline is unfinished work, regardless of how clean the diff looks.
    - A red gate (coverage-gate, security-scan, typecheck, lint, format, test, console-scan, chunk-budget) is a work item, not a footnote: fix the root cause or add a justified `security-exceptions.json` / `chunk-budget-exceptions.json` entry, then re-run the full `yarn build` and confirm every gate passes before reporting completion.
    - "It passed earlier" or "the failure looks flaky" does not count — re-run and watch it go green. Fresh audit findings (new advisories published against pinned deps) are treated the same: resolve them before calling the task done.

31. **No Lazy Solutions — Never Take Shortcuts**:
    - Deliver the FULLY-REALIZED form of every request — never ship the cheap stand-in: a requested icon set means distinct designed glyphs per type (not one generic shape + a text label); a requested interaction means the real widget/behavior used elsewhere in the project (not a minimal approximation); a requested visual state means authored artwork for every state (not a single static form).
    - Reuse the project's established building blocks (canvas widgets, token classes, modals, motion primitives) instead of inventing weaker one-off substitutes — the codebase's patterns are the quality bar, not a suggestion.
    - If a shortcut is ever genuinely forced (time, missing dependency, platform limit), say so explicitly and flag the gap — never pass a stand-in off as the finished work.
    - "Good enough to pass tests" is not done: the result must look, behave, and read as designed work to the user, to crawlers, and to assistive tech.
