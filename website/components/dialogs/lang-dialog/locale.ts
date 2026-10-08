/**
 * @file lang-dialog/locale.ts — maps the current URL to its equivalent in
 * the new locale:
 *   base = '/<lang>' prefix ('' for English — EN is the canonical root)
 *   known routes rebuild from their localized slug (s.about, s.terms…)
 *   unknown/dynamic routes (project pages) keep the path minus the old
 *   '/xx' locale prefix — the regex strips '/pt', '/es' etc. at the root
 * Store commit re-fetches translations; push() swaps the URL so the
 * browser history holds the localized address (SEO + shareable links).
 */

import { ATTR_VALUES } from '@core/tokens/attrs/values.js'
import { LANG_MUTATIONS } from '@core/tokens/events/mutations.js'
import { LOCALES } from '@core/tokens/locales.js'
import { ROUTE_NAMES, ROUTE_PREFIXES } from '@core/tokens/routes/names.js'
import { ROUTE_PATHS } from '@core/tokens/routes/paths.js'
import store from '@core/store.js'
import router from '@core/router/router.js'
import { routeSlugs } from '@core/locale/ui-text.js'

/** Applies the chosen locale: commits the language + rewrites the URL. */
export function applyLang(newLang: string): void {
  const route = router.currentRoute

  const routeName = route?.name || ATTR_VALUES.EMPTY

  const s = routeSlugs(newLang)

  const base = newLang === LOCALES.EN ? ATTR_VALUES.EMPTY : `${ROUTE_PATHS.ROOT}${newLang}`

  let newPath: string

  if (routeName.startsWith(ROUTE_PREFIXES.HOME)) newPath = `${base}${ROUTE_PATHS.ROOT}`
  else if (routeName.startsWith(ROUTE_PREFIXES.ABOUT))
    newPath = `${base}${ROUTE_PATHS.ROOT}${s.about}`
  else if (routeName.startsWith(ROUTE_PREFIXES.CONTACT))
    newPath = `${base}${ROUTE_PATHS.ROOT}${s.contact}`
  else if (routeName.startsWith(ROUTE_PREFIXES.PRIVACY))
    newPath = `${base}${ROUTE_PATHS.ROOT}${s.privacy}`
  else if (routeName.startsWith(ROUTE_PREFIXES.GDPR))
    newPath = `${base}${ROUTE_PATHS.ROOT}${s.gdpr}`
  else if (routeName.startsWith(ROUTE_PREFIXES.TERMS))
    newPath = `${base}${ROUTE_PATHS.ROOT}${s.terms}`
  else if (routeName === ROUTE_NAMES.EARTH_PLAYGROUND) {
    newPath = `${base}${ROUTE_PATHS.ROOT}${s.earthPlayground || ROUTE_PATHS.EARTH_PLAYGROUND_SEGMENT}`
  } else {
    const rawPath = window.location.pathname.replace(/^\/([a-z]{2,3})(\/|$)/, ROUTE_PATHS.ROOT)

    newPath =
      base + (rawPath.startsWith(ROUTE_PATHS.ROOT) ? rawPath : `${ROUTE_PATHS.ROOT}${rawPath}`)
  }

  store.commit(LANG_MUTATIONS.SET_LANG, newLang)

  router.push(newPath)
}
