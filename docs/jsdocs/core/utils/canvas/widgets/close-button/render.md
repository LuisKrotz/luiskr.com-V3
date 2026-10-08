# `core/utils/canvas/widgets/close-button/render.ts`

| | |
|---|---|
| **Source** | `src/core/utils/canvas/widgets/close-button/render.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `LIQUID_RATE`

Liquid fill rate — deliberately slowest so the wash pours.

### `ROT_RATE`

X-spin rate — faster so the half-turn lands near the end of the pour.

### `DRAW_RATE`

One-time stroke draw-in rate (~50 frames ≈ 830ms on mount).

### `renderStatic`

Draws one settled frame with the X fully drawn — used under reduced
motion or when the loop is stopped so the button stays visible and
hover-state still applies (without animating).

### `animate`

Starts the requestAnimationFrame render loop (skipped under reduced motion).

### `renderWebGL`

Per-frame WebGL render: updates time/hover uniforms and draws the quad.
