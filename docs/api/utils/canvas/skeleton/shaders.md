# `utils/canvas/skeleton/shaders.ts`

GLSL sources for the skeleton shimmer layer, extracted

| | |
|---|---|
| **Source** | `src/utils/canvas/skeleton/shaders.ts` |
| **UX surface** | WebGL micro-widgets with Canvas2D fallback — nav, sliders, arrows. |

## Members

### `SKELETON_VS`

Shared fullscreen-quad vertex shader.

### `SKELETON_FS`

Shimmer fragment shader — u_rects/u_meta/u_sbase/u_sink are per-rect arrays.
