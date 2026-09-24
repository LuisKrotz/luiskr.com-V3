import { STRINGS, LOCALES, PATHS } from './constants.js'

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
]

export const LANG_OPTIONS = Object.freeze(
  _RAW_LANG_OPTIONS.map((item) => ({
    ...item,
    short: item.short || item.code.toUpperCase(),
  }))
)

export const VALID_LANGS = Object.freeze(
  LANG_OPTIONS.map((item) => item.code)
)

export const LANG_SLUGS = {
  en: {
    about: 'about',
    contact: 'contact',
    privacy: 'privacy-policy',
    gdpr: 'gdpr',
    terms: 'terms-of-use',
  },
  br: {
    about: 'sobre',
    contact: 'contato',
    privacy: 'politica-de-privacidade',
    gdpr: 'lgpd',
    terms: 'termos-de-uso',
  },
  es: {
    about: 'acerca',
    contact: 'contacto',
    privacy: 'politica-de-privacidad',
    gdpr: 'rgpd',
    terms: 'terminos-de-uso',
  },
  de: {
    about: 'ueber',
    contact: 'kontakt',
    privacy: 'datenschutzrichtlinie',
    gdpr: 'dsgvo',
    terms: 'nutzungsbedingungen',
  },
  hrk: {
    about: 'iwwer-mich',
    contact: 'kontakt',
    privacy: 'dateschutz-erklerung',
    gdpr: 'datenschutz',
    terms: 'nutzungsbedingunge',
  },
  cas: {
    about: 'sobre-mi',
    contact: 'contacto',
    privacy: 'politica-de-privacidad',
    gdpr: 'rgpd',
    terms: 'terminos-de-uso',
  },
  riv: {
    about: 'sobre-yo',
    contact: 'contato',
    privacy: 'politica-de-privacidade',
    gdpr: 'lgpd-gdpr',
    terms: 'termos-de-uso',
  },
  gn: {
    about: 'che-rehegua',
    contact: 'kontakt',
    privacy: 'marandu-nangarekoha',
    gdpr: 'lgpd-gdpr',
    terms: 'oipuruva-nemoarandu',
  },
  it: {
    about: 'chi-sono',
    contact: 'contatti',
    privacy: 'informativa-sulla-privacy',
    gdpr: 'gdpr',
    terms: 'termini-di-utilizzo',
  },
  ru: {
    about: 'obo-mne',
    contact: 'kontakty',
    privacy: 'politika-konfidentsialnosti',
    gdpr: 'gdpr',
    terms: 'usloviya-ispolzovaniya',
  },
  fr: {
    about: 'a-propos',
    contact: 'contact',
    privacy: 'politique-de-confidentialite',
    gdpr: 'rgpd',
    terms: 'conditions-utilisation',
  },
  tln: {
    about: 'de-mi',
    contact: 'contato',
    privacy: 'informativa-su-la-privacy',
    gdpr: 'gdpr',
    terms: 'condission-de-uso',
  },
}


export function detectLangFromPath(pathname) {
  const segments = pathname.split(STRINGS.SLASH).filter(Boolean)

  if (segments.length > 0 && VALID_LANGS.includes(segments[0])) {
    return segments[0]
  }

  return LOCALES.EN
}

export function localePath(key, lang = LOCALES.EN) {
  const base = lang === LOCALES.EN ? STRINGS.EMPTY : `${PATHS.ROOT}${lang}`

  if (!key) return `${base}${PATHS.ROOT}`

  const slugs = LANG_SLUGS[lang] ?? LANG_SLUGS.en

  const slug = slugs[key] ?? key

  return `${base}${PATHS.ROOT}${slug}`
}
