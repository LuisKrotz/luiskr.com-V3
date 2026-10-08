# `core/tokens/classes/skeleton.ts`

Skeleton/shimmer placeholder class tokens — grouped subset of

| | |
|---|---|
| **Source** | `src/core/tokens/classes/skeleton.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `SKELETON_CLASSES`

Frozen skeleton class-name map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.
