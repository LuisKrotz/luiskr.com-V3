# `core/locale/fallback.ts`

Build-time English translation snapshot. The Vite plugin

| | |
|---|---|
| **Source** | `src/core/locale/fallback.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### (module scope)

Shape of the translations/<locale> DB node inlined by the Vite plugin.

### `FALLBACK`

English UI copy snapshotted from database.json at build time.
Components read live translations from the store first and fall back to
this snapshot, so no user-visible string lives in JavaScript source.

### `FALLBACK_APP`

The APP subtree of the fallback snapshot — app-shell copy (actions,
carousel labels, loader lines) consumed before Firebase resolves.

### `FALLBACK_COMPONENTS`

The components subtree — per-component copy fallbacks keyed by component
token (e.g. aboutSection, siteToast).

### `FALLBACK_PAGES`

The pages subtree — per-page fallback nodes (home, about, legal…).
