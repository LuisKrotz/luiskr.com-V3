# Routing

`src/routes/router.ts` — the router facade lives at the `routes/` root
alongside its modules (`parse-path.ts`, `navigate.ts`, `types.ts`); each page
view is a self-contained folder under `routes/views/<page>/` holding the
`.tsx` facade, its `.scss`, and its helper modules (`views/home/`,
`views/project/`, `views/legal/`, `views/not-found/`). There is no
`src/router/` wrapper directory; `src/core/index.ts` re-exports it as
`router` for barrel imports.

## Route table

Views are lazily `import()`ed by the router so each route ships its own chunk:

| Path pattern                                    | View                                      | Chunk                  |
| ----------------------------------------------- | ----------------------------------------- | ---------------------- |
| `/`                                             | `routes/views/home/Home.tsx`              | `Home-*.js`            |
| `/portfolio/:slug` (project slugs + aliases)    | `routes/views/project/Project.tsx`        | `Project-*.js`         |
| `/privacy-policy`, `/gdpr`, `/terms-of-use`     | `routes/views/legal/Legal.tsx`            | `Legal-*.js`           |
| `/earth-playground` (alias `/space-playground`) | `playground/SpacePlayground.tsx`          | `SpacePlayground-*.js` |
| anything else                                   | `routes/views/not-found/NotFound.tsx`     | `NotFound-*.js`        |
| `/cms*`                                         | handled by the CMS bundle, not this table | —                      |

`PROJECT_ALIASES` maps legacy/external slugs to canonical project keys so old
links keep working.

## Locale prefixes

```
/en/portfolio/melissa      → lang=en, route=/portfolio/melissa
/portfolio/melissa         → default lang (en)
/br                        → lang=br, route=/
```

`detectLangFromPath()` (`core/i18n.ts`) reads the first path segment against
`VALID_LANGS`. `App.tsx` resolves the locale _before_ the router mounts, so the
view's translation bundle (`APP`, `components`, `pages`, `slugs`) is already in
the store.

## Locale-specific slugs

Route slugs themselves are localizable. Resolution order:

```
translations/<locale>/slugs   (Firebase + snapshot, CMS-editable)
        ↓ merged over
LANG_SLUGS defaults           (src/core/locale/lang-slugs.ts)
        ↓
store.state.lang.slugs        (set by App.tsx during locale load)
```

- **Inbound**: `router.parse` compares incoming segments to the active locale's
  slugs first, then to defaults — a `/de/datenschutz` URL resolves to the same
  legal route as `/privacy-policy`.
- **Outbound**: `LangDialog` calls `routeSlugs(newLang)` so switching language
  rewrites the current path into the target locale's slug, not just the prefix.
- `src/main.ts` uses `LANG_SLUGS` directly because it runs before the store
  exists — intentional, don't "fix" it.

## View lifecycle

```
router.navigate(path)
  → parse locale + route
  → store.commit(MUTATIONS.SET_ROUTE)
  → dynamic import(view module)
  → new ViewElement() → appended to <main>
      view constructor → skeleton placeholders
      view fetches its DB node (pages/*, projects/*)
      view.render() → resolve() → skeleton fade + content-in
  → previous view disconnected → BaseComponent teardown
      (scoped listeners removed, WebGL contexts released)
```

## UX mapping

- **Instant nav**: route chunks are preloaded by the service worker after
  first load; navigation is effectively local.
- **Skeletons**: each view renders layout-accurate skeletons immediately, so
  route changes never flash an empty page.
- **Title/meta**: the router sets `document.title` from `TRANSLATION_KEYS` +
  `BASE_TITLE` after the view resolves.
