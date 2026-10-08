# `core/locale/lang-slugs.ts`

Canonical localized route-slug table — the per-locale path

| | |
|---|---|
| **Source** | `src/core/locale/lang-slugs.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `LANG_SLUGS`

Localized route slugs per locale — the path segments after the locale
prefix. English is canonical/un-prefixed; every other locale maps its
routes through this table (`/br/sobre`, `/de/nutzungsbedingungen`, …).
CMS may override these at runtime via `translations/<loc>/slugs`.

Slugs are ASCII-folded (no diacritics — `ueber` not `über`,
`termes-d-us` not `termes-d'ús`) so URLs survive servers and clients
that mishandle percent-encoded UTF-8, and stay readable when pasted
into plain-text contexts.
