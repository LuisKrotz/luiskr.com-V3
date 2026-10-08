# `utils/canvas/widgets/burger-button/shaders.ts`

GLSL sources for BurgerButtonWebGL, extracted from

| | |
|---|---|
| **Source** | `core/utils/canvas/widgets/burger-button/shaders.ts` |
| **UX surface** | WebGL micro-widgets with Canvas2D fallback — nav, sliders, arrows. |

## Members

### `BURGER_VS`

Shared fullscreen-quad vertex shader.

### `BURGER_FS_BODY`

Hairline menu-icon fragment shader body (prefix with the deriv prelude).

### `burgerFsSource`

Full FS source for the current GL capability set.
