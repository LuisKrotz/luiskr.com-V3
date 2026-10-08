# `core/tokens/theme/theme.ts`

Theme value tokens — dark/light/system registry.

| | |
|---|---|
| **Source** | `src/core/tokens/theme/theme.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `THEME`

Frozen theme theme map — sole declaration site for these tokens; consumers read members
and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the
token contract immutable at runtime.

### `MOTION`

Frozen motion map — sole declaration site for these tokens; consumers read members and
never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the token
contract immutable at runtime.
