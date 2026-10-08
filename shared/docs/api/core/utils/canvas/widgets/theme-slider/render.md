# `core/utils/canvas/widgets/theme-slider/render.ts`

| | |
|---|---|
| **Source** | `src/core/utils/canvas/widgets/theme-slider/render.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `SPRING`

Spring constant — each frame closes 14% of the remaining distance.

### `renderStatic`

Snap state to target and draw a single settled frame — used under
reduced motion or when the loop is stopped, so theme changes still
visibly apply without animating.

### `animate`

Starts the requestAnimationFrame render loop (skipped under reduced motion).

### `renderWebGL`

Per-frame WebGL render: updates time/knob uniforms and draws the quad.

### `renderCanvas2D`

Canvas2D fallback renderer — mirrors the shader's composition.
NOTE: `host.ctx` is never assigned in this class — _triggerFallback()
instead hides the canvas and activates the CSS/DOM fallback on the
wrapper. This path is dormant defensive code kept so a future caller
can supply a 2d context and still get a sensible scene.
