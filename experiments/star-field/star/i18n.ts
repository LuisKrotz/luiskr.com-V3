/**
 * @file star/i18n.ts
 * @description Locale handling for StarField — fetches the
 * translations/<loc>/pages/star-field node (falling back to English when
 * the locale node is absent) and hands the label map to the component;
 * the baked FALLBACK_PAGES snapshot covers the pre-fetch window.
 */
import { LOCALES } from '@core/tokens/locales.js'
import { TRANSLATION_KEYS } from '@core/tokens/routes/translation-keys.js'
import store from '@core/store.js'
import { fetchFirebaseDb } from '@core/utils/data/db.js'
import type { StarField } from '../StarField.js'
import { devError } from '@core/devlog.js'

/**
 * Loads the star-field label node for the current locale via SWR — on a
 * locale miss the English node is fetched as the fallback.
 * @param c The StarField component.
 */
export function loadStarTranslations(c: StarField): void {
  const lang = store.getters.getlang()

  const currentLocale = lang?.locale || LOCALES.EN

  c._lastLocale = currentLocale

  const dbpath = `${lang.database}${currentLocale}${lang.pagesPath}${TRANSLATION_KEYS.STAR_FIELD}`

  fetchFirebaseDb(dbpath)
    .then((snapshot) => {
      if (snapshot?.exists()) {
        c._applyTranslations(snapshot.val() as Record<string, unknown>)
      } else {
        const fallbackPath = `${lang.database}${LOCALES.EN}${lang.pagesPath}${TRANSLATION_KEYS.STAR_FIELD}`

        fetchFirebaseDb(fallbackPath).then((fallbackSnap) => {
          if (fallbackSnap?.exists()) {
            c._applyTranslations(fallbackSnap.val() as Record<string, unknown>)
          }
        })
      }
    })
    .catch(devError)
}

/**
 * Applies the fetched label map and re-renders — dossier content stays
 * untouched (body facts ship in the per-body JSONs, not the DB).
 * @param c The StarField component.
 * @param val The pages/star-field translation node.
 */
export function applyStarTranslations(
  c: StarField,
  val: Record<string, unknown> | null | undefined
): void {
  c.translations = val ?? null

  c._updateDom()
}
