# `core/tokens/classes/effects.ts`

Ambient effect canvas class tokens — fluid background,

| | |
|---|---|
| **Source** | `src/core/tokens/classes/effects.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `FLUID_BG_CLASSES`

Frozen fluid bg class-name map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.

### `CURSOR_CLASSES`

Frozen cursor class-name map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.

### `DISTORT_CLASSES`

Frozen distort class-name map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.
