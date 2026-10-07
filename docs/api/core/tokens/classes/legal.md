# `core/tokens/classes/legal.ts`

Legal pages + not-found view class tokens — grouped subset of

| | |
|---|---|
| **Source** | `src/core/tokens/classes/legal.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `LEGAL_CLASSES`

Frozen legal class-name map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.

### `NOT_FOUND_CLASSES`

Frozen not found class-name map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.
