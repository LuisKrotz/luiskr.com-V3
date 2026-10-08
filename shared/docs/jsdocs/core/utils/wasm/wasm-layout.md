# `core/utils/wasm/wasm-layout.ts`

Layout/animation math with a WebAssembly fast path.

| | |
|---|---|
| **Source** | `src/core/utils/wasm/wasm-layout.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### (module scope)

The engine.wasm export table — numeric math routines only.

### `_call`

Dispatches to a WASM export when the instance is live and the export is
callable; returns undefined otherwise so callers fall back to the JS
formula inline (the `?? js` idiom below).
- `@param` name Export name on the engine.wasm module.
- `@param` args Numeric arguments — engine routines are number-only.
- `@returns` The WASM result, or undefined when unavailable.

### `wasmInstance`

Instantiated engine.wasm export table — null until (and unless) the async instantiate resolves.

### `calcColumnWidth`

Column pixel width for a grid: total width minus inter-column gaps,
divided evenly. Formula: (width − (cols−1)·gap) / cols.
- `@param` cols Column count.
- `@param` width Available grid width in px.
- `@param` gap Inter-column gutter in px.
- `@returns` Per-column width in px.

### `calcCardHeight`

Card height for a grid item: column width divided by aspect ratio, plus
padding. A missing/zero ratio falls back to 16:9 so unsized CMS rows
can't produce NaN or zero-height cards.
- `@param` colWidth The column's width in px.
- `@param` aspectRatio width/height of the media.
- `@param` padding Extra vertical padding in px.
- `@returns` Card height in px.

### `calcCarouselRingOffset`

Travel distance along the carousel ring for an elapsed fraction of the
loop duration: (elapsed/duration)·circumference — the stroke-dashoffset
driver for the autoplay progress ring.
- `@param` elapsed Milliseconds into the current autoplay cycle.
- `@param` duration Full cycle duration in ms.
- `@param` circumference Ring's 2πr stroke length in px.
- `@returns` Offset in px along the ring.

### `calcCarouselScrollTarget`

Scroll offset that brings slide `idx` into view, counting per-slide
width + gap: idx·(slideWidth+gap).
- `@param` idx Slide index.
- `@param` slideWidth Rendered slide width in px.
- `@param` gap Inter-slide gap in px.
- `@returns` scrollLeft target in px.

### `calcEaseOutCubic`

easeOutCubic easing — 1−(1−t)³: fast start, decelerating stop. Used for
menu/carousel transitions where motion should settle, not bounce.
- `@param` t Progress fraction 0–1.
- `@returns` Eased progress 0–1.

### `calcDrawTextDelay`

Per-character draw interval sized so the whole text finishes within
targetDurationMs — targetDurationMs/totalChars, clamped between
DRAW_DELAY_MIN_MS (long texts still complete on time) and
DRAW_DELAY_MAX_MS (short texts don't stall). Rounded so the CSS delay
stays integer milliseconds.
- `@param` totalChars Total character count across the text run.
- `@param` targetDurationMs Budget for the whole stagger, in ms.
- `@returns` Per-char delay in ms.

### `calcDrawTextOffset`

Start-time offset for character `idx`: charsBefore·delay staggers it
after the preceding run, plus idx·DRAW_INDEX_STEP_MS so later items in
a list cascade even at equal char counts.
- `@param` idx Index of this item/word in the sequence.
- `@param` charsBefore Cumulative characters before this item.
- `@param` delay Per-char delay from calcDrawTextDelay.
- `@returns` Start offset in ms.

### `calcDrawTextOrderedOffset`

Ordered-queue offset for document-wide cascades: `scheduledMs` is the
cumulative reveal duration of every item that precedes this one across
the whole document (a shared clock position, not a character count), so
the draw-text elements animate strictly in reading order even when
several enter the viewport in the same frame. Reuses the
calc_draw_text_offset op with delay=1 — scheduledMs is already in ms —
plus idx·DRAW_INDEX_STEP_MS so equal-length items still stagger.
- `@param` idx Global index of this item in the document's reveal order.
- `@param` scheduledMs Sum of all preceding items' durations in ms.
- `@returns` Start offset in ms on the shared clock.

### `_resolveBreakpoint`

Resolves a stepped breakpoint map for a viewport width: iterates keys
ascending and keeps the value of the last key ≤ vw (a "floor" lookup).
Fallback serves widths below the first key.
- `@param` map {breakpointPx: value} table — keys are min widths.
- `@param` vw Viewport width in px.
- `@param` fallback Value below the first key.
- `@returns` The resolved step value.

### `calcColsForWidth`

Home-mosaic column count for a viewport width — the legacy stepped
table (1–7 columns); kept alongside MOSAIC_COLS which callers should
prefer for new layout work.
- `@param` vw Viewport width in px.
- `@returns` Column count 1–7.

### `calcMosaicCols`

Mosaic column count via the MOSAIC_COLS breakpoint map (last key ≤ vw
wins) — scales 1→14 columns from phones to 10K walls.
- `@param` vw Viewport width in px.
- `@returns` Column count 1–14.

### `calcMosaicGap`

Mosaic gutter in px — 0 below the gap breakpoint (edge-to-edge tiles on
phones), MOSAIC_GAP above.
- `@param` vw Viewport width in px.
- `@returns` Gutter px.

### `calcResponsivePadding`

Fibonacci-scaled outer page padding per viewport breakpoint (13→144) —
padding grows with screen real estate so content never hugs wide edges.
- `@param` vw Viewport width in px.
- `@returns` Padding in px.

### `calcAspectScaled`

Height rescaled for a width capped at maxW, preserving aspect ratio:
height·(maxW/width) — only shrinks; widths under maxW return height
untouched. Rounded so CSS heights stay integer pixels.
- `@param` width Intrinsic width.
- `@param` height Intrinsic height.
- `@param` maxW Width cap (defaults to FHD so 4K masters don't downscale mid-layout).
- `@returns` Rescaled height.
