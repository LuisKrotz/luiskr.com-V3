# `utils/canvas/widgets/flag/gl.ts`

GL lifecycle for the shared FlagRenderer: lazy context

| | |
|---|---|
| **Source** | `core/utils/canvas/widgets/flag/gl.ts` |
| **UX surface** | WebGL micro-widgets with Canvas2D fallback — nav, sliders, arrows. |

## Members

### `initFlagGL`

Creates the GL context, flag shaders and textures.

### `disposeFlagGL`

Frees GL program, textures and buffers.

### `initFlagProgram`

Compiles the wave vertex/fragment shaders and resolves uniform locations.
