# `cms/tokens/editors/deploy.ts`

Deploy-info classes — score badges and deploy report table.

| | |
|---|---|
| **Source** | `src/cms/tokens/editors/deploy.ts` |
| **UX surface** | Admin bundle — editors for every database node. |

## Members

### `CMS_DEPLOY_CLASSES`

Frozen cms deploy class-name map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.
