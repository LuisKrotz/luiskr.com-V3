/**
 * @file projects/sections.ts — section model normalization + CRUD helpers.
 */

import type { CmsProjectsList } from './CmsProjectsList.js'
import { newMediaSlot, type CmsMediaItem, type CmsSection } from './types.js'

/**
 * Normalizes section.
 * @param s — the source value
 * @returns CmsSection
 */
export function normalizeSection(s: unknown): CmsSection {
  if (Array.isArray(s)) {
    const texts = (Array.isArray(s[0]) ? s[0] : []) as string[]
    const media = (Array.isArray(s[1]) ? s[1] : []) as CmsMediaItem[]
    return [texts, media]
  }
  if (s && typeof s === 'object') {
    const obj = s as { texts?: unknown; media?: unknown }
    const texts = (Array.isArray(obj.texts) ? obj.texts : []) as string[]
    const media = (Array.isArray(obj.media) ? obj.media : []) as CmsMediaItem[]
    return [texts, media]
  }
  return [[], []]
}

/**
 * Ensures section shape.
 * @param host — the host component
 * @param sIdx — the value
 */
export function ensureSectionShape(host: CmsProjectsList, sIdx: number) {
  if (!host.currentProject) return
  host.currentProject.sections[sIdx] = normalizeSection(host.currentProject.sections[sIdx])
}

/**
 * Adds section.
 * @param host — the host component
 */
export function addSection(host: CmsProjectsList) {
  if (!host.currentProject) return
  if (!Array.isArray(host.currentProject.sections)) host.currentProject.sections = []
  host.currentProject.sections.push([[''], []])
  host._updateDom()
  host._bindEvents()
}

/**
 * Removes section.
 * @param host — the host component
 * @param sIdx — the value
 */
export function removeSection(host: CmsProjectsList, sIdx: number) {
  if (!host.currentProject) return
  if (!confirm(`Delete Section #${sIdx + 1}?`)) return
  host.currentProject.sections.splice(sIdx, 1)
  host._updateDom()
  host._bindEvents()
}

/**
 * Moves section.
 * @param host — the host component
 * @param sIdx — the value
 * @param dir — the value
 */
export function moveSection(host: CmsProjectsList, sIdx: number, dir: number) {
  if (!host.currentProject) return
  const secs = host.currentProject.sections
  const target = sIdx + dir
  if (target < 0 || target >= secs.length) return
  ;[secs[sIdx], secs[target]] = [secs[target], secs[sIdx]]
  host._updateDom()
  host._bindEvents()
}

/**
 * Adds section text.
 * @param host — the host component
 * @param sIdx — the value
 */
export function addSectionText(host: CmsProjectsList, sIdx: number) {
  if (!host.currentProject) return
  host._ensureSectionShape(sIdx)
  host.currentProject.sections[sIdx][0].push('')
  host._updateDom()
  host._bindEvents()
}

/**
 * Removes section text.
 * @param host — the host component
 * @param sIdx — the value
 * @param tIdx — the value
 */
export function removeSectionText(host: CmsProjectsList, sIdx: number, tIdx: number) {
  if (!host.currentProject) return
  host.currentProject.sections[sIdx][0].splice(tIdx, 1)
  host._updateDom()
  host._bindEvents()
}

/**
 * Adds section media.
 * @param host — the host component
 * @param sIdx — the value
 */
export function addSectionMedia(host: CmsProjectsList, sIdx: number) {
  if (!host.currentProject) return
  host._ensureSectionShape(sIdx)
  host.currentProject.sections[sIdx][1].push(newMediaSlot())
  host._updateDom()
  host._bindEvents()
}

/**
 * Removes section media.
 * @param host — the host component
 * @param sIdx — the value
 * @param mIdx — the value
 */
export function removeSectionMedia(host: CmsProjectsList, sIdx: number, mIdx: number) {
  if (!host.currentProject) return
  host.currentProject.sections[sIdx][1].splice(mIdx, 1)
  host._updateDom()
  host._bindEvents()
}
