# `cms/tokens/editors/portfolio.ts`

Portfolio-list editor classes + control IDs — item cards,

| | |
|---|---|
| **Source** | `src/cms/tokens/editors/portfolio.ts` |
| **UX surface** | Admin bundle — editors for every database node. |

## Members

### `CMS_PORTFOLIO_CLASSES`

Frozen cms portfolio class-name map — sole declaration site for these tokens; consumers
read members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze
makes the token contract immutable at runtime.

### `CMS_PORTFOLIO_IDS`

Frozen cms portfolio element-id map — sole declaration site for these tokens; consumers
read members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze
makes the token contract immutable at runtime.
