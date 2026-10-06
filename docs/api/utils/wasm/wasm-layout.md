# `utils/wasm/wasm-layout.ts`

Layout/animation math with a WebAssembly fast path.

| | |
|---|---|
| **Source** | `src/utils/wasm/wasm-layout.ts` |
| **UX surface** | Runtime services behind the scenes (WASM, GL, scroll, media). |

## Members

### (module scope)

The engine.wasm export table — numeric math routines only.

### `calcColumnWidth`

Column pixel width for a grid: total width minus inter-column gaps, divided evenly.

### `calcCardHeight`

Card height for a grid item: column width divided by aspect ratio, plus padding.

### `calcCarouselRingOffset`

Travel distance along the carousel ring for an elapsed fraction of the loop duration.

### `calcCarouselScrollTarget`

Scroll offset that brings slide `idx` into view, counting per-slide width + gap.

### `calcEaseOutCubic`

easeOutCubic easing — fast start, decelerating stop.

### `calcDrawTextDelay`

Per-character draw interval sized so the whole text finishes within targetDurationMs (clamped 1–22ms).

### `calcDrawTextOffset`

Start-time offset for character `idx` given the cumulative chars before it and the per-char delay.

### `calcColsForWidth`

Home-mosaic column count for a viewport width — stepped breakpoints from 1 to 7 columns.

### `calcMosaicCols`

Mosaic column count via the MOSAIC_COLS breakpoint map (last key ≤ vw wins).

### `calcMosaicGap`

Mosaic gutter in px — 0 on small screens (edge-to-edge tiles), 13 above 640px.

### `calcResponsivePadding`

Fibonacci-scaled outer page padding per viewport breakpoint (13→144).

### `calcAspectScaled`

Height rescaled for a width capped at maxW, preserving aspect ratio.
