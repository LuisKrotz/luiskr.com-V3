# `core/tokens/routes/paths.ts`

Path tokens split by function — public URL routes, Firebase

| | |
|---|---|
| **Source** | `src/core/tokens/routes/paths.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `ROUTE_PATHS`

Frozen public-route map — canonical (English) URL paths. `*_SEGMENT`
variants exist for string-contains matching when the leading slash would
false-positive (e.g. '/portfolio/' vs the bare 'portfolio' segment);
`PORTFOLIO`/`PORTFOLIO_SLASH` duplicate intentionally so call sites
read unambiguously by intent.

### `DB_PATHS`

Frozen db path map — sole declaration site for these tokens; consumers read members and
never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the token
contract immutable at runtime.

### `PROJECTS_SEGMENT`

Segment names inside translations/<locale>/ used by the bootstrap chunks

### `ASSET_PATHS`

Frozen asset path map — sole declaration site for these tokens; consumers read members and
never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the token
contract immutable at runtime.
