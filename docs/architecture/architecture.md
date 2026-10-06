# Architecture

## Layers and ownership

```mermaid
flowchart TB
    subgraph entries["Entry points (separate bundles)"]
        MAIN["index.html → src/main.ts"]
        CMSMAIN["cms/index.html → src/cms/main.ts"]
    end

    subgraph site["public website"]
        APP["App.tsx + app/ (app-shell)"]
        SITER["routes/: Home · Project · Legal · NotFound"]
        SITEC["components/<domain>/: AppNav, HomeMosaic, MediaFigure, …"]
    end

    subgraph cms["src/cms — CMS"]
        CMSR["routes/: AdminLogin · CmsDashboard"]
        CMSC["<feature>/: Cms* editors (facade + data/events/render)"]
        CMST["tokens.ts · sass/cms.scss"]
    end

    subgraph pg["src/playground — Earth Playground"]
        SP["SpacePlayground.tsx + space/"]
        EB["earth-background.ts + earth/ (Three.js WebGPU)"]
    end

    subgraph shared["shared layer"]
        ROUTER["src/routes/router.ts"]
        CORE["src/core: Component · jsx · store · tokens · i18n"]
        UTILS["src/utils/<domain>: data · canvas · wasm · motion · perf"]
        SASS["src/sass: base tokens + component styles"]
        FB["src/firebase.ts"]
    end

    MAIN --> APP
    CMSMAIN --> CMSR
    APP --> ROUTER --> SITER
    SITER --> SITEC
    SP -. lazy import .-> EB
    ROUTER --> SP
    CMSR --> CMSC
    SITER --> CORE
    SITEC --> CORE
    SITEC --> UTILS
    SP --> CORE
    SP --> UTILS
    CMSC --> CORE
    CMSC --> FB
    APP --> FB
    UTILS --> FB
```

### Import rules

| Layer         | May import                        | Must NOT import                |
| ------------- | --------------------------------- | ------------------------------ |
| `site/`       | `core/`, `utils/`, `sass/`        | `cms/`, `playground/`          |
| `cms/`        | `core/`, `firebase.ts`, own files | `site/`, `playground/`         |
| `playground/` | `core/`, `utils/`, `sass/`        | `site/`, `cms/`                |
| `core/`       | `core/` internals                 | anything above it              |
| `utils/`      | `core/`                           | `site/`, `cms/`, `playground/` |

### Facade + module convention

Decomposed components follow one pattern everywhere: a **facade** at the
feature-folder root holds state, the public/test-visible method surface and
`customElements.define`, and delegates to same-named subfolder modules with
clean names — `components/portfolio/Related.tsx` + `related/{data,match,
render,types}.ts`, `utils/canvas/widgets/flag-webgl.ts` + `widgets/flag/{anim,gl,loop,…}.ts`,
`cms/about/CmsAboutEditor.tsx` + `about/{data,events,render,…}.ts`. Facade
methods stay as delegates so tests can spy on the original surface.

## Runtime shell

```
document
└── <app-shell>                src/App.tsx          (shadow root, app.scss)
    ├── <app-nav>              components/nav/AppNav.tsx
    │     nav links, language button, burger canvas, WebGL menu backdrop
    ├── <main>                 router swaps route views here
    │     └── <home-view> | <project-view> | <legal-view> | <not-found-view>
    │           └── components → each is a BaseComponent with own shadow root
    ├── <stats-hud>            dev/perf overlay (opt-in via preferences)
    └── <cookie-banner>
```

Each `BaseComponent`:

1. Creates an open shadow root in `super(styles)` and inlines its compiled SCSS
   (`import styles from '../x.scss?inline'` → `<style>` inside the shadow root).
2. Renders via `h()` JSX into the shadow root.
3. Shows a skeleton placeholder (`.skeleton-layer` canvas or CSS shimmer)
   until `resolve()` is called with real data — see
   [webgl-canvas.md](webgl-canvas.md#skeletons).
4. Registers listeners through `addScopedListener` so teardown removes them
   automatically when the route changes.

## Two bundles

Vite builds two artifacts (see [build.md](../guides/build.md)):

- **Modern** (`target: es2026`) — served to evergreen browsers.
- **Compat** (`ecma: 2020`, separate `dist/assets/compat/`) — Safari-legacy path,
  selected at runtime by `safari-loader.ts`/`safari-patch.ts`.

The CMS has its own Rollup input (`cms/index.html`) inside the modern build, so
CMS code never enters the public entry graph and is excluded from indexing via
`robots` + `noindex` meta.

## Data flow (read path)

```
build time                    runtime
─────────                     ─────────
database.json ──► snapshot    index.html → App.tsx
chunks (per   ──► instant     ├─► detectLangFromPath()
locale)         first paint   ├─► fetchFirebaseDb(components|APP|slugs)
                              │     ├─► stale: snapshot content renders now
                              │     └─► revalidate: live Firebase → onUpdate
                              │           (only if deep-different; null ≠ wipe)
                              └─► router mounts view → view fetches its
                                    pages/projects node → render → resolve()
```

A missing live node (`null`) never erases snapshot content — that was the fix
for the double-blink regression. The snapshot comparison is order-insensitive
because Firebase reorders object keys.
