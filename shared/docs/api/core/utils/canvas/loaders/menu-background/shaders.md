# `core/utils/canvas/loaders/menu-background/shaders.ts`

GLSL sources for MenuBackgroundWebGL, extracted from

| | |
|---|---|
| **Source** | `src/core/utils/canvas/loaders/menu-background/shaders.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `MENU_BG_VS`

Shared fullscreen-quad vertex shader.

### `MENU_BG_FS_BODY`

Contour-field fragment shader body (prefix with the deriv prelude).

### `menuBgFsSource`

Full FS source for the current GL capability set.
