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

The fallback app constant.

### `FALLBACK_COMPONENTS`

The FALLBACK_COMPONENTS constant.

### `FALLBACK_PAGES`

The fallback pages constant.
