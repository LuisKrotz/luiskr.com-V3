# `components/home/mosaic/pack.ts`

Masonry packing engine for &lt;home-mosaic&gt;, extracted from

| | |
|---|---|
| **Source** | `src/components/home/mosaic/pack.ts` |
| **UX surface** | Shadow-DOM widgets — the visible UI of the public site. |

## Members

### (module scope)

The MosaicItem value.

### (module scope)

The MosaicCardStyle value.

### (module scope)

The SkeletonBox value.

### `mosaicGrid`

Column-count + column-width for a viewport width, or null when unusable.

### `lowestColumnPeak`

Lowest-column placement: a span-N tile sits on the tallest column in
its footprint; pick the column range whose peak is lowest so the wall
stays roughly level instead of column-by-column fill.

### `tileStyles`

Style objects for one placed tile (card shell / media / bottom).

### `computeMosaicLayout`

Full packing pass: returns per-card style objects + packed height.
`bottomHFor(i)` supplies the expanded details height (0 when closed).

### `packMosaicSkeleton`

Skeleton variant: packs placeholder tiles (no items needed — featured
count + aspect cycle come from SKELETON/LAYOUT tokens) so the loading
wall matches the real geometry.
