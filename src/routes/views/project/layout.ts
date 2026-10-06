/**
 * @file routes/views/project/layout.ts
 * @description Layout helpers for ViewProject — per-section height from the first media ratio, text stagger delays, and the landscape-group detector that forces carousel mode.
 */

import { STATE_STRINGS } from '@/core/tokens/strings/state.js'
import { TYPE_STRINGS } from '@/core/tokens/strings/types.js'
import { calcDrawTextDelay, calcDrawTextOffset } from '@/utils/wasm/wasm-layout.js'
import { stripHtml } from '@/core/utils/index.js'
import type { ViewProject } from './Project.js'
import type { ProjectMediaItem, SectionChild } from './types.js'
import { CAROUSEL_LAYOUT } from '@/core/tokens/motion/carousel.js'

/**
 * The sectionItemHeight value.
 * @param c — the component
 * @param section — the value
 * @returns string
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
 * The textDelay value.
 * @param c — the component
 * @param items — the items
 * @returns number
 */
export function textDelay(c: ViewProject, items: unknown): number {
  if (!Array.isArray(items)) return 14

  const list = items as string[]

  const totalChars =
    list.reduce((sum, str) => {
      return sum + stripHtml(str).length
    }, 0) || 1

  return calcDrawTextDelay(totalChars, 1500)
}

/**
 * The textOffset value.
 * @param c — the component
 * @param items — the items
 * @param idx — the index
 * @returns number
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
 * Returns whether landscape group.
 * @param c — the component
 * @param group — the group
 * @returns boolean
 */
export function isLandscapeGroup(c: ViewProject, group: unknown): boolean {
  return (
    Array.isArray(group) &&
    group.length >= 1 &&
    group.every((i) => i?.class === STATE_STRINGS.LANDSCAPE)
  )
}
