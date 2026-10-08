# `core/utils/canvas/widgets/switch-slider/render.ts`

| | |
|---|---|
| **Source** | `src/core/utils/canvas/widgets/switch-slider/render.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `SPRING`

Spring constant — snappier than the theme slider's 0.14 (26px travel).

### `renderStatic`

Snap state to target and draw a single settled frame — used under
reduced motion or when the loop is stopped, so toggles still visibly
update without animating.

### `animate`

Starts the requestAnimationFrame render loop (skipped under reduced motion).

### `renderWebGL`

Per-frame WebGL render: updates time/knob uniforms and draws the quad.

### `renderCanvas2D`

Per-frame Canvas2D fallback render — same visual language as the shader.
