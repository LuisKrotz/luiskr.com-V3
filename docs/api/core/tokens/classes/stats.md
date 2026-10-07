# `core/tokens/classes/stats.ts`

Stats HUD / autoplay toggle class tokens — grouped subset of

| | |
|---|---|
| **Source** | `src/core/tokens/classes/stats.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `STATS_CLASSES`

Frozen stats class-name map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.
