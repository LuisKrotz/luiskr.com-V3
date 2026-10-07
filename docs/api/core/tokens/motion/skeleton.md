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

### `SKELETON_GLYPH`

Frozen skeleton map — sole declaration site for these tokens; consumers read members and
never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the token
contract immutable at runtime.

### `CELL_MIN`

Glyph cell size bounds for text rows (CSS px)

### `CELL_MEDIA`

Glyph cell size for media/image placeholders (CSS px)

### `TEXT_MAX_HEIGHT`

Placeholders shorter than this are treated as text lines

### `EDGE_SOFTNESS`

Narrow signed-distance transition keeps text glyph edges crisp instead of blurred.

### `TEXT_DENSITY_BASE`

Text rows use a sparse, low-contrast field so they read as placeholders—not faux copy.

### `INK_SURFACE_MIX_NEAR`

Pull glyph ink toward the surface to keep the decoding texture restrained.

### `SKELETON_RESOLVE`

Frozen skeleton map — sole declaration site for these tokens; consumers read members and
never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the token
contract immutable at runtime.

### `RESOLVE_DURATION`

Resolve-out length once content has arrived (ms)

### `SKELETON_MOSAIC`

Frozen skeleton map — sole declaration site for these tokens; consumers read members and
never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the token
contract immutable at runtime.

### `MOSAIC_TILES`

Mosaic skeleton tiles rendered before data lands (mirrors portfoliolist size)

### `MOSAIC_FEATURED`

The curated home list leads with featured (2-column) items

### `MOSAIC_LCP_TILES`

Mosaic tiles eligible for LCP — loaded eagerly with high fetch priority

### `SKELETON_WARN`

Frozen skeleton map — sole declaration site for these tokens; consumers read members and
never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the token
contract immutable at runtime.

### `SOFTWARE_RENDERERS`

Renderer strings of CPU rasterizers where the field would cost main-thread time
