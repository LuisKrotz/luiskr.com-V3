# `core/tokens/selectors/cookies.ts`

Cookie banner selector tokens — token group.

| | |
|---|---|
| **Source** | `src/core/tokens/selectors/cookies.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `COOKIE_SELECTORS`

Frozen cookie selector map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.
