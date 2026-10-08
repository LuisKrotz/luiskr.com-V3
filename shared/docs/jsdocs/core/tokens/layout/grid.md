# `core/tokens/layout/grid.ts`

Per-breakpoint grid padding (matches SASS $gap-* values) and

| | |
|---|---|
| **Source** | `src/core/tokens/layout/grid.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `MOSAIC_COLS`

Frozen mosaic map — sole declaration site for these tokens; consumers read members and
never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the token
contract immutable at runtime.

### `LEGACY_MOSAIC_COLS`

Legacy stepped column table consumed by calcColsForWidth — predates
MOSAIC_COLS (which caps at 14 cols and starts the wide jumps earlier).
Kept as data so the function shares `_resolveBreakpoint` instead of a
ternary chain; keys are viewport widths, values are column counts.

### `MOSAIC_GAP_STEPS`

Mosaic gutter step table (px) — 0 below 640 (edge-to-edge tiles on
phones), 13 above. Consumed by calcMosaicGap via `_resolveBreakpoint`.

### `RESPONSIVE_PADDING_STEPS`

Fibonacci-scaled outer page padding per breakpoint — 13 up to 320,
then 21/34/55/89 and 144 at ≥1680. Consumed by calcResponsivePadding
via `_resolveBreakpoint`.

### `LAYOUT_MATH`

Frozen layout-math constants — `ASPECT_FALLBACK` is the 16:9 default
ratio when CMS rows lack intrinsic size so card heights stay sane.
