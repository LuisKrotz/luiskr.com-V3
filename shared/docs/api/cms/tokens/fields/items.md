# `cms/tokens/fields/items.ts`

List-item classes — item controls, paragraph items, media

| | |
|---|---|
| **Source** | `src/cms/tokens/fields/items.ts` |
| **UX surface** | Admin bundle — editors for every database node. |

## Members

### `CMS_ITEM_CLASSES`

Frozen cms item class-name map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.
