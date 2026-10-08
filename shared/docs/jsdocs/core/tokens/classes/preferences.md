# `core/tokens/classes/preferences.ts`

Preferences modal class tokens — all composed from the `pref`

| | |
|---|---|
| **Source** | `src/core/tokens/classes/preferences.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `PREF_CLASSES`

Frozen pref class-name map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.
