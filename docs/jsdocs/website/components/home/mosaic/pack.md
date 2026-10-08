# `website/components/home/mosaic/pack.ts`

Masonry packing engine for &lt;home-mosaic&gt;, extracted from

| | |
|---|---|
| **Source** | `src/website/components/home/mosaic/pack.ts` |
| **UX surface** | Boot surfaces: what the user sees first on each bundle. |

## Members

### (module scope)

One project tile as consumed by the packer.

### (module scope)

Route the card links to.

### (module scope)

Cover image stem.

### (module scope)

Accessible label.

### (module scope)

Card heading.

### (module scope)

Expanded-panel text.

### (module scope)

Featured tiles span 2 columns (on multi-column layouts).

### (module scope)

Style objects emitted per placed tile.

### `bottomH`

Expanded-bottom height in px — the card grows by this when open.

### `card`

Absolutely-positioned card shell box.

### `media`

Media region inside the card.

### `bottom`

Bottom/details region inside the card.

### (module scope)

A packed skeleton placeholder rect (CSS px).

### `top`

Top edge within the wall.

### `left`

Left edge within the wall.

### `w`

Placeholder width.

### `h`

Placeholder height.

### `mosaicGrid`

Resolves column count + pixel column width for a viewport — null when
the content width collapses to ≤0 (ultra-narrow/zero-size viewports get
no layout rather than NaN styles).
- `@param` vw Viewport width in px.
- `@returns` {N, colW} or null.

### `lowestColumnPeak`

Lowest-column placement: a span-N tile sits on the tallest column in
its footprint; pick the column range whose peak is lowest so the wall
stays roughly level instead of column-by-column fill.
- `@param` colH Per-column occupied heights.
- `@param` span Columns the tile covers.
- `@returns` The best column index + its top y.

### `tileStyles`

Style objects for one placed tile — the card shell gets the absolute
box (top/left/width, height = image+bottom), the media region gets the
image height, and the bottom region reserves the expanded-details slot
(0px when closed so the DOM stays mounted but invisible).
- `@param` top Placement y.
- `@param` left Placement x.
- `@param` itemW Tile width incl. covered gap.
- `@param` imageH Media region height.
- `@param` bottomH Details region height (0 when closed).
- `@returns` The three style objects.

### `computeMosaicLayout`

Full packing pass: returns per-card style objects + packed height.
`bottomHFor(i)` supplies the expanded details height (0 when closed) —
the card GROWS the wall rather than overlaying so expanding a tile
reflows the cards below it. The container height subtracts the trailing
gap so it hugs the last tile.
- `@param` vw Viewport width.
- `@param` items The tile list.
- `@param` bottomHFor Expanded-bottom height lookup per index.
- `@returns` {cards, height} or null for empty/degenerate grids.

### `packMosaicSkeleton`

Skeleton variant: packs placeholder tiles (no items needed — featured
count + aspect cycle come from SKELETON/LAYOUT tokens) so the loading
wall matches the real geometry.
- `@param` vw Viewport width.
- `@returns` {boxes, height} — empty boxes on degenerate grids.
