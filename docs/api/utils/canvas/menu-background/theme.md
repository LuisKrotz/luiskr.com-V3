# `utils/canvas/menu-background/theme.ts`

| | |
|---|---|
| **Source** | `src/utils/canvas/menu-background/theme.ts` |
| **UX surface** | WebGL micro-widgets with Canvas2D fallback — nav, sliders, arrows. |

## Members

### `sampleTheme`

Reads the --menu-ink / --menu-ink-2 custom properties from the
document root and converts them into shader ink colors. Missing or
unparseable tokens fall back to white-on-dark / black-on-light.
_darkAtStart records the theme so _renderFrame can detect a flip.
