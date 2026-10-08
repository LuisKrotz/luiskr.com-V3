# `core/tokens/selectors/common.ts`

Generic/shared selector tokens — grouped subset of

| | |
|---|---|
| **Source** | `src/core/tokens/selectors/common.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `COMMON_SELECTORS`

Frozen common selector map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.
