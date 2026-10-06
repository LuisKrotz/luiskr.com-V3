# `core/tokens/motion/skeleton.ts`

WebGL skeleton-field configuration tokens — grouped subsets

| | |
|---|---|
| **Source** | `src/core/tokens/motion/skeleton.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `MAX_RECTS`

Max placeholder rects per layer (GLSL uniform array size)

### `MAX_DPR`

Device pixel ratio cap — the field is soft, 1.5 is plenty

### `RENDER_SCALE`

Internal render scale relative to device pixels — 1 keeps glyph edges sharp

### `FRAME_SKIP`

Render every Nth animation frame

### `START_DELAY`

Max delay before the field starts animating after mount (ms)

### `CELL_MIN`

Glyph cell size bounds for text rows (CSS px)

### `CELL_MEDIA`

Glyph cell size for media/image placeholders (CSS px)

### `TEXT_MAX_HEIGHT`

Placeholders shorter than this are treated as text lines

### `RESOLVE_DURATION`

Resolve-out length once content has arrived (ms)

### `MOSAIC_TILES`

Mosaic skeleton tiles rendered before data lands (mirrors portfoliolist size)

### `MOSAIC_FEATURED`

The curated home list leads with featured (2-column) items

### `MOSAIC_LCP_TILES`

Mosaic tiles eligible for LCP — loaded eagerly with high fetch priority

### `SOFTWARE_RENDERERS`

Renderer strings of CPU rasterizers where the field would cost main-thread time

### `SKELETON`

Composed view — backwards-compatible registry.
