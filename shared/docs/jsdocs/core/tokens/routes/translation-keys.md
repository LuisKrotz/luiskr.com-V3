# `core/tokens/routes/translation-keys.ts`

Route meta translation keys — values used in

| | |
|---|---|
| **Source** | `src/core/tokens/routes/translation-keys.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `TRANSLATION_KEYS`

Frozen translation key map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.
