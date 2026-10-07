/**
 * @file wasm-layout.ts
 * @description Layout/animation math with a WebAssembly fast path.
 * The shared engine.wasm module is instantiated once at import; every
 * exported calc* function dispatches to its WASM export when available and
 * falls back to the identical JS formula — callers never branch on support.
 * Covers column/grid math, carousel ring/scroll offsets, easing, draw-text
 * timing, and responsive breakpoints.
 */
import {
  LEGACY_MOSAIC_COLS,
  LAYOUT_MATH,
  MOSAIC_COLS,
  MOSAIC_GAP_STEPS,
  RESPONSIVE_PADDING_STEPS,
} from '@/core/tokens/layout/grid.js'
import { TYPE_STRINGS } from '@/core/tokens/strings/types.js'
import { COVER_DIMENSIONS, DRAW_TIMINGS } from '@/core/tokens/media/dimensions.js'
import { WASM_POOL } from '@/core/tokens/data/wasm.js'

/** The engine.wasm export table — numeric math routines only. */
type WasmExports = Record<string, ((..._args: number[]) => number) | WebAssembly.ExportValue>

/**
 * Dispatches to a WASM export when the instance is live and the export is
 * callable; returns undefined otherwise so callers fall back to the JS
 * formula inline (the `?? js` idiom below).
 * @param name Export name on the engine.wasm module.
 * @param args Numeric arguments — engine routines are number-only.
 * @returns The WASM result, or undefined when unavailable.
 */
const _call = (name: string, ...args: number[]): number | undefined => {
  const fn = wasmInstance?.[name]

  return typeof fn === TYPE_STRINGS.FUNCTION
    ? (fn as (..._a: number[]) => number)(...args)
    : undefined
}

/** Instantiated engine.wasm export table — null until (and unless) the async instantiate resolves. */
let wasmInstance: WasmExports | null = null

// Instantiate WebAssembly Engine module for high-performance carousel, animations, grid layout & media math
if (typeof window !== TYPE_STRINGS.UNDEFINED && 'WebAssembly' in window) {
  fetch(WASM_POOL.ENGINE_URL)
    .then((res) => {
      if (!res.ok) throw new Error('WASM load error')

      return res.arrayBuffer()
    })
    .then((bytes) => WebAssembly.instantiate(bytes))
    .then(({ instance }) => {
      wasmInstance = instance.exports as WasmExports
    })
    .catch(() => {
      // Fallback
    })
}

/**
 * Column pixel width for a grid: total width minus inter-column gaps,
 * divided evenly. Formula: (width − (cols−1)·gap) / cols.
 * @param cols Column count.
 * @param width Available grid width in px.
 * @param gap Inter-column gutter in px.
 * @returns Per-column width in px.
 */
export function calcColumnWidth(cols: number, width: number, gap: number): number {
  return _call('calc_column_width', cols, width, gap) ?? (width - (cols - 1) * gap) / cols
}

/**
 * Card height for a grid item: column width divided by aspect ratio, plus
 * padding. A missing/zero ratio falls back to 16:9 so unsized CMS rows
 * can't produce NaN or zero-height cards.
 * @param colWidth The column's width in px.
 * @param aspectRatio width/height of the media.
 * @param padding Extra vertical padding in px.
 * @returns Card height in px.
 */
export function calcCardHeight(colWidth: number, aspectRatio: number, padding = 0): number {
  return (
    _call('calc_card_height', colWidth, aspectRatio, padding) ??
    colWidth / (aspectRatio || LAYOUT_MATH.ASPECT_FALLBACK) + padding
  )
}

/**
 * Travel distance along the carousel ring for an elapsed fraction of the
 * loop duration: (elapsed/duration)·circumference — the stroke-dashoffset
 * driver for the autoplay progress ring.
 * @param elapsed Milliseconds into the current autoplay cycle.
 * @param duration Full cycle duration in ms.
 * @param circumference Ring's 2πr stroke length in px.
 * @returns Offset in px along the ring.
 */
export function calcCarouselRingOffset(
  elapsed: number,
  duration: number,
  circumference: number
): number {
  return (
    _call('calc_carousel_ring_offset', elapsed, duration, circumference) ??
    (elapsed / duration) * circumference
  )
}

/**
 * Scroll offset that brings slide `idx` into view, counting per-slide
 * width + gap: idx·(slideWidth+gap).
 * @param idx Slide index.
 * @param slideWidth Rendered slide width in px.
 * @param gap Inter-slide gap in px.
 * @returns scrollLeft target in px.
 */
export function calcCarouselScrollTarget(idx: number, slideWidth: number, gap = 0): number {
  return _call('calc_carousel_scroll_target', idx, slideWidth, gap) ?? idx * (slideWidth + gap)
}

/**
 * easeOutCubic easing — 1−(1−t)³: fast start, decelerating stop. Used for
 * menu/carousel transitions where motion should settle, not bounce.
 * @param t Progress fraction 0–1.
 * @returns Eased progress 0–1.
 */
export function calcEaseOutCubic(t: number): number {
  const wasm = _call('calc_ease_out_cubic', t)

  if (wasm !== undefined) return wasm

  const f = 1 - t

  return 1 - f * f * f
}

/**
 * Per-character draw interval sized so the whole text finishes within
 * targetDurationMs — targetDurationMs/totalChars, clamped between
 * DRAW_DELAY_MIN_MS (long texts still complete on time) and
 * DRAW_DELAY_MAX_MS (short texts don't stall). Rounded so the CSS delay
 * stays integer milliseconds.
 * @param totalChars Total character count across the text run.
 * @param targetDurationMs Budget for the whole stagger, in ms.
 * @returns Per-char delay in ms.
 */
export function calcDrawTextDelay(
  totalChars: number,
  targetDurationMs: number = DRAW_TIMINGS.DRAW_TARGET_MS
): number {
  const wasm = _call('calc_draw_text_delay', totalChars, targetDurationMs)

  if (wasm !== undefined) {
    return Math.max(
      DRAW_TIMINGS.DRAW_DELAY_MIN_MS,
      Math.min(DRAW_TIMINGS.DRAW_DELAY_MAX_MS, Math.round(wasm))
    )
  }

  // Clamp between 1ms (fast, many chars) and 22ms (slow, few chars).
  // Do not clamp above 1ms from below — long texts must animate within the target duration.
  return Math.max(
    DRAW_TIMINGS.DRAW_DELAY_MIN_MS,
    Math.min(DRAW_TIMINGS.DRAW_DELAY_MAX_MS, Math.round(targetDurationMs / (totalChars || 1)))
  )
}

/**
 * Start-time offset for character `idx`: charsBefore·delay staggers it
 * after the preceding run, plus idx·DRAW_INDEX_STEP_MS so later items in
 * a list cascade even at equal char counts.
 * @param idx Index of this item/word in the sequence.
 * @param charsBefore Cumulative characters before this item.
 * @param delay Per-char delay from calcDrawTextDelay.
 * @returns Start offset in ms.
 */
export function calcDrawTextOffset(idx: number, charsBefore: number, delay: number): number {
  return (
    _call('calc_draw_text_offset', idx, charsBefore, delay) ??
    charsBefore * delay + idx * DRAW_TIMINGS.DRAW_INDEX_STEP_MS
  )
}

/**
 * Ordered-queue offset for document-wide cascades: `scheduledMs` is the
 * cumulative reveal duration of every item that precedes this one across
 * the whole document (a shared clock position, not a character count), so
 * the draw-text elements animate strictly in reading order even when
 * several enter the viewport in the same frame. Reuses the
 * calc_draw_text_offset op with delay=1 — scheduledMs is already in ms —
 * plus idx·DRAW_INDEX_STEP_MS so equal-length items still stagger.
 * @param idx Global index of this item in the document's reveal order.
 * @param scheduledMs Sum of all preceding items' durations in ms.
 * @returns Start offset in ms on the shared clock.
 */
export function calcDrawTextOrderedOffset(idx: number, scheduledMs: number): number {
  return (
    _call('calc_draw_text_offset', idx, scheduledMs, DRAW_TIMINGS.DRAW_DELAY_MIN_MS) ??
    scheduledMs + idx * DRAW_TIMINGS.DRAW_INDEX_STEP_MS
  )
}

/**
 * Resolves a stepped breakpoint map for a viewport width: iterates keys
 * ascending and keeps the value of the last key ≤ vw (a "floor" lookup).
 * Fallback serves widths below the first key.
 * @param map {breakpointPx: value} table — keys are min widths.
 * @param vw Viewport width in px.
 * @param fallback Value below the first key.
 * @returns The resolved step value.
 */
function _resolveBreakpoint(map: Record<number, number>, vw: number, fallback: number): number {
  const keys = Object.keys(map)
    .map(Number)
    .sort((a, b) => a - b)

  let result = fallback

  for (const k of keys) {
    if (vw >= k) result = map[k]
  }

  return result
}

/**
 * Home-mosaic column count for a viewport width — the legacy stepped
 * table (1–7 columns); kept alongside MOSAIC_COLS which callers should
 * prefer for new layout work.
 * @param vw Viewport width in px.
 * @returns Column count 1–7.
 */
export function calcColsForWidth(vw: number): number {
  return _resolveBreakpoint(LEGACY_MOSAIC_COLS, vw, LEGACY_MOSAIC_COLS[0])
}

/**
 * Mosaic column count via the MOSAIC_COLS breakpoint map (last key ≤ vw
 * wins) — scales 1→14 columns from phones to 10K walls.
 * @param vw Viewport width in px.
 * @returns Column count 1–14.
 */
export function calcMosaicCols(vw: number): number {
  return _resolveBreakpoint(MOSAIC_COLS, vw, MOSAIC_COLS[0])
}

/**
 * Mosaic gutter in px — 0 below the gap breakpoint (edge-to-edge tiles on
 * phones), MOSAIC_GAP above.
 * @param vw Viewport width in px.
 * @returns Gutter px.
 */
export function calcMosaicGap(vw: number): number {
  return _resolveBreakpoint(MOSAIC_GAP_STEPS, vw, MOSAIC_GAP_STEPS[0])
}

/**
 * Fibonacci-scaled outer page padding per viewport breakpoint (13→144) —
 * padding grows with screen real estate so content never hugs wide edges.
 * @param vw Viewport width in px.
 * @returns Padding in px.
 */
export function calcResponsivePadding(vw: number): number {
  return _resolveBreakpoint(RESPONSIVE_PADDING_STEPS, vw, RESPONSIVE_PADDING_STEPS[0])
}

/**
 * Height rescaled for a width capped at maxW, preserving aspect ratio:
 * height·(maxW/width) — only shrinks; widths under maxW return height
 * untouched. Rounded so CSS heights stay integer pixels.
 * @param width Intrinsic width.
 * @param height Intrinsic height.
 * @param maxW Width cap (defaults to FHD so 4K masters don't downscale mid-layout).
 * @returns Rescaled height.
 */
export function calcAspectScaled(
  width: number,
  height: number,
  maxW: number = COVER_DIMENSIONS.FHD_WIDTH
): number {
  if (!width || width <= maxW) return height

  return Math.round(height * (maxW / width))
}
