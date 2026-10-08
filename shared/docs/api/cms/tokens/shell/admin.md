# `cms/tokens/shell/admin.ts`

Admin/login classes — login wrapper/card, Google auth

| | |
|---|---|
| **Source** | `src/cms/tokens/shell/admin.ts` |
| **UX surface** | Admin bundle — editors for every database node. |

## Members

### `CMS_ADMIN_CLASSES`

Frozen cms admin class-name map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.
