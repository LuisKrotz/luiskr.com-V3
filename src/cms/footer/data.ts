/**
 * @file cms/footer/data.ts — Firebase read/write for the footer editor:
 * the three-node load, the save, and the two cross-locale syncs
 * (line-1 channels; socials + disclaimer).
 */

import { getDbInstance } from '@/firebase.js'
import { ref, child, get, set } from 'firebase/database'
import { DB_PATHS } from '@/core/tokens/routes/paths.js'
import { CHAR_STRINGS } from '@/core/tokens/strings/chars.js'
import { NAV_TEXT } from '@/core/tokens/strings/text.js'
import type { CmsFooterEditor } from './CmsFooterEditor.js'

/** Components node path for one locale. */
const nodePath = (lang: string, node: string): string =>
  `${DB_PATHS.TRANSLATIONS}${lang}/components/${node}`

/** Reads the footer nodes for the selected locale. */
export async function loadAllData(host: CmsFooterEditor): Promise<void> {
  try {
    const db = await getDbInstance()

    const [contactSnap, legalSnap, relatedSnap] = await Promise.all([
      get(child(ref(db), nodePath(host.selectedLang, 'contact'))),
      get(child(ref(db), nodePath(host.selectedLang, 'legal-footer'))),
      get(child(ref(db), nodePath(host.selectedLang, 'related'))),
    ])

    host.contactData = contactSnap.exists()
      ? {
          title: contactSnap.val().title || NAV_TEXT.CONTACT,
          line1: Array.isArray(contactSnap.val().line1) ? [...contactSnap.val().line1] : [],
          line2: Array.isArray(contactSnap.val().line2) ? [...contactSnap.val().line2] : [],
        }
      : { title: NAV_TEXT.CONTACT, line1: [], line2: [] }

    host.legalLinks =
      legalSnap.exists() && Array.isArray(legalSnap.val().links) ? [...legalSnap.val().links] : []

    if (relatedSnap.exists()) {
      const rv = relatedSnap.val()

      // Split editable fields from the rest — `rest` round-trips
      // untouched through relatedExtra so projects/path data survives.
      const { title, note, socials, ...rest } = rv

      host.relatedFooter = {
        title: title || NAV_TEXT.RELATED,
        note: note || CHAR_STRINGS.EMPTY,
        socials: Array.isArray(socials) ? [...socials] : [],
      }

      host.relatedExtra = rest
    } else {
      host.relatedFooter = { title: NAV_TEXT.RELATED, note: CHAR_STRINGS.EMPTY, socials: [] }

      host.relatedExtra = {}
    }

    host._updateDom()
  } catch (err) {
    console.error('Error loading footer data:', err)
  }
}

/** Writes the footer model back to Firebase. */
export async function saveAll(host: CmsFooterEditor): Promise<void> {
  host.saving = true

  host._updateDom()

  try {
    const db = await getDbInstance()

    await Promise.all([
      set(ref(db, nodePath(host.selectedLang, 'contact')), host.contactData),
      set(ref(db, nodePath(host.selectedLang, 'legal-footer')), { links: host.legalLinks }),
      set(ref(db, nodePath(host.selectedLang, 'related')), {
        ...host.relatedExtra,
        ...host.relatedFooter,
      }),
    ])

    host._notify(`Footers & Contact for [${host.selectedLang.toUpperCase()}] saved!`)
  } catch (err) {
    alert('Failed to save: ' + ((err as Error).message || err))
  } finally {
    host.saving = false

    host._updateDom()
  }
}

/** Propagates the source/credit line to every locale. */
export async function syncLine1ToAllLangs(host: CmsFooterEditor): Promise<void> {
  if (!confirm(`Apply contact channels (Line 1) to ALL ${host.languages.length} languages?`)) return

  host.syncing = true

  host._updateDom()

  try {
    const db = await getDbInstance()

    for (const lang of host.languages) {
      if (lang === host.selectedLang) continue

      const snap = await get(child(ref(db), nodePath(lang, 'contact')))

      const existing = snap.exists() ? snap.val() : {}

      await set(ref(db, nodePath(lang, 'contact')), {
        ...existing,
        line1: host.contactData.line1,
      })
    }

    host._notify(`Contact channels synced to all ${host.languages.length} languages!`)
  } catch (err) {
    alert('Sync failed: ' + ((err as Error).message || err))
  } finally {
    host.syncing = false

    host._updateDom()
  }
}

/** Propagates the social-channel list to every locale. */
export async function syncSocialsToAllLangs(host: CmsFooterEditor): Promise<void> {
  if (
    !confirm(
      `Apply case study footer socials and disclaimer to ALL ${host.languages.length} languages?`
    )
  )
    return

  host.syncing = true

  host._updateDom()

  try {
    const db = await getDbInstance()

    for (const lang of host.languages) {
      if (lang === host.selectedLang) continue

      const snap = await get(child(ref(db), nodePath(lang, 'related')))

      const existing = snap.exists() ? snap.val() : {}

      await set(ref(db, nodePath(lang, 'related')), {
        ...existing,
        socials: host.relatedFooter.socials,
        note: host.relatedFooter.note,
      })
    }

    host._notify(`Case study footer socials synced to all ${host.languages.length} languages!`)
  } catch (err) {
    alert('Sync failed: ' + ((err as Error).message || err))
  } finally {
    host.syncing = false

    host._updateDom()
  }
}
