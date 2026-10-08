# `utils/canvas/loaders/menu-background/shaders.ts`

GLSL sources for MenuBackgroundWebGL, extracted from

| | |
|---|---|
| **Source** | `core/utils/canvas/loaders/menu-background/shaders.ts` |
| **UX surface** | WebGL micro-widgets with Canvas2D fallback — nav, sliders, arrows. |

## Members

### `MENU_BG_VS`

Shared fullscreen-quad vertex shader.

### `MENU_BG_FS_BODY`

Contour-field fragment shader body (prefix with the deriv prelude).

### `menuBgFsSource`

Full FS source for the current GL capability set.
