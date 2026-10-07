# `core/tokens/selectors/nav.ts`

Navigation selector tokens — token group.

| | |
|---|---|
| **Source** | `src/core/tokens/selectors/nav.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `NAV_SELECTORS`

Frozen nav selector map — sole declaration site for these tokens; consumers read members
and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the
token contract immutable at runtime.
