# `cms/tokens/shell/dashboard.ts`

Dashboard chrome classes — header, brand, user info, nav

| | |
|---|---|
| **Source** | `src/cms/tokens/shell/dashboard.ts` |
| **UX surface** | Admin bundle — editors for every database node. |

## Members

### `CMS_DASHBOARD_CLASSES`

Frozen cms dashboard class-name map — sole declaration site for these tokens; consumers
read members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze
makes the token contract immutable at runtime.
