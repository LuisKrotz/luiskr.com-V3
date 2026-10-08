# `core/utils/canvas/widgets/flag/draw.ts`

Per-frame draw for the shared FlagRenderer: binds the wave

| | |
|---|---|
| **Source** | `src/core/utils/canvas/widgets/flag/draw.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `drawFlag`

Renders one wave-shader frame for a flag (or its split pair for dual
flags like en-GB/en-US hybrids) onto the shared canvas, then blits
the result to the flag's own 2D canvas at time t.
