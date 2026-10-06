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
| [api/](api/README.md)                                 | Generated per-file docs from JSDoc — `npm run docs:api`                  |

## One-paragraph mental model

The site is a single custom-element shell (`<app-shell>` → `App.tsx`) that owns a
router, a store, and a translation layer. Every view and component is a
`BaseComponent` subclass that renders JSX into a Shadow Root with an inlined SCSS
stylesheet. All user-facing copy lives in Firebase (`translations/<locale>/…`)
and is also baked into the bundle as build-time snapshot chunks, so first paint
is instant and the network copy only revalidates. The CMS is a **separate entry
point** (`src/cms/main.ts`) with its own route views, editor components, tokens
and stylesheet — it shares `src/core` primitives but nothing from `src/components` or `src/routes`.

## Source tree

```
src/
├── main.ts              site entry (referenced by index.html)
├── App.tsx              <app-shell>: store, router mount, locale bootstrap
│   └── app/             app-shell modules (boot, data, input, modal, scroll, view)
├── firebase.ts          Firebase app + auth/db handles (shared)
├── core/                shared engine — no UI opinions
│   ├── Component.ts     BaseComponent (shadow root, styles, lifecycle, skeletons)
│   ├── jsx.ts           h() / Fragment runtime
│   ├── store.ts         pub/sub store facade
│   │   └── store/       state, mutations/, getters domain modules
│   ├── constants.ts     barrel re-exporting the token layer
│   ├── i18n.ts          VALID_LANGS, LANG_OPTIONS, detectLangFromPath, routeSlugs
│   ├── locale/          fallback snapshot, ui-text, lang-slugs data leaf
│   ├── tokens/          granular token groups (attrs/, classes/, strings/, …)
│   ├── utils/           dom, schema.org, string, aspect helpers
│   └── predictive-loader.ts
├── routes/              router.ts + parse-path/navigate/types (router infra)
│   └── views/           one self-contained folder per page view
│       ├── home/        Home.tsx + home.scss + {children,data,render,scroll,types}
│       ├── project/     Project.tsx + {carousels,data,layout,modal*,render,types}
│       ├── legal/       Legal.tsx + legal.scss
│       └── not-found/   NotFound.tsx + not-found.scss
├── components/          public components by domain — each domain holds the
│   │                    component facade + a <name>/ folder of modules
│   ├── nav/             AppNav.tsx + flag/menu/render/scroll/handlers
│   ├── home/            HomeMosaic (+mosaic/), AwardsMentions (+awards/),
│   │                    AboutSection, ContactSection
│   ├── carousel/        CustomCarousel (+custom-carousel/),
│   │                    HomeCarousel (+home-carousel/)
│   ├── media/           MediaFigure (+figure/), MediaExpanded (+expanded/),
│   │                    DrawText (+draw-text/)
│   ├── dialogs/         LangDialog (+lang-dialog/), PreferencesModal (+preferences/)
│   ├── portfolio/       Related (+related/)
│   ├── feedback/        CookieBanner, SiteToast, StatsHud
│   └── legal/           Footer
├── cms/                 CMS only — separate entry, never indexed; each editor
│   │                    lives in its feature folder (facade + data/events/render)
│   ├── main.ts          CMS entry (referenced by cms/index.html)
│   ├── routes/          AdminLogin, CmsDashboard
│   ├── about/  deploy-info/  footer/  lang/  media-convert/
│   │   playground-editor/  portfolio/  projects/    → one folder per editor
│   ├── dev/             firebase-mock (offline dev)
│   ├── tokens.ts + tokens/  CMS-only constants by domain
│   │       ├── fields/  buttons, form, items, media
│   │       ├── editors/ about, deploy, portfolio, projects
│   │       └── shell/   admin, card, dashboard (+ base.ts at root)
│   └── sass/cms.scss    CMS stylesheet
├── playground/          Earth Playground only
│   ├── SpacePlayground.tsx    the route view facade
│   ├── space/           panel: boot, controls, i18n, wiring, checkbox-webgl
│   ├── earth-background.ts    EarthBackground facade (Three.js WebGPU)
│   ├── earth/           engine — setup/{bootstrap,*-setup},
│   │                    scene/{meshes,surface-material,atmos-shells,post-nodes},
│   │                    runtime/{frame,updates,state,screenshot}, consts, settings
│   └── space-playground.scss
├── safari/              Safari patch modules (loader.ts, patch.ts, patches/, types.ts)
├── legacy-polyfills/    critical in-bundle shims (polyfills.ts) + per-group
│                        lazily-built polyfill entries (es-core, fetch, dom, …)
├── registerServiceWorker.ts
├── sass/                shared style layer
│   ├── base/            tokens: variables, mixins, fonts, placeholders,
│   │                    structure (CSS custom properties live here)
│   └── components/      per-component shadow styles by domain
│                        (carousel/, chrome/, dialogs/, home/, media/,
│                        project/, safari/), consumed via ?inline
└── utils/               services grouped by domain
    ├── canvas/          shared GL infra (gl-program, css-color, webgl-mode,
    │   │                webgl-pool) + two families:
    │   ├── widgets/     per-widget facades + folders (flag/, close-button/,
    │   │                theme-slider/, switch-slider/, burger-button/,
    │   │                carousel-controls/)
    │   └── loaders/     page-load canvases (intro-loader,
    │                    menu-background-webgl + menu-background/,
    │                    skeleton-webgl + skeleton/)
    ├── data/            Firebase fetch + stale-while-revalidate, sanitize
    ├── gpu/  media/  motion/  perf/  wasm/   domain services
    └── notify.ts        Notification/toast service
```

Test and tooling folders mirror the same domain grouping:

```
tests/
├── fixtures/  __mocks__/  data/  transformers/   shared infra (setup.js, resolver.js)
├── core/      store/, component/, i18n/, browser/, jsx/, tokens/, platform/
├── components/  routes/{router,views}/  utils/{wasm,motion}/  cms/  app/  build/
├── coverage/  per-module tail suites — <domain>/<subdomain>/ mirroring src/:
│   ├── core/{component,env,firebase,jsx,loader,schema,store,ui,utils}
│   ├── components/{carousel,dialogs,feedback,footer,home,media}
│   ├── canvas/{infra,loaders,widgets}   cms/{deploy,editors,facade}
│   ├── routes/{pages,router}   playground/{earth,space}
│   ├── utils/{data,gpu,media,motion,perf,wasm}
│   └── app/  legacy-polyfills/  safari/  sweep/ (cross-domain only)
└── governance/  portability, axe, contrast-aaa, jsdoc, sass, style, lighthouse-config, …

scripts/
├── verify/    verify.mjs + console-scan, coverage-gate, security-scan,
│              coverage-gaps, uncov, test-lighthouse
├── build/     build-targets, build-locale-pages, build-wasm,
│              browser-loader, deploy-info, generate-sitemap
├── docs/      gen-docs (JSDoc → docs/jsdocs, docs/api)
├── i18n/      translation tooling (seed, extract, patch, upload)
├── codemod/   codemod-token-imports
├── git-hooks/ versioned pre-commit / pre-push (install via install-hooks.sh)
└── media-convert/  CMS media pipeline
```

Module convention: a decomposed component keeps a **facade** at its feature
folder root (`Related.tsx`, `flag-webgl.ts`) holding state, public/test-visible
methods and element registration; behavior lives in same-named subfolder
modules with clean names (`related/render.tsx`, `flag/anim.ts`). Facade methods
delegate so test spies keep intercepting the original surface.

Ownership rule of thumb: **site code may not import from `cms/` or
`playground/`**; `cms/` and `playground/` import shared code from `core/`,
`utils/`, `sass/` — never from `site/` and never from each other.

## Setup & commands

```bash
npm install          # install dependencies
npm run hooks:install # install pre-commit/pre-push gates (prettier + verify)
npm run dev          # dev server — public site (index.html)
npm run dev:cms      # dev server with the CMS Firebase mock (CMS_MOCK=1)
npm run verify       # full gate: console-scan → typecheck → eslint →
                     # stylelint → jest coverage (incl. axe) → coverage-gate
                     # → security-scan
npm run build        # verify → multi-tier build → deploy-info → docs/jsdocs
npm test             # jest (no coverage)
npm run test:coverage # jest + coverage (per-file 100% gate via coverage-gate)
npm run lint         # eslint src tests (zero warnings)
npm run stylelint    # stylelint on src/**/*.scss
npm run format       # prettier --write across the repo
npm run format:check # prettier --check (CI gate)
npm run typecheck    # tsc --noEmit
npm run docs:api     # generated JSDoc docs → docs/api
npm run docs:jsdocs  # generated JSDoc docs → docs/jsdocs (build step)
npm run lighthouse   # Lighthouse CI assertions (100 everywhere except perf)
npm run deploy:info  # bundle reports/ → dist/deploy-info
```

`npm run deploy` exists but must **never** be run by an agent without an
explicit user instruction — see `AGENTS.md`.

## Testing note

All test files under `tests/` are intentionally written in **JavaScript**,
not TypeScript: they exercise the public runtime surface exactly as a
consumer (or browser) would, keeping tests decoupled from internal type
churn. Tests still import token constants — never raw app strings.

## License

[MPL-2.0](LICENSE) — the license file lives in this `docs/` folder.
