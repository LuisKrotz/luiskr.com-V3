# `core/tokens/classes/cookies.ts`

Cookie banner class tokens — token group.

| | |
|---|---|
| **Source** | `src/core/tokens/classes/cookies.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `COOKIE_CLASSES`

Frozen cookie class-name map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.
