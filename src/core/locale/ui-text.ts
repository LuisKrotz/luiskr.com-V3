/**
 * @file ui-text.ts
 * @description Runtime translation accessors: resolve a dotted key against
 * the live Firebase dictionaries in the store, falling back to the bundled
 * English snapshot (FALLBACK_*) when a node or locale hasn't loaded.
 */

import { LOCALES } from '@/core/tokens/locales.js'
import { CHAR_STRINGS } from '@/core/tokens/strings/chars.js'
import store from '@/core/store.js'
import { FALLBACK_APP, FALLBACK_COMPONENTS } from './fallback.js'
import { LANG_SLUGS, type LangSlugMap } from '@/core/i18n.js'

/**
 * Digs a dotted path ('a.b.c') into a possibly-partial object; null-safe.
 * The `cur == null → undefined` guard on each reduce step is what makes
 * missing intermediate nodes safe — `dig({}, 'a.b.c')` returns undefined
 * instead of throwing on the second key read. Translation dictionaries are
 * sparse during boot, so every lookup funnels through here.
 */
const _dig = (obj: unknown, path: string): unknown =>
  path
    .split(CHAR_STRINGS.DOT)
    .reduce<unknown>(
      (cur, key) => (cur == null ? undefined : (cur as Record<string, unknown>)[key]),
      obj
    )

/** Structural view of the live `lang` store slice — the three fetched nodes. */
interface LangSlice {
  app?: Record<string, unknown> | null
  components?: unknown
  slugs?: Record<string, unknown> | null
}

/**
 * Resolves a UI string from the live APP dictionary (store.lang.app, loaded
 * from Firebase for the current locale) with the English snapshot as fallback.
 * @param path  dotted path, e.g. 'media.preview' or 'pref.devTools.showGrid'
 */
export const appText = (path: string): unknown => {
  const live = _dig((store.getters.getlang() as LangSlice | undefined)?.app, path)

  // `??` not `||` — an empty-string translation is a deliberate value, not
  // a miss; only null/undefined (node absent) should fall back to English.
  return live ?? _dig(FALLBACK_APP, path)
}

/** Same lookup for the components dictionary (store.lang.components). */
export const componentText = (path: string): unknown => {
  const live = _dig((store.getters.getlang() as LangSlice | undefined)?.components, path)

  return live ?? _dig(FALLBACK_COMPONENTS, path)
}

/**
 * Route slugs for a locale: CMS-editable overrides (translations/<loc>/slugs,
 * loaded into store.lang.slugs) merged over the build-time LANG_SLUGS defaults.
 * @param lang  locale code, e.g. 'br'
 */
export const routeSlugs = (lang: string): LangSlugMap =>
  ({
    ...(LANG_SLUGS[lang] || LANG_SLUGS[LOCALES.EN]),
    ...((store.getters.getlang() as LangSlice | undefined)?.slugs || {}),
  }) as LangSlugMap
