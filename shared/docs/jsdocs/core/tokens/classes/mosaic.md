# `core/tokens/classes/mosaic.ts`

Home mosaic grid class tokens — token group.

| | |
|---|---|
| **Source** | `src/core/tokens/classes/mosaic.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `HOME_MOSAIC_CLASSES`

Frozen home mosaic class-name map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.
