# Build (vite.config.js + shared/scripts/build/build.mjs)

Rolldown-powered Vite driven by a **12-tier ES build matrix** — every visitor
receives the newest syntax tier their engine can execute, plus only the
polyfills their engine actually lacks.

**Source targets ESNext.** `tsconfig.json` keeps `target`/`module` on
`esnext` — source code is written against the latest syntax — and all
older-engine compatibility is delivered exclusively by this build matrix
(tier transforms + gated polyfills), never by lowering the source target.
`paths` aliases resolve bundler-relative (no deprecated `baseUrl`).

## Multi-target matrix (`shared/build/es-targets.mjs`)

`yarn build` runs the complete `yarn verify` gate in `prebuild`, then
`shared/scripts/build/build.mjs` orchestrates the production outputs:

1. `shared/scripts/build/build-targets.mjs` runs one `vite build` per tier (`LK_TARGET` env selects the tier config).
   Module tiers emit `dist/v/<tier>/assets/{index-*.js,index-*.css}`; the
   `es2016` tier is a self-contained IIFE classic bundle (no code splitting —
   a Rolldown IIFE limitation) for browsers with ES2015-era syntax but no
   `type=module` support (EdgeHTML ≤18, Safari ≤10.3, Samsung ≤7).
   The default tier (`es2026`) additionally owns `dist/index.html`,
   `dist/cms/index.html`, `public/` assets and the service worker.
2. One Rolldown IIFE bundle per entry in `POLYFILLS` →
   `dist/assets/polyfills/<name>-<hash>.js`.
3. `dist/index.html` is rewritten: the hardcoded module script is replaced by
   the inlined ES5-safe loader (`shared/scripts/build/browser-loader.js`) + a
   `window.__LK` manifest of every tier's `{js,css,module,tests,default}`
   and each polyfill's `{file,guard}`.

| Tier               | Transform               | Format   | Flagship probes                              |
| ------------------ | ----------------------- | -------- | -------------------------------------------- |
| `esnext`           | `esnext` / css `esnext` | module   | `Float16Array`, `Math.sumPrecise` (stage-4+) |
| `es2026` (default) | `esnext` / css `esnext` | module   | `RegExp.escape`, `Set#union`, `Iterator`     |
| `es2025`           | `es2025`                | module   | `Set#union`, `Object.groupBy`                |
| `es2024`           | `es2024`                | module   | `Object.groupBy`, `Promise.withResolvers`    |
| `es2023`           | `es2023`                | module   | `toSorted`, `findLast`                       |
| `es2022`           | `es2022`                | module   | `Object.hasOwn`, `.at`, private fields       |
| `es2021`           | `es2021`                | module   | `replaceAll`, `Promise.any`, `??=`           |
| `es2020`           | `es2020`                | module   | `?.`, `??`, `allSettled`                     |
| `es2019`           | `es2019`                | module   | `flat`, `fromEntries`, optional catch        |
| `es2018`           | `es2018`                | module   | async iteration, `finally`, lookbehind       |
| `es2017`           | `es2017`                | module   | async/await, `Object.values`, `padStart`     |
| `es2016`           | `es2015`                | **iife** | `includes`, `**`                             |

The default `es2026` bundle carries **zero prefixes and zero polyfills** —
Lighthouse and modern browsers never download legacy code.

## Runtime dispatch (`shared/scripts/build/browser-loader.js`)

Authored in strict ES5 (parseable on the oldest engines it detects), inlined
into `index.html`, minified to `ecma:5` by Terser:

1. **Feature ladder** — walks `targets` newest→oldest evaluating each `tests`
   probe via `new Function`. Module tiers additionally require `type=module`
   support (`'noModule' in script`) and `import()` syntax (compile-only probe —
   executing a `data:` import could false-negative under CSP).
2. **Polyfill gates** — each `POLYFILLS` group's `guard` is probed; only the
   failing groups are fetched, chained in `POLYFILL_ORDER` (core shims first).
3. **Tier boot** — injects the tier stylesheet (skipped for `es2026`, already
   lazy-linked in `<head>`) then the bundle as `type=module` or classic.

Engines failing every tier (e.g. IE11, which lacks ES2015 **syntax** — no
polyfill can parse `class`/`const` — and Shadow DOM) receive a minimal
"please update" notice rather than a broken half-boot.

### Polyfill groups (`core/legacy-polyfills/`)

| Bundle          | Guard (loaded when…)                                               | Contents                         |
| --------------- | ------------------------------------------------------------------ | -------------------------------- |
| `es-core`       | Promise/Symbol/Map/Object.assign missing                           | `core-js` minified bundle        |
| `fetch`         | `fetch` missing                                                    | `whatwg-fetch`                   |
| `webcomponents` | `customElements`/`attachShadow` missing                            | `@webcomponents/webcomponentsjs` |
| `io`            | `IntersectionObserver` missing                                     | `intersection-observer`          |
| `ro`            | `ResizeObserver` missing                                           | `resize-observer-polyfill`       |
| `dom`           | queueMicrotask/rIC/structuredClone/AbortController/closest missing | hand-rolled ES5 shims            |
| `cssvars`       | `CSS.supports('(--a:0)')` fails                                    | `css-vars-ponyfill` (watch mode) |

Every group is an independent hashed file → browsers pay only for what they
lack; modern engines fetch zero bytes of polyfill.

### Iteration knobs

- `LK_ONLY=esnext,es2016` — build just those tiers (dev loop).
- `LK_ONLY=_none` — skip all vite builds; regenerate only polyfills,
  manifest and `index.html` injection.
- `LK_KEEP_DIST=1` — don't empty `dist/` (used when building a subset).

### Sourcemaps

`build.sourcemap: true` in `vite.config.js` — every tier emits `.js.map`
siblings (esbuild → terser chain preserved). CSS: rolldown-vite does not
emit sourcemaps for code-split CSS assets, so `emitCss` in
`shared/scripts/build/build-targets.mjs` ships a mapped copy of the global sheet
per tier: `app-<hash>.css` + `.map` (unreferenced by the manifest — a
debug artifact). The map chains Sass → lightningcss via `inputSourceMap`
and rewrites `sources` to repo-relative `core/sass/**` paths, so minified
CSS resolves to real `.scss` lines without leaking the build machine's
filesystem layout. For iife tiers with no vite CSS, `emitCss` produces
the served `index-<hash>.css` + map the same way.

## i18n snapshot plugin

`database.json` → per-locale virtual chunks (`virtual:locale-*`) emitted at
build time, plus `FALLBACK`/`FALLBACK_PAGES` virtual modules. Consuming code
does `chunk['APP']`/`FALLBACK_PAGES['HOME']` lookups on **runtime-parsed**
objects.

### Terser pitfall — all-caps property mangling

`terserMangle.properties.regex = /^[A-Z0-9_]+$/` renames ALL-CAPS object keys
(`APP` → `ag`, `HOME` → `ax`, …). Two hard rules:

- Any code that looks up DB keys by **string** (`chunk['APP']`,
  `FALLBACK_PAGES['HOME']`) must either consume `JSON.parse(...)` output
  (opaque to the mangler) or the keys must be in the `reserved` list.
  Currently `APP`, `HOME`, `GDPR` are reserved — if you add a new top-level
  page key in ALL-CAPS, extend `reserved` in `vite.config.js`.
- Never mix `obj.KEY` writes with `obj['KEY']` reads for these objects.

## Media/assets

- Fonts/flags/covers live on the CDN (`URLS.CDN_BASE`) and in
  `public/assets/flags/`; the build does not process images. `public/` is
  grouped by ownership: `assets/` (website), `experiments/<name>/`
  (playground textures/music), `scripts/{wasm,workers}/` (runtime payloads),
  `meta/` (robots, per-locale sitemaps, llms.txt, ai-catalog, manifests —
  Firebase rewrites keep their root/`/<loc>/` URLs stable).
- `uses-responsive-images` is a known Lighthouse gap: the bucket has only
  full-size originals; adding `covers/*-640.jpg` variants + `srcset` is the
  pending fix.
- PWA: `vite-plugin-pwa` emits the service worker; route chunks are precached.
  `build-targets.mjs` re-stamps the `index.html` precache revision after the
  loader is injected so the SW serves the rewritten document.

## Outputs that matter

```
dist/index.html                 modern site + inlined tier/polyfill loader
dist/cms/index.html             CMS app (noindex)
dist/v/<tier>/assets/           per-tier JS + CSS (hashed, .br/.gz siblings)
dist/assets/                    website assets + conditional polyfills (hashed)
dist/langs/<loc>/<route>/       pre-rendered localized pages (hreflang JSON-LD)
dist/experiments/earth-playground/   playground textures + music
dist/scripts/wasm/              engine.wasm + layout.wasm
dist/scripts/workers/           wasm-worker.js
dist/meta/                      sitemap index + sitemap-<loc>.xml + per-locale
│                               robots/llms/urllist/ai-catalog under <loc>/
dist/service-worker.js          stays at root — SW scope requires it
```

## Local verification loop

```
yarn test            # all module jest suites via shared/scripts/test/run-modules.mjs
yarn lint        # eslint, 0 errors expected
yarn build                        # full matrix; prebuild runs complete verification + coverage
yarn build --verify-lighthouse    # same build, then Lighthouse against completed artifacts
yarn vite preview                 # serve dist for manual/headless checks
```

Delete `lighthouse-reports/`/`.lighthouseci/` artifacts after reading them —
they must not be committed.

## Deploy info bundle

`shared/scripts/build/deploy-info.mjs` (`yarn deploy:info`, also invoked automatically at
the end of `yarn test:lighthouse`) writes `dist/deploy-info/`:

```
dist/deploy-info/index.json               { generatedAt, commit, files }
dist/deploy-info/lighthouse-summary.json  per-URL scores + failing audits (last run only)
dist/deploy-info/coverage-summary.json    Jest coverage totals (yarn test:coverage)
```

`.lighthouseci/` is pruned to the last representative run's artifacts —
older `lhr-*` reports are discarded. The bundle ships inside `dist`, so the
deployed site serves it at `/deploy-info/`; it is surfaced in the CMS
Deploy Info tab (auth-gated).
