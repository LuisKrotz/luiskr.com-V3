/**
 * @file i18n.js
 * @description Locale registry and URL-slug tables.
 *
 * LANG_OPTIONS drives the language dialog (label, flag emoji, and the
 * two-letter country codes used to compose split-language flag canvases —
 * e.g. `cc:'es-ga'` for Galicia or cc+cc2 pairs like de/br for Hunsrik).
 * LANG_SLUGS maps each locale to its localized route segments (about,
 * contact, legal pages, playground) used by the router and link builders.
 */
import { LOCALES } from '@core/tokens/locales.js'
import { ROUTE_PATHS } from '@core/tokens/routes/paths.js'
import { CHAR_STRINGS } from '@core/tokens/strings/chars.js'
import { LANG_SLUGS } from './locale/lang-slugs.js'

/**
 * Language picker rows (unfrozen source for LANG_OPTIONS).
 * `cc`/`cc2` are ISO country codes the split-flag renderer paints
 * side-by-side — dialects spanning two cultures get two halves (Hunsrik =
 * German/Brazilian, Talian = Italian/Brazilian, Castellano and Portuñol
 * straddle AR/UY/BR). `es-ga`/`es-ct` are region-qualified codes for
 * Galicia/Catalonia whose flags the renderer draws as striped variants.
 * `short` is the 2-letter chip label; omitted means "uppercase the code".
 */
const _RAW_LANG_OPTIONS = [
  { code: LOCALES.EN, label: 'English', cc: 'us', flag: '🇺🇸' },
  { code: LOCALES.BR, short: 'PT', label: 'Português (BR)', cc: 'br', flag: '🇧🇷' },
  { code: LOCALES.ES, label: 'Español', cc: 'es', flag: '🇪🇸' },
  { code: LOCALES.DE, label: 'Deutsch', cc: 'ch', cc2: 'de', flag: '🇩🇪' },
  { code: LOCALES.HRK, label: 'Hunsrik', cc: 'de', cc2: 'br', flag: '🇧🇷' },
  { code: LOCALES.CAS, label: 'Castellano', cc: 'ar', cc2: 'uy', flag: '🇦🇷' },
  { code: LOCALES.RIV, label: 'Portuñol', cc: 'uy', cc2: 'br', flag: '🇺🇾' },
  { code: LOCALES.GN, label: 'Guaraní', cc: 'py', flag: '🇵🇾' },
  { code: LOCALES.IT, label: 'Italiano', cc: 'it', flag: '🇮🇹' },
  { code: LOCALES.RU, label: 'Русский', cc: 'ru', flag: '🇷🇺' },
  { code: LOCALES.FR, label: 'Français', cc: 'fr', flag: '🇫🇷' },
  { code: LOCALES.TLN, label: 'Talian', cc: 'it', cc2: 'br', flag: '🇮🇹' },
  { code: LOCALES.GL, label: 'Galego', cc: 'es-ga', flag: '🏳️' },
  { code: LOCALES.CA, label: 'Català', cc: 'es-ct', flag: '🏳️' },
  { code: LOCALES.NL, label: 'Nederlands', cc: 'nl', flag: '🇳🇱' },
  { code: LOCALES.GA, label: 'Gaeilge', cc: 'ie', flag: '🇮🇪' },
]

/**
 * Language picker rows with `short` defaulted to the uppercased locale
 * code (PT stays 'PT', EN becomes 'EN').
 * @type {Readonly<Array<{code: string, label: string, cc: string, cc2?: string, flag: string, short: string}>>}
 */
export const LANG_OPTIONS = Object.freeze(
  _RAW_LANG_OPTIONS.map((item) => ({
    ...item,
    short: item.short || item.code.toUpperCase(),
  }))
)

/**
 * One language-picker row — element type of LANG_OPTIONS, derived from the
 * frozen array so the type can never drift from the data.
 */
export type LangOption = (typeof LANG_OPTIONS)[number]

/**
 * Ordered list of routable locale codes — drives `detectLangFromPath` and
 * the CMS locale switcher. Order matches LANG_OPTIONS (picker order).
 * @type {Readonly<string[]>}
 */
export const VALID_LANGS = Object.freeze(LANG_OPTIONS.map((item) => item.code))

/**
 * Localized route slugs for one locale — every navigable page key maps to
 * its translated path segment (`about` → 'sobre'/'ueber', …).
 */
export interface LangSlugMap {
  /** '/<loc>/about' segment. */
  about: string
  /** Contact page segment. */
  contact: string
  /** Privacy-policy page segment. */
  privacy: string
  /** GDPR page segment. */
  gdpr: string
  /** Terms-of-use page segment. */
  terms: string
  /** Earth playground segment. */
  earthPlayground: string
}

/**
 * Localized route slugs per locale — the path segments after the locale
 * prefix. English is canonical/un-prefixed; every other locale maps its
 * routes through this table (`/br/sobre`, `/de/nutzungsbedingungen`, …).
 * CMS may override these at runtime via `translations/<loc>/slugs`.
 */
export { LANG_SLUGS }

/**
 * Extracts the locale segment from a URL path; defaults to English when
 * the first segment isn't a valid locale code. `/de/ueber` → 'de',
 * `/about` → 'en' (English is the un-prefixed default).
 * @param pathname - `location.pathname`
 * @returns locale code from LOCALES
 */
export function detectLangFromPath(pathname: string): string {
  // filter(Boolean) drops the empty strings split() produces for leading,
  // trailing, and doubled slashes — `/de/ueber` and `de//ueber` both yield
  // ['de','ueber'], so segment[0] is always the first real path segment.
  const segments = pathname.split(CHAR_STRINGS.SLASH).filter(Boolean)

  if (segments.length > 0 && (VALID_LANGS as readonly string[]).includes(segments[0])) {
    return segments[0]
  }

  return LOCALES.EN
}

/**
 * Builds a localized URL for a route key ('about', 'privacy', …).
 * English paths stay un-prefixed (/about); other locales get
 * /<lang>/<localized-slug>. Unknown keys fall back to the raw key —
 * `localePath('portfolio/x', 'fr')` → `/fr/portfolio/x`.
 * @param key - route key matching a LANG_SLUGS field, or a raw slug
 * @param lang - locale code
 * @returns absolute path
 */
export function localePath(key: string, lang: string = LOCALES.EN): string {
  // English is the canonical, un-prefixed locale; every other locale carries
  // its code as the first path segment.
  const base = lang === LOCALES.EN ? CHAR_STRINGS.EMPTY : `${ROUTE_PATHS.ROOT}${lang}`

  // Empty key → the locale root itself (used for "home" links).
  if (!key) return `${base}${ROUTE_PATHS.ROOT}`

  // CMS-overridden slug tables may lack an entry for a locale mid-boot —
  // fall back to English slugs rather than emitting undefined segments.
  const slugs = LANG_SLUGS[lang] ?? LANG_SLUGS.en

  // Unknown keys pass through verbatim — dynamic routes like
  // 'portfolio/<slug>' are segments, not lookup keys.
  const slug = slugs[key as keyof LangSlugMap] ?? key

  return `${base}${ROUTE_PATHS.ROOT}${slug}`
}
