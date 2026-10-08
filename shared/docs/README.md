# luiskr.com V3 — Documentation

Personal portfolio of Luis Krötz. Strict TypeScript, custom elements with
Shadow DOM, a custom JSX runtime, Firebase Realtime Database as CMS backend,
Three.js WebGPU/WebGL visuals, Vite (rolldown) build.

## Reading map

| Document                                              | Covers                                                                   |
| ----------------------------------------------------- | ------------------------------------------------------------------------ |
| [architecture.md](architecture/architecture.md)       | Repository layout, module ownership, entry points, bundle separation     |
| [routing.md](architecture/routing.md)                 | Hash-free SPA router, locale prefixes, route slugs, dynamic view loading |
| [translations-i18n.md](guides/translations-i18n.md)   | Translation DB schema, stale-while-revalidate, fallback chain, locales   |
| [website.md](architecture/website.md)                 | Public site shell, components, Shadow DOM styling, skeletons, dialogs    |
| [playground.md](architecture/playground.md)           | Earth Playground view, WebGPU scene, loader contract, controls           |
| [webgl-canvas.md](architecture/webgl-canvas.md)       | Shared WebGL/canvas utilities, context pool, lifecycle, CSS fallbacks    |
| [cms.md](architecture/cms.md)                         | CMS bundle, authentication, editors, Firebase writes, media conventions  |
| [data-model.md](architecture/data-model.md)           | Firebase `translations/` tree, node shapes, invariants                   |
| [styling-governance.md](guides/styling-governance.md) | Sass layers, design tokens, `AGENTS.md` rules enforced by tests          |
| [build.md](guides/build.md)                           | Vite config, snapshot plugin, compat bundle, terser pitfalls             |
| [testing.md](guides/testing.md)                       | Jest suites, governance tests, Lighthouse workflow                       |
| [api/](api/README.md)                                 | Generated per-file docs from JSDoc — `yarn docs:api`                     |
| [jsdocs/](jsdocs/)                                    | Generated JSDoc site — `yarn docs:jsdocs` (also runs in `yarn build`)    |
| [typedoc/](typedoc/)                                  | TypeDoc API reference (TS/TSX) — `yarn docs:typedoc`                     |
| [sassdoc/](sassdoc/)                                  | SassDoc token/mixin reference (`///` comments) — `yarn docs:sassdoc`     |

## One-paragraph mental model

The site is a single custom-element shell (`<app-shell>` → `App.tsx`) that owns a
router, a store, and a translation layer. Every view and component is a
`BaseComponent` subclass that renders JSX into a Shadow Root with an inlined SCSS
stylesheet. All user-facing copy lives in Firebase (`translations/<locale>/…`)
and is also baked into the bundle as build-time snapshot chunks, so first paint
is instant and the network copy only revalidates. The CMS is a **separate entry
point** (`cms/main.ts`) with its own route views, editor components, tokens
and stylesheet — it shares `core` primitives but nothing from `website/components` or `website/views`.

## Source tree

The repository is split into workspace modules (NOT git submodules — plain
folders), each a self-contained module with its own `package.json` export
boundary, `tsconfig.json`, `vite.config.js`, `jest.config.mjs` and `tests/`
(per-folder builds emit `*/dist/`). The root `vite.config.js` still assembles
the whole site, `shared/scripts/verify/scope-gates.mjs` maps changed paths →
affected areas so hooks run only the checks that matter, and
`shared/scripts/modules.mjs` discovers the module registry so scaffolded
experiments self-register for tests + coverage.

```
shared/                  @luiskr/shared — app shell + cross-module tooling
├── src/                 app shell only — everything else moved to modules
│   ├── main.ts          site entry (referenced by index.html)
│   ├── App.tsx          <app-shell>: store, router mount, locale bootstrap
│   ├── app/             app-shell modules (boot, data, input, modal, scroll, view)
│   ├── modules.d.ts     ambient module declarations (virtual:*) — shared
│   │                    by every module's scoped tsconfig
│   ├── globals.d.ts
│   └── registerServiceWorker.ts
├── tests/               shared test infra + shell/governance suites
│   ├── fixtures/  __mocks__/  transformers/  jest.preset.mjs  setup.js
│   ├── app/{shell,entry-points}/  governance/  coverage/{app,sweep}/
├── scripts/             build, verify, docs, i18n, git-hooks, test runners,
│   │                    scaffold/ (new-experiment), media-convert/
│   └── modules.mjs      module registry — platform modules are fixed,
│                        experiments/<name>/ self-register via jest.config.mjs
├── build/               shared build helpers consumed by vite configs
│   ├── vite-lib.mjs     per-module library-build factory
│   ├── es-targets.mjs   ES tier table + browser targets (zero-dep leaf)
│   └── docs/            docs-portal pipeline: scan/render/redact
└── docs/                this documentation tree (typedoc/sassdoc/jsdocs/api
                         generated outputs + authored guides/architecture)

core/                    @luiskr/core — shared engine, no UI opinions
├── Component.ts         BaseComponent (shadow root, styles, lifecycle, skeletons)
├── jsx.ts               h() / Fragment runtime
├── store.ts + store/    pub/sub store facade + state/mutations/getters
├── constants.ts         barrel re-exporting the token layer
├── i18n.ts + locale/    VALID_LANGS, snapshots, ui-text, lang-slugs leaf
├── firebase.ts          Firebase app + auth/db handles (shared)
├── router/              parse-path / navigate / router / types
├── tokens/              granular token groups (attrs/, classes/, strings/, …)
├── utils/               dom, schema.org (JSON-LD + microdata), string,
│   │                    aspect + domain services (canvas/, data/, gpu/,
│   │                    media/, motion/, perf/, wasm/), notify.ts
├── browser/  debug/     UA table + detection, devlog, predictive-loader
├── safari/              Safari patch modules
├── legacy-polyfills/    in-bundle shims + per-group polyfill entries
├── sass/                shared style layer
│   ├── base/            tokens: variables, mixins, fonts, placeholders,
│   │                    structure (CSS custom properties live here)
│   └── components/      per-component shadow styles by domain
│                        (carousel/, dialogs/, feedback/, home/, internals/,
│                        media/, safari/, shell/), consumed via ?inline
├── index.ts             public barrel — the @luiskr/core export surface
├── vite.config.js       library build → core/dist/ (ESM)
└── tsconfig.json        scoped compile for `yarn scope:core`

website/                 @luiskr/website — public site views + components
├── views/               one self-contained folder per page view
│   ├── home/            Home.tsx + home.scss + {children,data,render,…}
│   ├── project/         Project.tsx + {carousels,data,layout,modal*,…}
│   ├── legal/           Legal.tsx + legal.scss (privacy/GDPR/terms)
│   └── not-found/       NotFound.tsx + not-found.scss
├── components/          public components by domain — facade + modules
│   ├── nav/             AppNav.tsx + flag/menu/render/scroll/handlers
│   ├── home/            HomeMosaic, AwardsMentions, About, Contact
│   ├── carousel/  media/  dialogs/  portfolio/  feedback/  legal/
├── index.ts             public barrel — the @luiskr/website export surface
├── vite.config.js       library build → website/dist/
└── tsconfig.json

cms/                     @luiskr/cms — isolated CMS, ESNext-only output
│                        (no Safari legacy build, no a11y/Lighthouse gates)
├── main.ts + index.html CMS entry + shell document
├── routes/              AdminLogin, CmsDashboard
├── about/  deploy-info/  footer/  lang/  media-convert/
│   playground-editor/  portfolio/  projects/   → one folder per editor
├── dev/                 firebase-mock (offline dev)
├── tokens.ts + tokens/  CMS-only constants by domain
├── sass/cms.scss        CMS stylesheet
├── index.ts             public barrel
├── vite.config.js       library build → cms/dist/ (ESNext format only)
└── tsconfig.json

experiments/             isolated experimental surfaces — never imported
│                        by core/website/cms
├── earth-playground/    @luiskr/earth-playground — Earth WebGPU playground
│   ├── SpacePlayground.tsx    the route view facade
│   ├── space/           panel: boot, controls, i18n, wiring
│   ├── earth-background.ts    EarthBackground facade (Three.js WebGPU)
│   ├── earth/           engine — setup/, scene/, runtime/, consts, settings
│   └── vite.config.js + tsconfig.json + index.ts
└── docs/                @luiskr/docs — /docs portal (English-only)
    ├── Docs.tsx + render.tsx    view facade + JSX template
    ├── manifest.ts              virtual:docs-manifest access + path resolve
    ├── arch-scene.ts            three.js architecture graph backdrop
    ├── gl-strip.ts              WebGL strip canvas (CSS fallback class)
    ├── coverage-nav.ts          istanbul report keyboard nav (n/j/b/p/k)
    ├── mermaid.ts               themed mermaid diagram renderer
    ├── copy-guard.ts + telemetry.ts   source-page copy protection
    └── vite.config.js + tsconfig.json + index.ts
```

Every module owns its test tree (`<module>/tests/`), grouped by domain —
no flat test directories. `shared/tests/` additionally holds the infra all
module configs consume (jest.preset.mjs `makeConfig`, fixtures, mocks,
transformers, resolver) via the `@tests/` alias:

```
shared/tests/          infra + app-shell/governance suites
├── fixtures/ __mocks__/ transformers/   setup.js, resolver.js, preset
├── app/{shell,entry-points}/   governance/   coverage/{app,sweep}/
core/tests/            unit/{platform,…}  utils/{deep-coverage,misc}
│   coverage/{canvas,router,utils,safari,legacy-polyfills}
website/tests/         components/{nav/{modals,…},carousel,media,…}
│   routes/{views,deep-coverage}   coverage/{components,pages}
cms/tests/             components/  editors/  routes/  deep-coverage/
experiments/<name>/tests/   domain folders + coverage/ tails
```

Coverage tails everywhere live under `tests/coverage/<domain>/<subdomain>/`
mirroring the source tree — one file per describe. Each module runs via
`yarn test <name>` (run-modules.mjs discovers modules dynamically);
`--coverage` writes raw maps per module, `merge-coverage.mjs` unions them
cross-module, and `coverage-gate.mjs` enforces 100% per file on the merged
per-module reports.

shared/local-modules/ hardened in-repo dependency replacements (publish-ready
│ npm packages — own package.json, MIT LICENSE, README
│ documenting each fix, isolated node:test suites)
├── braces/ brace expansion + nesting-depth cap (micromatch chain)
├── extract-zip/ dep-free ZIP reader, traversal/symlink-safe
└── sprintf-js/ sprintf with bounded width/precision (DoS-safe)

````

Module convention: a decomposed component keeps a **facade** at its feature
folder root (`Related.tsx`, `flag-webgl.ts`) holding state, public/test-visible
methods and element registration; behavior lives in same-named subfolder
modules with clean names (`related/render.tsx`, `flag/anim.ts`). Facade methods
delegate so test spies keep intercepting the original surface.

Ownership rules: **`core/` imports nothing from `website/`, `cms/` or
`experiments/`**; `website/` imports from `core/` only; `cms/` imports from
`core/` only (never website); `experiments/` may import `core/` but is
imported by nothing except the app shell's lazy route loader. Cross-area
imports use the path aliases (`@core/…`, `@website/…`, `@cms/…`, `@earth/…`,
`@docs/…`) — plain `node` build scripts use relative paths against the
zero-dependency leaf modules (`core/locale/lang-slugs.ts`,
`core/browser/browsers.ts`) since aliases only resolve under vite/jest.

Scoped gates: `node shared/scripts/verify/scope-gates.mjs run <scope…>` executes
typecheck + eslint + stylelint + the matching Jest slice for `app`, `core`,
`website`, `cms`, `earth` or `docs`; `run --all` covers every area
sequentially (never in parallel — memory), and `areas --staged` maps
staged paths to scopes for the hooks. CMS skips the axe scan; `earth` and
`docs` are excluded from Lighthouse performance assertions.

## Setup & commands

```bash
yarn install          # install dependencies
yarn hooks:install # install pre-commit/pre-push gates (prettier + scoped verify)
yarn dev          # dev server — public site (index.html)
yarn dev:cms      # dev server with the CMS Firebase mock (CMS_MOCK=1)
yarn verify       # full gate: console-scan → typecheck → eslint →
                     # stylelint → jest coverage (incl. axe) → coverage-gate
                     # → security-scan
yarn build        # verify → multi-tier build → deploy-info → docs/jsdocs
                  # emits .map sourcemaps for JS (esbuild→terser chain) and
                  # CSS (sass→lightningcss inputSourceMap chain)
yarn test             # jest (no coverage) — RAM-sized worker pool
                      # (1 worker per ~2GiB, JEST_MAX_WORKERS overrides)
yarn test:coverage # jest + coverage (per-file 100% gate via coverage-gate);
                   # the worker cap keeps instrumented heaps inside RAM
yarn lint         # eslint across shared core website cms experiments (zero warnings)
yarn stylelint    # stylelint across all area stylesheets
yarn format       # prettier --write across the repo
yarn format:check # prettier --check (CI gate)
yarn typecheck    # tsc --noEmit (root project, all areas)
yarn gates        # all scoped gates sequentially (per-area tsc, lint,
                  # stylelint, jest slice)
yarn gates:scope <area…>   # scoped gate — core|website|cms|earth|docs|app
yarn gates:areas --staged  # map staged paths → affected scopes (used by hooks)
yarn docs:api     # generated JSDoc docs → shared/docs/api
yarn docs:jsdocs  # generated JSDoc docs → shared/docs/jsdocs (build step)
yarn docs:typedoc # TypeDoc API reference → shared/docs/typedoc
yarn docs:sassdoc # Sass token/mixin reference → shared/docs/sassdoc (in-repo
                  # generator — sassdoc package removed for security)
yarn docs         # all four generators in sequence
yarn lighthouse   # Lighthouse CI assertions (100 everywhere except perf;
                  # cms/earth/docs excluded)
yarn deploy:info  # bundle reports/ → dist/deploy-info
````

`yarn deploy` exists but must **never** be run by an agent without an
explicit user instruction — see `AGENTS.md`.

## Testing note

All test files under each module's `tests/` are intentionally written in **JavaScript**,
not TypeScript: they exercise the public runtime surface exactly as a
consumer (or browser) would, keeping tests decoupled from internal type
churn. Tests still import token constants — never raw app strings.

## License

[MPL-2.0](LICENSE) — the license file lives in this `docs/` folder.
