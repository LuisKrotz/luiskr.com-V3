# `core/tokens/classes/nav.ts`

Navigation class tokens — links, burger button and the

| | |
|---|---|
| **Source** | `src/core/tokens/classes/nav.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `NAV_CLASSES`

Frozen nav class-name map — sole declaration site for these tokens; consumers read members
and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the
token contract immutable at runtime.

### `NAV_BURGER_CLASSES`

Frozen nav burger class-name map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.

### `NAV_MENU_CLASSES`

Frozen nav menu class-name map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.
