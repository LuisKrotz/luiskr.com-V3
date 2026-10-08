# `core/tokens/classes/footer.ts`

Footer source-code row class tokens — grouped subset of

| | |
|---|---|
| **Source** | `src/core/tokens/classes/footer.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `FOOTER_CLASSES`

Frozen footer class-name map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.

### `FOOTER_DOCS`

Docs-portal footer entry — link + localized English-only note.
