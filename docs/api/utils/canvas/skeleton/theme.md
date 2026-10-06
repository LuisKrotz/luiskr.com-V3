# `utils/canvas/skeleton/theme.ts`

| | |
|---|---|
| **Source** | `src/utils/canvas/skeleton/theme.ts` |
| **UX surface** | WebGL micro-widgets with Canvas2D fallback — nav, sliders, arrows. |

## Members

### `sampleTheme`

Samples the skeleton palette tokens on the host as fallbacks for rects
whose own tokens cannot be parsed. Every candidate is a CSS custom
property — no literal colours live in this file.
