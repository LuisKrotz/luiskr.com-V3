# `core/locale/ui-text.ts`

Runtime translation accessors: resolve a dotted key against

| | |
|---|---|
| **Source** | `src/core/locale/ui-text.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `_dig`

Digs a dotted path ('a.b.c') into a possibly-partial object; null-safe.
The `cur == null → undefined` guard on each reduce step is what makes
missing intermediate nodes safe — `dig({}, 'a.b.c')` returns undefined
instead of throwing on the second key read. Translation dictionaries are
sparse during boot, so every lookup funnels through here.

### (module scope)

Structural view of the live `lang` store slice — the three fetched nodes.

### `appText`

Resolves a UI string from the live APP dictionary (store.lang.app, loaded
from Firebase for the current locale) with the English snapshot as fallback.
- `@param` path  dotted path, e.g. 'media.preview' or 'pref.devTools.showGrid'

### `componentText`

Same lookup for the components dictionary (store.lang.components).

### `routeSlugs`

Route slugs for a locale: CMS-editable overrides (translations/<loc>/slugs,
loaded into store.lang.slugs) merged over the build-time LANG_SLUGS defaults.
- `@param` lang  locale code, e.g. 'br'
