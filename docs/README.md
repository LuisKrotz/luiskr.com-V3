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

The repository is split into five top-level areas, each a self-contained
module with its own `package.json` export boundary, `tsconfig.json` and
`vite.config.js` (per-folder builds emit `*/dist/`). The root
`vite.config.js` still assembles the whole site, and
`scripts/verify/scope-gates.mjs` maps changed paths → affected areas so
hooks run only the checks that matter.

```
src/                     app shell only — everything else moved to areas
├── main.ts              site entry (referenced by index.html)
├── App.tsx              <app-shell>: store, router mount, locale bootstrap
├── app/                 app-shell modules (boot, data, input, modal, scroll, view)
├── modules.d.ts         ambient module declarations (virtual:*) — shared
│                        by every area's scoped tsconfig
├── globals.d.ts
└── registerServiceWorker.ts

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

Test and tooling folders mirror the same domain grouping:

```
tests/
├── fixtures/  __mocks__/  data/  transformers/   shared infra (setup.js, resolver.js)
├── core/      store/, component/, i18n/, browser/, jsx/, tokens/, platform/
├── components/  routes/{router,views}/  utils/{wasm,motion}/  cms/  app/  build/
├── coverage/  per-module tail suites — <domain>/<subdomain>/ mirroring
│   │          the area tree (core/, website/, cms/, experiments/, src/):
│   ├── core/{component,env,firebase,jsx,loader,schema,store,ui,utils}
│   ├── components/{carousel,dialogs,feedback,footer,home,media}
│   ├── canvas/{infra,loaders,widgets}   cms/{deploy,editors,facade}
│   ├── routes/{pages,router,docs}   playground/{earth,space}
│   ├── utils/{data,gpu,media,motion,perf,wasm}
│   └── app/  legacy-polyfills/  safari/  sweep/ (cross-domain only)
└── governance/  portability, axe, contrast-aaa, jsdoc, sass, style, lighthouse-config, …

scripts/
├── verify/    verify.mjs + scope-gates (per-area gate runner), console-scan,
│              coverage-gate, security-scan, coverage-gaps, uncov
├── build/     build-targets, build-locale-pages, build-wasm,
│              browser-loader, deploy-info, generate-sitemap (sitemap +
│              urllist include every /docs/* portal route)
├── docs/      gen-docs (JSDoc → docs/jsdocs, docs/api), sassdoc-lite
│              (secure in-repo SassDoc replacement), sassdoc-vars, codemod
├── i18n/      translation tooling (seed, extract, patch, upload)
├── codemod/   codemod-token-imports, codemod-devlog
├── git-hooks/ versioned pre-commit / pre-push — scope-aware (install via
│              install-hooks.sh)
└── media-convert/  CMS media pipeline

build/               shared build helpers consumed by vite configs
├── vite-lib.mjs     per-area library-build factory (used by all five
│                    area vite configs)
├── es-targets.mjs   ES tier table + browser targets (zero-dep leaf)
└── docs/            docs-portal pipeline: scan.mjs (manifest tree),
                     render.mjs (markdown/HTML/sanitize), redact.mjs

vendor/              hardened in-repo dependency replacements
├── braces/          brace expansion + nesting-depth cap (micromatch chain)
├── extract-zip/     dep-free ZIP reader, traversal/symlink-safe
└── sprintf-js/      sprintf with bounded width/precision (DoS-safe)
```

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

Scoped gates: `node scripts/verify/scope-gates.mjs run <scope…>` executes
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
yarn lint         # eslint src tests (zero warnings)
yarn stylelint    # stylelint across all area stylesheets
yarn format       # prettier --write across the repo
yarn format:check # prettier --check (CI gate)
yarn typecheck    # tsc --noEmit (root project, all areas)
yarn gates        # all scoped gates sequentially (per-area tsc, lint,
                  # stylelint, jest slice)
yarn gates:scope <area…>   # scoped gate — core|website|cms|earth|docs|app
yarn gates:areas --staged  # map staged paths → affected scopes (used by hooks)
yarn docs:api     # generated JSDoc docs → docs/api
yarn docs:jsdocs  # generated JSDoc docs → docs/jsdocs (build step)
yarn docs:typedoc # TypeDoc API reference → docs/typedoc
yarn docs:sassdoc # Sass token/mixin reference → docs/sassdoc (in-repo
                  # generator — sassdoc package removed for security)
yarn docs         # all four generators in sequence
yarn lighthouse   # Lighthouse CI assertions (100 everywhere except perf;
                  # cms/earth/docs excluded)
yarn deploy:info  # bundle reports/ → dist/deploy-info
```

`yarn deploy` exists but must **never** be run by an agent without an
explicit user instruction — see `AGENTS.md`.

## Testing note

All test files under `tests/` are intentionally written in **JavaScript**,
not TypeScript: they exercise the public runtime surface exactly as a
consumer (or browser) would, keeping tests decoupled from internal type
churn. Tests still import token constants — never raw app strings.

## License

[MPL-2.0](LICENSE) — the license file lives in this `docs/` folder.
