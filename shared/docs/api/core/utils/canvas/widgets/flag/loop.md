# `core/utils/canvas/widgets/flag/loop.ts`

Render loop + fallback transitions for FlagWebGL: the

| | |
|---|---|
| **Source** | `src/core/utils/canvas/widgets/flag/loop.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `triggerFlagFallback`

Switches to the non-WebGL path (CSS class on the host / Canvas2D) — used on context loss or init failure.

### `renderStaticFlag`

Draws a single settled frame — used under reduced motion or when the loop is stopped.

### `renderFlagWebGL`

Per-frame WebGL render: updates time/hover uniforms and draws the quad.

### `animateFlag`

Starts the requestAnimationFrame render loop (skipped under reduced motion).
