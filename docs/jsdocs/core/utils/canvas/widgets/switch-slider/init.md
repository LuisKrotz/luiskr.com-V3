# `core/utils/canvas/widgets/switch-slider/init.ts`

| | |
|---|---|
| **Source** | `src/core/utils/canvas/widgets/switch-slider/init.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `backingDpr`

Backing store at clamp(devicePixelRatio, 2, 3) — the 2px floor keeps
the 1px SDF edges crisp on 1× displays; the 3× ceiling caps fill
cost on phones (the widget is only 54×28 CSS px anyway).

### `triggerFallback`

Switches to the non-WebGL path — releases any live GL, then hides the canvas so the CSS fallback shows.

### `init`

Boot sequence: GL init → event binding → render start; fully degrades to the fallback path.

### `initWebGL`

Creates the WebGL context, compiles the shader program and sets up uniforms/buffers; falls back on any failure.
