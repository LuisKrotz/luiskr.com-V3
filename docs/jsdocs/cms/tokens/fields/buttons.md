# `cms/tokens/fields/buttons.ts`

Button classes — base, groups and the primary/danger/

| | |
|---|---|
| **Source** | `src/cms/tokens/fields/buttons.ts` |
| **UX surface** | Admin bundle — editors for every database node. |

## Members

### `CMS_BUTTON_CLASSES`

Frozen cms button class-name map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.
