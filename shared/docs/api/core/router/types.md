# `core/router/types.ts`

| | |
|---|---|
| **Source** | `src/core/router/types.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### (module scope)

Metadata one route contributes to the document — `title`/`translation` feed
the head, `scrollTo` a post-nav anchor, `projectRoute`/`legalRoute` classify the
page for schema/analytics treatment.

### (module scope)

English-only docs portal — suppresses the language switcher.

### (module scope)

A resolved route — everything the nav pipeline and views need.

### `name`

Route table name ('home', 'project', 'legal', 'not-found', …).

### `view`

Custom-element tag of the view to mount.

### `lang`

Resolved locale id ('en', 'pt', …).

### `path`

The matched URL path (kept for locale detection and analytics).

### `meta`

Head/scroll classification metadata.

### `params`

Extracted params — `slug` on project routes, etc.

### (module scope)

Subscriber signature — fired on every successful navigation.

### (module scope)

Guard/hook signature — a returned string/{path} short-circuits into a redirect.
