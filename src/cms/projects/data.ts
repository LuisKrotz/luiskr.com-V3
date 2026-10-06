/**
 * @file projects/data.ts — Firebase load/save/delete for the projects editor.
 */

import { DB_PATHS } from '@/core/tokens/routes/paths.js'
import { getDbInstance } from '@/firebase.js'
import { ref, child, get, set, remove } from 'firebase/database'
import type { CmsProjectsList } from './CmsProjectsList.js'
import { defaultCover } from './types.js'
import { normalizeSection } from './sections.js'
import { devError } from '@/core/devlog.js'

/**
 * Loads project keys.
 * @param host — the host component
 */
export async function loadProjectKeys(host: CmsProjectsList) {
  try {
    const db = await getDbInstance()
    const snap = await get(child(ref(db), `${DB_PATHS.TRANSLATIONS}${host.selectedLang}/projects`))
    if (snap.exists()) {
      const val = snap.val()
      host.projectKeys = Object.keys(val).sort()
      if (!host.selectedProjectKey && host.projectKeys.length > 0) {
        host.selectedProjectKey = host.projectKeys[0]
      }
      await host.loadProjectData()
    } else {
      host.projectKeys = []
      host.currentProject = null
      host._updateDom()
      host._bindEvents()
    }
  } catch (err) {
    devError('Error loading project keys:', err)
  }
}

/**
 * Loads project data.
 * @param host — the host component
 */
export async function loadProjectData(host: CmsProjectsList) {
  if (!host.selectedProjectKey) return
  try {
    const db = await getDbInstance()
    const snap = await get(
      child(
        ref(db),
        `${DB_PATHS.TRANSLATIONS}${host.selectedLang}/projects/${host.selectedProjectKey}`
      )
    )
    if (snap.exists()) {
      const val = snap.val()
      const rawSections = Array.isArray(val.sections)
        ? val.sections
        : Object.values(val.sections || {})

      host.currentProject = {
        title: val.title || '',
        folder: val.folder || '',
        seo: val.seo || { noIndex: false },
        cover: val.cover || defaultCover(),
        sections: rawSections.map((s: unknown) => normalizeSection(s)),
      }
    } else {
      host.currentProject = null
    }
    host._updateDom()
    host._bindEvents()
  } catch (err) {
    devError('Error loading project data:', err)
  }
}

/**
 * Creates project prompt.
 * @param host — the host component
 */
export function createProjectPrompt(host: CmsProjectsList) {
  const key = prompt('Enter project identifier slug (e.g. "metcha", "melissa"):')
  if (!key) return
  const cleanKey = key
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9_-]/g, '')
  if (host.projectKeys.includes(cleanKey)) {
    alert('Project already exists!')
    return
  }
  host.projectKeys.push(cleanKey)
  host.selectedProjectKey = cleanKey
  host.currentProject = {
    title: cleanKey.toUpperCase(),
    folder: `${cleanKey}/`,
    seo: { noIndex: false },
    cover: defaultCover(`${cleanKey.toUpperCase()} Cover`),
    sections: [],
  }
  host._updateDom()
  host._bindEvents()
}

/**
 * Deletes project.
 * @param host — the host component
 */
export async function deleteProject(host: CmsProjectsList) {
  if (!host.selectedProjectKey) return
  if (!confirm(`Delete project "${host.selectedProjectKey}" across ALL languages?`)) return
  host.saving = true
  try {
    const db = await getDbInstance()
    for (const lang of host.languages) {
      await remove(ref(db, `${DB_PATHS.TRANSLATIONS}${lang}/projects/${host.selectedProjectKey}`))
    }
    host.selectedProjectKey = ''
    host.currentProject = null
    await host.loadProjectKeys()
    host._notify('Project deleted across all languages.')
  } catch (err) {
    alert('Failed to delete project: ' + ((err as Error).message || err))
  } finally {
    host.saving = false
    host._updateDom()
    host._bindEvents()
  }
}

/**
 * Saves project data.
 * @param host — the host component
 */
export async function saveProjectData(host: CmsProjectsList) {
  if (!host.selectedProjectKey || !host.currentProject) return
  host.saving = true
  host._updateDom()
  try {
    const db = await getDbInstance()
    await set(
      ref(db, `${DB_PATHS.TRANSLATIONS}${host.selectedLang}/projects/${host.selectedProjectKey}`),
      host.currentProject
    )
    host._notify(`Project [${host.selectedProjectKey.toUpperCase()}] saved!`)
  } catch (err) {
    alert('Failed to save project: ' + ((err as Error).message || err))
  } finally {
    host.saving = false
    host._updateDom()
    host._bindEvents()
  }
}
