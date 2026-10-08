# `core/utils/canvas/loaders/skeleton/theme.ts`

| | |
|---|---|
| **Source** | `src/core/utils/canvas/loaders/skeleton/theme.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `sampleTheme`

Samples the skeleton palette tokens on the host as fallbacks for rects
whose own tokens cannot be parsed. Every candidate is a CSS custom
property — no literal colours live in this file.
