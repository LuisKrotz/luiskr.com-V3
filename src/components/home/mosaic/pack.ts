/**
 * @file home/mosaic-pack.ts
 * @description Masonry packing engine for <home-mosaic>, extracted from
 * HomeMosaic.tsx. Pure geometry: given the viewport width and per-item
 * expanded-bottom heights it returns each card's absolute-positioned
 * style objects and the packed wall height — shared verbatim by
 * quickLayout (sync), layout (WASM-assisted) and the skeleton packer.
 *
 * Packing geometry per item:
 *   span   = 2 cols for featured items (1 col on single-column layouts)
 *   itemW  = span·colW + (span−1)·gap — a span-2 tile covers one gap too
 *   imageH = itemW × aspect multiplier (FEAT_MULT or the cycling ratio)
 *   bottomH= measured details height when expanded, else 0 — the card
 *            GROWS the wall (masonry reflow) rather than overlaying
 *   left   = bestCol·(colW+gap); top = peak of the covered columns
 */
import { COMMON_ATTRS } from '@/core/tokens/attrs/common.js'
import { LAYOUT } from '@/core/tokens/layout/masonry.js'
import { STATE_STRINGS } from '@/core/tokens/strings/state.js'
import { CHAR_STRINGS } from '@/core/tokens/strings/chars.js'
import { SKELETON_MOSAIC } from '@/core/tokens/motion/skeleton.js'
import {
  calcColumnWidth,
  calcColsForWidth,
  calcResponsivePadding,
} from '@/utils/wasm/wasm-layout.js'

// LAYOUT tokens that shape the wall: FEAT_MULT = featured-tile aspect ratio
// (height = span-2 width × multiplier), COMP_MULTS = per-index aspect cycle
// for regular tiles (i % length → a varied rhythm instead of a uniform
// grid), GAP_PX = the fixed gap between cards/columns.
const { FEAT_MULT, COMP_MULTS, GAP: GAP_PX } = LAYOUT

/**
 * Type contract for MosaicItem — the shape consumers rely on.
 */
export interface MosaicItem {
  link?: string
  image?: string
  label?: string
  title?: string
  description?: string
  featured?: boolean
}

/**
 * Type contract for MosaicCardStyle — the shape consumers rely on.
 */
export interface MosaicCardStyle {
  bottomH: number
  card: Record<string, string>
  media: Record<string, string>
  bottom: Record<string, string>
}

/**
 * Type contract for SkeletonBox — the shape consumers rely on.
 */
export interface SkeletonBox {
  top: number
  left: number
  w: number
  h: number
}

/** Column-count + column-width for a viewport width, or null when unusable. */
const mosaicGrid = (vw: number): { N: number; colW: number } | null => {
  const pad = calcResponsivePadding(vw)

  const W = vw - pad * 2

  if (W <= 0) return null

  const N = calcColsForWidth(vw)

  return { N, colW: Math.floor(calcColumnWidth(N, W, GAP_PX)) }
}

/**
 * Lowest-column placement: a span-N tile sits on the tallest column in
 * its footprint; pick the column range whose peak is lowest so the wall
 * stays roughly level instead of column-by-column fill.
 */
const lowestColumnPeak = (colH: number[], span: number): { col: number; top: number } => {
  let best = 0

  let top = Infinity

  for (let c = 0; c <= colH.length - span; c++) {
    let t = 0

    for (let s = 0; s < span; s++) t = Math.max(t, colH[c + s])

    if (t < top) {
      top = t
      best = c
    }
  }

  return { col: best, top }
}

/** Style objects for one placed tile (card shell / media / bottom). */
const tileStyles = (
  top: number,
  left: number,
  itemW: number,
  imageH: number,
  bottomH: number
): MosaicCardStyle => ({
  bottomH,
  card: {
    position: STATE_STRINGS.ABSOLUTE,
    top: `${top}${COMMON_ATTRS.PX}`,
    left: `${left}${COMMON_ATTRS.PX}`,
    width: `${itemW}${COMMON_ATTRS.PX}`,
    height: `${imageH + bottomH}${COMMON_ATTRS.PX}`,
    overflow: STATE_STRINGS.HIDDEN,
  },
  media: {
    position: STATE_STRINGS.RELATIVE,
    width: CHAR_STRINGS.PERCENT_100,
    height: `${imageH}${COMMON_ATTRS.PX}`,
    overflow: STATE_STRINGS.HIDDEN,
    flexShrink: CHAR_STRINGS.ZERO,
  },
  bottom: {
    width: CHAR_STRINGS.PERCENT_100,
    height: `${bottomH}${COMMON_ATTRS.PX}`,
    overflow: STATE_STRINGS.HIDDEN,
  },
})

/**
 * Full packing pass: returns per-card style objects + packed height.
 * `bottomHFor(i)` supplies the expanded details height (0 when closed).
 */
export const computeMosaicLayout = (
  vw: number,
  items: MosaicItem[],
  bottomHFor: (_i: number) => number
): { cards: MosaicCardStyle[]; height: number } | null => {
  const grid = mosaicGrid(vw)

  if (!grid || !items.length) return null

  const { N, colW } = grid

  const colH: number[] = Array(N).fill(0)

  const cards = items.map((item, i) => {
    const bottomH = bottomHFor(i)

    const span = item.featured && N > 1 ? 2 : 1
    const itemW = span * colW + (span - 1) * GAP_PX
    const mult = item.featured ? FEAT_MULT : COMP_MULTS[i % COMP_MULTS.length]
    const imageH = Math.round(itemW * mult)

    const { col: bestCol, top } = lowestColumnPeak(colH, span)

    const left = bestCol * (colW + GAP_PX)

    for (let s = 0; s < span; s++) colH[bestCol + s] = top + imageH + bottomH + GAP_PX

    return tileStyles(top, left, itemW, imageH, bottomH)
  })

  // Subtract the trailing gap so the container hugs the last tile.
  return { cards, height: Math.max(...colH) - GAP_PX }
}

/**
 * Skeleton variant: packs placeholder tiles (no items needed — featured
 * count + aspect cycle come from SKELETON/LAYOUT tokens) so the loading
 * wall matches the real geometry.
 */
export const packMosaicSkeleton = (vw: number): { boxes: SkeletonBox[]; height: number } => {
  const grid = mosaicGrid(vw)

  if (!grid) return { boxes: [], height: 0 }

  const { N, colW } = grid

  const colH: number[] = Array(N).fill(0)

  const boxes: SkeletonBox[] = []

  for (let i = 0; i < SKELETON_MOSAIC.MOSAIC_TILES; i++) {
    const featured = i < SKELETON_MOSAIC.MOSAIC_FEATURED && N > 1
    const span = featured ? 2 : 1
    const itemW = span * colW + (span - 1) * GAP_PX
    const imageH = Math.round(itemW * (featured ? FEAT_MULT : COMP_MULTS[i % COMP_MULTS.length]))

    const { col: best, top } = lowestColumnPeak(colH, span)

    const left = best * (colW + GAP_PX)

    for (let s = 0; s < span; s++) colH[best + s] = top + imageH + GAP_PX

    boxes.push({ top, left, w: itemW, h: imageH })
  }

  return { boxes, height: Math.max(...colH) - GAP_PX }
}
