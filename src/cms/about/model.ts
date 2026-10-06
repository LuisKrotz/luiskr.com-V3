/**
 * @file about/model.ts — about model mutations (paragraphs, mentions, gravatar).
 */

import type { CmsAboutEditor } from './CmsAboutEditor.js'
import { emailToGravatarHash, type BioColumn } from './types.js'

/**
 * Sets gravatar size.
 * @param host — the host component
 * @param size — the value
 */
export function setGravatarSize(host: CmsAboutEditor, size: number): void {
  host.gravatarSize = size
  const base = host.aboutData.profilePicture.replace(/[?&]s=\d+/, '').replace(/\?$/, '')
  host.aboutData.profilePicture = base + `?s=${size}`
  host._updateDom()
}

/**
 * Generates gravatar url.
 * @param host — the host component
 */
export async function generateGravatarUrl(host: CmsAboutEditor) {
  if (!host.emailInput.trim()) return
  const hash = await emailToGravatarHash(host.emailInput)
  host.aboutData.profilePicture = `https://www.gravatar.com/avatar/${hash}?s=${host.gravatarSize}`
  host._updateDom()
}

/**
 * Adds paragraph.
 * @param host — the host component
 * @param col — the value
 */
export function addParagraph(host: CmsAboutEditor, col: BioColumn): void {
  host.aboutData[col] = [...(host.aboutData[col] || []), '']
  host._updateDom()
}

/**
 * Removes paragraph.
 * @param host — the host component
 * @param col — the value
 * @param idx — the index
 */
export function removeParagraph(host: CmsAboutEditor, col: BioColumn, idx: number): void {
  host.aboutData[col] = host.aboutData[col].filter((_, i) => i !== idx)
  host._updateDom()
}

/**
 * Moves paragraph.
 */
export function moveParagraph(
  host: CmsAboutEditor,
  col: BioColumn,
  idx: number,
  dir: number
): void {
  const arr = [...host.aboutData[col]]
  const target = idx + dir
  if (target < 0 || target >= arr.length) return
  ;[arr[idx], arr[target]] = [arr[target], arr[idx]]
  host.aboutData[col] = arr
  host._updateDom()
}

/**
 * Adds mention item.
 * @param host — the host component
 */
export function addMentionItem(host: CmsAboutEditor) {
  host.aboutData.mention_items = [
    ...(host.aboutData.mention_items || []),
    { description: '', link: '', icon: '' },
  ]
  host._updateDom()
}

/**
 * Removes mention item.
 * @param host — the host component
 * @param idx — the index
 */
export function removeMentionItem(host: CmsAboutEditor, idx: number): void {
  host.aboutData.mention_items = host.aboutData.mention_items.filter((_, i) => i !== idx)
  host._updateDom()
}

/**
 * Moves mention item.
 * @param host — the host component
 * @param idx — the index
 * @param dir — the value
 */
export function moveMentionItem(host: CmsAboutEditor, idx: number, dir: number): void {
  const arr = [...(host.aboutData.mention_items || [])]
  const target = idx + dir
  if (target < 0 || target >= arr.length) return
  ;[arr[idx], arr[target]] = [arr[target], arr[idx]]
  host.aboutData.mention_items = arr
  host._updateDom()
}
