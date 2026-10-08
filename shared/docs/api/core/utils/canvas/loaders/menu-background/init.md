# `core/utils/canvas/loaders/menu-background/init.ts`

| | |
|---|---|
| **Source** | `src/core/utils/canvas/loaders/menu-background/init.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `initGL`

Creates the WebGL context + shader program; falls back to the CSS/DOM path on failure.

### `triggerFallback`

Switches to the non-WebGL path (CSS moiré layer) — used on context loss or init failure.
