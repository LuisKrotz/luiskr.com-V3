# `core/tokens/selectors/mosaic.ts`

Home mosaic selector tokens — token group.

| | |
|---|---|
| **Source** | `src/core/tokens/selectors/mosaic.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `MOSAIC_SELECTORS`

Frozen mosaic selector map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.
