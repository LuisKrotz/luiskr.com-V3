# `utils/canvas/loaders/menu-background/init.ts`

| | |
|---|---|
| **Source** | `core/utils/canvas/loaders/menu-background/init.ts` |
| **UX surface** | WebGL micro-widgets with Canvas2D fallback — nav, sliders, arrows. |

## Members

### `initGL`

Creates the WebGL context + shader program; falls back to the CSS/DOM path on failure.

### `triggerFallback`

Switches to the non-WebGL path (CSS moiré layer) — used on context loss or init failure.
