/**
 * @file tokens/layout/grid.js
 * @description Per-breakpoint grid padding (matches SASS $gap-* values) and
 * the mosaic column table shared with the WASM layout worker.
 */

/**
 * Per-breakpoint grid padding (matches SASS $gap- values) and the mosaic column table shared with the WASM layout worker. Sole declaration site — consumers import members
 * from this frozen map rather than re-declaring the literals
 * (zero-hardcoding rule).
 */
export const GRID_GAP = Object.freeze({
  272: 13,
  320: 21,
  375: 21,
  414: 21,
  540: 34,
  768: 55,
  960: 55,
  1024: 89,
  1280: 89,
  1440: 89,
  1680: 144,
  1920: 144,
  2560: 233,
  3840: 377,
  5120: 377,
  7680: 610,
  10240: 610,
})

// Must match calcColsForWidth() / calcMosaicCols() in wasm-layout.js
/**
 * Frozen mosaic map — sole declaration site for these tokens; consumers read members and
 * never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the token
 * contract immutable at runtime.
 */
export const MOSAIC_COLS = Object.freeze({
  0: 1, // < 540px: 1 column
  540: 2, // 540–959px: 2 columns
  960: 3, // 960–1279px: 3 columns
  1280: 4, // 1280–1679px: 4 columns
  1680: 5, // 1680–1919px: 5 columns
  1920: 6, // 1920–2559px: 6 columns
  2560: 7, // 2560–3839px: 7 columns
  3840: 8, // 3840–5119px: 8 columns (4K)
  5120: 10, // 5120–7679px: 10 columns (5K)
  7680: 12, // 7680–10239px: 12 columns (8K)
  10240: 14, // ≥ 10240px: 14 columns (10K)
})

/**
 * Legacy stepped column table consumed by calcColsForWidth — predates
 * MOSAIC_COLS (which caps at 14 cols and starts the wide jumps earlier).
 * Kept as data so the function shares `_resolveBreakpoint` instead of a
 * ternary chain; keys are viewport widths, values are column counts.
 */
export const LEGACY_MOSAIC_COLS = Object.freeze({
  0: 1,
  540: 2,
  960: 3,
  1440: 4,
  1920: 5,
  2100: 6,
  2560: 7,
})

/**
 * Mosaic gutter step table (px) — 0 below 640 (edge-to-edge tiles on
 * phones), 13 above. Consumed by calcMosaicGap via `_resolveBreakpoint`.
 */
export const MOSAIC_GAP_STEPS = Object.freeze({
  0: 0,
  640: 13,
})

/**
 * Fibonacci-scaled outer page padding per breakpoint — 13 up to 320,
 * then 21/34/55/89 and 144 at ≥1680. Consumed by calcResponsivePadding
 * via `_resolveBreakpoint`.
 */
export const RESPONSIVE_PADDING_STEPS = Object.freeze({
  0: 13,
  320: 21,
  540: 34,
  768: 55,
  1024: 89,
  1680: 144,
})

/**
 * Frozen layout-math constants — `ASPECT_FALLBACK` is the 16:9 default
 * ratio when CMS rows lack intrinsic size so card heights stay sane.
 */
export const LAYOUT_MATH = Object.freeze({
  ASPECT_FALLBACK: 1.777,
})
