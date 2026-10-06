/**
 * @file wasm-layout.ts
 * @description Layout/animation math with a WebAssembly fast path.
 * The shared engine.wasm module is instantiated once at import; every
 * exported calc* function dispatches to its WASM export when available and
 * falls back to the identical JS formula — callers never branch on support.
 * Covers column/grid math, carousel ring/scroll offsets, easing, draw-text
 * timing, and responsive breakpoints.
 */
import { MOSAIC_COLS } from '@/core/tokens/layout/grid.js'
import { TYPE_STRINGS } from '@/core/tokens/strings/types.js'
import { COVER_DIMENSIONS } from '@/core/tokens/media/dimensions.js'

/** The engine.wasm export table — numeric math routines only. */
type WasmExports = Record<string, ((..._args: number[]) => number) | WebAssembly.ExportValue>

const _call = (name: string, ...args: number[]): number | undefined => {
  const fn = wasmInstance?.[name]

  return typeof fn === TYPE_STRINGS.FUNCTION
    ? (fn as (..._a: number[]) => number)(...args)
    : undefined
}

let wasmInstance: WasmExports | null = null

// Instantiate WebAssembly Engine module for high-performance carousel, animations, grid layout & media math
if (typeof window !== TYPE_STRINGS.UNDEFINED && 'WebAssembly' in window) {
  fetch('/wasm/engine.wasm')
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

/** Column pixel width for a grid: total width minus inter-column gaps, divided evenly. */
export function calcColumnWidth(cols: number, width: number, gap: number): number {
  return _call('calc_column_width', cols, width, gap) ?? (width - (cols - 1) * gap) / cols
}

/** Card height for a grid item: column width divided by aspect ratio, plus padding. */
export function calcCardHeight(colWidth: number, aspectRatio: number, padding = 0): number {
  return (
    _call('calc_card_height', colWidth, aspectRatio, padding) ??
    colWidth / (aspectRatio || 1.777) + padding
  )
}

/** Travel distance along the carousel ring for an elapsed fraction of the loop duration. */
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

/** Scroll offset that brings slide `idx` into view, counting per-slide width + gap. */
export function calcCarouselScrollTarget(idx: number, slideWidth: number, gap = 0): number {
  return _call('calc_carousel_scroll_target', idx, slideWidth, gap) ?? idx * (slideWidth + gap)
}

/** easeOutCubic easing — fast start, decelerating stop. */
export function calcEaseOutCubic(t: number): number {
  const wasm = _call('calc_ease_out_cubic', t)

  if (wasm !== undefined) return wasm

  const f = 1 - t

  return 1 - f * f * f
}

/** Per-character draw interval sized so the whole text finishes within targetDurationMs (clamped 1–22ms). */
export function calcDrawTextDelay(totalChars: number, targetDurationMs = 1500): number {
  const wasm = _call('calc_draw_text_delay', totalChars, targetDurationMs)

  if (wasm !== undefined) {
    return Math.max(1, Math.min(22, Math.round(wasm)))
  }

  // Clamp between 1ms (fast, many chars) and 22ms (slow, few chars).
  // Do not clamp above 1ms from below — long texts must animate within the target duration.
  return Math.max(1, Math.min(22, Math.round(targetDurationMs / (totalChars || 1))))
}

/** Start-time offset for character `idx` given the cumulative chars before it and the per-char delay. */
export function calcDrawTextOffset(idx: number, charsBefore: number, delay: number): number {
  return _call('calc_draw_text_offset', idx, charsBefore, delay) ?? charsBefore * delay + idx * 30
}

// Resolve a stepped breakpoint map for a given viewport width.
// Iterates keys in ascending order and returns the value for the last key ≤ vw.
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

/** Home-mosaic column count for a viewport width — stepped breakpoints from 1 to 7 columns. */
export function calcColsForWidth(vw: number): number {
  return vw < 540
    ? 1
    : vw < 960
      ? 2
      : vw < 1440
        ? 3
        : vw < COVER_DIMENSIONS.FHD_WIDTH
          ? 4
          : vw < 2100
            ? 5
            : vw < 2560
              ? 6
              : 7
}

/** Mosaic column count via the MOSAIC_COLS breakpoint map (last key ≤ vw wins). */
export function calcMosaicCols(vw: number): number {
  return _resolveBreakpoint(MOSAIC_COLS, vw, 1)
}

/** Mosaic gutter in px — 0 on small screens (edge-to-edge tiles), 13 above 640px. */
export function calcMosaicGap(vw: number): number {
  if (vw < 640) return 0

  return 13
}

/** Fibonacci-scaled outer page padding per viewport breakpoint (13→144). */
export function calcResponsivePadding(vw: number): number {
  return vw < 320 ? 13 : vw < 540 ? 21 : vw < 768 ? 34 : vw < 1024 ? 55 : vw < 1680 ? 89 : 144
}

/** Height rescaled for a width capped at maxW, preserving aspect ratio. */
export function calcAspectScaled(width: number, height: number, maxW = 1920): number {
  if (!width || width <= maxW) return height

  return Math.round(height * (maxW / width))
}
