# `utils/canvas/flag/texture.ts`

Flag asset caches for FlagRenderer: per-country-code

| | |
|---|---|
| **Source** | `src/utils/canvas/flag/texture.ts` |
| **UX surface** | WebGL micro-widgets with Canvas2D fallback — nav, sliders, arrows. |

## Members

### `flagImage`

Builds (once) and caches the flag's composited <img> for country code
cc — composite means the base flag plus any overlays (e.g. the EU
circle for split-locale flags) baked into one source image.

### `flagTexture`

Builds/caches the GL texture for the flag image.
