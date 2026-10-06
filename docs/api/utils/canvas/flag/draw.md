# `utils/canvas/flag/draw.ts`

Per-frame draw for the shared FlagRenderer: binds the wave

| | |
|---|---|
| **Source** | `src/utils/canvas/flag/draw.ts` |
| **UX surface** | WebGL micro-widgets with Canvas2D fallback — nav, sliders, arrows. |

## Members

### `drawFlag`

Renders one wave-shader frame for a flag (or its split pair for dual
flags like en-GB/en-US hybrids) onto the shared canvas, then blits
the result to the flag's own 2D canvas at time t.
