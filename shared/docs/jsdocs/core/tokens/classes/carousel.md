# `core/tokens/classes/carousel.ts`

Custom carousel class tokens (project/related carousels) —

| | |
|---|---|
| **Source** | `src/core/tokens/classes/carousel.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `CAROUSEL_CLASSES`

Frozen carousel class-name map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.
