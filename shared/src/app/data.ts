/**
 * @file app/data.ts
 * @description Locale data loading for AppRoot — fetches the APP translation node per locale, fans it out to translations, and caches the loaded lang.
 */

import { CHAR_STRINGS } from '@core/tokens/strings/chars.js'
import { COMPONENT_TAGS } from '@core/tokens/elements/components.js'
import { LANG_MUTATIONS, UI_MUTATIONS } from '@core/tokens/events/mutations.js'
import { DB_PATHS } from '@core/tokens/routes/paths.js'
import store from '@core/store.js'
import { fetchFirebaseDb } from '@core/utils/data/db.js'
import type { DbSnapshot } from '@core/utils/data/db.js'
import type { AppNavEl, AppTranslations, CookieBannerEl, PrefModalEl } from './types.js'
import type { AppRoot } from '../App.js'
import { devError } from '@core/devlog.js'

/**
 * Loads app data.
 * @param c — the component
 */
export function loadAppData(c: AppRoot): void {
  const currentLocale = store.getters.getLang()
  if (c._loadedLang && c._loadedLang !== currentLocale) {
    c.translations = null
  }
  c._loadedLang = currentLocale
  const dbpath = store.getters.getlang().database + currentLocale

  const promises: Promise<DbSnapshot | void>[] = []

  const applyApp = (snapshot: DbSnapshot) => {
    if (!snapshot.exists()) return

    c.translations = snapshot.val() as AppTranslations
    store.commit(LANG_MUTATIONS.SET_APP_LANG, c.translations)
    store.commit(UI_MUTATIONS.SET_CLICK_OR_TAP, {
      click: c.translations.actions?.click,
      tap: c.translations.actions?.tap,
    })
    const nav = c.$<AppNavEl>(COMPONENT_TAGS.APP_NAV)
    if (nav) nav.translations = c.translations
    const cookie = c.$<CookieBannerEl>(COMPONENT_TAGS.COOKIE_BANNER)
    if (cookie) cookie.translations = c.translations
    const pref = c.$<PrefModalEl>(COMPONENT_TAGS.PREFERENCES_MODAL)
    if (pref) pref.pref = c.translations.pref

    if (c.translations.carousel) {
      store.commit(LANG_MUTATIONS.SET_CAROUSEL_LANG, c.translations.carousel)
    }

    if (c.translations.statsHud) {
      store.commit(LANG_MUTATIONS.SET_STATS_HUD_LANG, c.translations.statsHud)
    }
  }

  const applyComponents = (snapshot: DbSnapshot) => {
    if (snapshot.exists()) store.commit(LANG_MUTATIONS.SET_COMPONENT_LANG, snapshot.val())
  }

  const applySlugs = (snapshot: DbSnapshot) => {
    if (snapshot.exists()) store.commit(LANG_MUTATIONS.SET_SLUGS_LANG, snapshot.val())
  }

  // Static-first: snapshot data renders now, live CMS edits re-apply via onUpdate
  if (!c.translations) {
    promises.push(fetchFirebaseDb(`${dbpath}${CHAR_STRINGS.SLASH}APP`, applyApp).then(applyApp))
  }

  if (!store.getters.getlang()?.slugs) {
    promises.push(fetchFirebaseDb(`${dbpath}${DB_PATHS.SLUGS}`, applySlugs).then(applySlugs))
  }

  if (!store.getters.getlang()?.components) {
    promises.push(
      fetchFirebaseDb(`${dbpath}${DB_PATHS.COMPONENTS}`, applyComponents).then(applyComponents)
    )
  }

  Promise.all(promises).catch(devError)
}
