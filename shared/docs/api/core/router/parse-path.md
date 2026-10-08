# `core/router/parse-path.ts`

| | |
|---|---|
| **Source** | `src/core/router/parse-path.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `normalizeProjectKey`

Maps legacy/alternate project URL slugs to canonical data keys via
PROJECT_ALIASES; unknown slugs pass through unchanged.

### `titled`

Titled descriptor with the pipe-separated page suffix.

### `legalRoute`

Legal-page descriptor — page label comes from the localized legal-links component text.

### `parsePath`

Pure resolution: pathname → route descriptor { name, view, lang,
path, meta, params }. meta.scrollTo triggers a post-nav smooth-scroll
to that element id.
