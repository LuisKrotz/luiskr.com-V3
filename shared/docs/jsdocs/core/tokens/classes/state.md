# `core/tokens/classes/state.ts`

Global state modifier class tokens — grouped subset of

| | |
|---|---|
| **Source** | `src/core/tokens/classes/state.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `STATE_CLASSES`

Frozen state class-name map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.
