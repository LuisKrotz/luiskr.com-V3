/**
 * @file cms/playground-editor/data.ts
 * @description Firebase read/write for <cms-playground-editor>: loads the
 * earth-playground page node (split into ordered label keys + the
 * `defaults` control sub-node) and the per-locale slugs, and writes both
 * back preserving the original key order.
 */

import { CMS_EVENTS } from '@/cms/tokens.js'
import { DB_PATHS } from '@/core/tokens/routes/paths.js'
import { TRANSLATION_KEYS } from '@/core/tokens/routes/translation-keys.js'
import { CHAR_STRINGS } from '@/core/tokens/strings/chars.js'
import { TYPE_STRINGS } from '@/core/tokens/strings/types.js'
import { getDbInstance } from '@/firebase.js'
import { SP_DB_DEFAULT_SEED } from '@/playground/space/controls.js'
import { ref, child, get, set } from 'firebase/database'
import type { CmsPlaygroundEditor } from './CmsPlaygroundEditor.js'

/** Reads the playground + slugs nodes for the selected locale. */
export async function loadAllData(ed: CmsPlaygroundEditor): Promise<void> {
  try {
    const db = await getDbInstance()

    const [epSnap, slugSnap] = await Promise.all([
      get(
        child(
          ref(db),
          `${DB_PATHS.TRANSLATIONS}${ed.selectedLang}${DB_PATHS.PAGES}${TRANSLATION_KEYS.EARTH_PLAYGROUND}`
        )
      ),
      get(child(ref(db), `${DB_PATHS.TRANSLATIONS}${ed.selectedLang}${DB_PATHS.SLUGS}`)),
    ])

    const { defaults, ...labels } = (epSnap.exists() ? epSnap.val() : {}) as Record<string, unknown>

    ed.epData = { ...labels }

    ed.epKeys = Object.keys(ed.epData)

    // Absent DB node → seed the code defaults so the card shows the real
    // shipped values (they exist — the site applies them to every control).
    ed.epDefaults =
      defaults && typeof defaults === TYPE_STRINGS.OBJECT
        ? { ...(defaults as Record<string, unknown>) }
        : { ...SP_DB_DEFAULT_SEED }

    ed.slugs = slugSnap.exists() ? { ...(slugSnap.val() as Record<string, string>) } : {}

    ed._updateDom()
  } catch (err) {
    console.error('Error loading playground data:', err)

    // Same seeding on failure — the defaults still exist, the read failed.
    ed.epDefaults = { ...SP_DB_DEFAULT_SEED }

    ed._updateDom()
  }
}

/** Writes edits back to Firebase. */
export async function saveAll(ed: CmsPlaygroundEditor): Promise<void> {
  ed.saving = true

  ed._updateDom()

  try {
    const db = await getDbInstance()

    // Re-emit labels in the original key order
    const epOut: Record<string, unknown> = {}

    for (const k of ed.epKeys) epOut[k] = ed.epData[k] ?? CHAR_STRINGS.EMPTY

    await Promise.all([
      set(
        ref(
          db,
          `${DB_PATHS.TRANSLATIONS}${ed.selectedLang}${DB_PATHS.PAGES}${TRANSLATION_KEYS.EARTH_PLAYGROUND}`
        ),
        { ...epOut, defaults: { ...ed.epDefaults } }
      ),
      set(ref(db, `${DB_PATHS.TRANSLATIONS}${ed.selectedLang}${DB_PATHS.SLUGS}`), { ...ed.slugs }),
    ])

    ed._notify(`Playground & slugs for [${ed.selectedLang.toUpperCase()}] saved!`)
  } catch (err) {
    alert('Failed to save: ' + ((err as Error).message || err))
  } finally {
    ed.saving = false

    ed._updateDom()
  }
}

/** Adds a new playground label key. */
export function addEpKey(ed: CmsPlaygroundEditor): void {
  const key = prompt('New label key (camelCase, e.g. "bloomStr"):')

  if (!key) return

  const clean = key.trim()

  if (!clean || ed.epKeys.includes(clean)) return

  ed.epKeys.push(clean)

  ed.epData[clean] = CHAR_STRINGS.EMPTY

  ed._updateDom()
}

/** Removes a playground label key. */
export function removeEpKey(ed: CmsPlaygroundEditor, key: string | null): void {
  if (!key) return

  if (!confirm(`Delete label key "${key}"?`)) return

  ed.epKeys = ed.epKeys.filter((k) => k !== key)

  delete ed.epData[key]

  ed._updateDom()
}

/** Fires a cms-notification toast. */
export function notify(ed: CmsPlaygroundEditor, msg: string): void {
  ed.dispatchEvent(
    new CustomEvent(CMS_EVENTS.NOTIFY, { bubbles: true, composed: true, detail: msg })
  )
}
