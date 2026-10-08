# `core/utils/canvas/loaders/menu-background/theme.ts`

| | |
|---|---|
| **Source** | `src/core/utils/canvas/loaders/menu-background/theme.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `sampleTheme`

Reads the --menu-ink / --menu-ink-2 custom properties from the canvas
element and converts them into shader ink colors. Sampling the canvas
(not the root) lets scoped overrides apply — e.g. .nav--playground
forces the dark ink set regardless of the global theme. Missing or
unparseable tokens fall back to white-on-dark / black-on-light.
_darkAtStart records the theme so _renderFrame can detect a flip.
