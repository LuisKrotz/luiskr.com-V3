/**
 * @file routes/views/project/layout.ts
 * @description Layout helpers for ViewProject — per-section height from the first media ratio, text stagger delays, and the landscape-group detector that forces carousel mode.
 */

import { STATE_STRINGS } from '@core/tokens/strings/state.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'
import { calcDrawTextDelay, calcDrawTextOffset } from '@core/utils/wasm/wasm-layout.js'
import { stripHtml } from '@core/utils/index.js'
import type { ViewProject } from './Project.js'
import type { ProjectMediaItem, SectionChild } from './types.js'
import { CAROUSEL_LAYOUT } from '@core/tokens/motion/carousel.js'
import { DRAW_TIMINGS } from '@core/tokens/media/dimensions.js'

/**
 * Per-section CSS height: the FIRST media item's intrinsic ratio applied
 * to the viewport width — min(100vw·h/w, SKELETON_ITEM_HEIGHT). Emitting
 * the height before decode means the section never reflows when media
 * arrives. Sections without a sized media array fall back to the fixed
 * skeleton height. `toFixed(4)` keeps the calc string compact while
 * preserving sub-pixel accuracy.
 * @param c The ViewProject instance (unused — part of the method facade).
 * @param section One section's children; the media array is detected by shape.
 * @returns A CSS `min()` height expression.
 */
export function sectionItemHeight(c: ViewProject, section: SectionChild[]): string {
  const media = section.find(
    (child) => Array.isArray(child) && typeof child[0] === TYPE_STRINGS.OBJECT
  ) as ProjectMediaItem[] | undefined

  const size = media?.[0]?.size

  if (!size || !size[0] || !size[1]) return CAROUSEL_LAYOUT.SKELETON_ITEM_HEIGHT

  const ratio = (size[1] / size[0]).toFixed(4)

  return `min(calc(100vw * ${ratio}), ${CAROUSEL_LAYOUT.SKELETON_ITEM_HEIGHT})`
}

/**
 * Per-char draw delay for a section's text run: counts REAL characters
 * (HTML stripped — tags don't consume stagger time), then sizes the
 * interval so the whole run lands inside DRAW_TARGET_MS. Non-array input
 * gets the fallback delay so malformed CMS data still animates.
 * @param c The ViewProject instance (unused — facade signature).
 * @param items Section text items (expected string[]).
 * @returns Per-char delay in ms.
 */
export function textDelay(c: ViewProject, items: unknown): number {
  if (!Array.isArray(items)) return DRAW_TIMINGS.DRAW_FALLBACK_DELAY

  const list = items as string[]

  const totalChars =
    list.reduce((sum, str) => {
      return sum + stripHtml(str).length
    }, 0) || 1

  return calcDrawTextDelay(totalChars, DRAW_TIMINGS.DRAW_TARGET_MS)
}

/**
 * Start offset for the text run at index `idx`: cumulative real chars of
 * the preceding items × the per-char delay, plus the per-index step — so
 * sequential sections cascade rather than all starting at t=0.
 * @param c The ViewProject instance — supplies textDelay via the facade.
 * @param items Section text items (expected string[]).
 * @param idx Index of this item in the section.
 * @returns Start offset in ms (0 for non-array input).
 */
export function textOffset(c: ViewProject, items: unknown, idx: number): number {
  if (!Array.isArray(items)) return 0

  const list = items as string[]

  const delay = c.textDelay(list)

  let charsBefore = 0

  for (let i = 0; i < idx; i++) {
    charsBefore += stripHtml(list[i]).length
  }

  return calcDrawTextOffset(idx, charsBefore, delay)
}

/**
 * Whether a media group is all-landscape — those can't pair side-by-side
 * in the two-up layout, so they force the carousel into scroll mode.
 * @param c The ViewProject instance (unused — facade signature).
 * @param group A media item array (shape-checked, not trusted).
 * @returns true when every item is landscape and the group is non-empty.
 */
export function isLandscapeGroup(c: ViewProject, group: unknown): boolean {
  return (
    Array.isArray(group) &&
    group.length >= 1 &&
    group.every((i) => i?.class === STATE_STRINGS.LANDSCAPE)
  )
}
