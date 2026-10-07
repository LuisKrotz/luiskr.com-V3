# `cms/tokens/shell/card.ts`

Card and section-shell classes — card blocks, section

| | |
|---|---|
| **Source** | `src/cms/tokens/shell/card.ts` |
| **UX surface** | Admin bundle — editors for every database node. |

## Members

### `CMS_CARD_CLASSES`

Frozen cms card class-name map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.
