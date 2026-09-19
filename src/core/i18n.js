export const VALID_LANGS = [
  'en',
  'br',
  'es',
  'de',
  'hrk',
  'cas',
  'riv',
  'gn',
  'it',
  'ru',
  'fr',
  'tln',
]

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

export const LANG_OPTIONS = [
  { code: 'en', short: 'EN', label: 'English', cc: 'us' },
  { code: 'br', short: 'PT', label: 'Português (BR)', cc: 'br' },
  { code: 'es', short: 'ES', label: 'Español', cc: 'es' },
  { code: 'de', short: 'DE', label: 'Deutsch', cc: 'ch', cc2: 'de' },
  { code: 'hrk', short: 'HRK', label: 'Hunsrik', cc: 'de', cc2: 'br' },
  { code: 'cas', short: 'CAS', label: 'Castellano', cc: 'ar', cc2: 'uy' },
  { code: 'riv', short: 'RIV', label: 'Portuñol', cc: 'uy', cc2: 'br' },
  { code: 'gn', short: 'GN', label: 'Guaraní', cc: 'py' },
  { code: 'it', short: 'IT', label: 'Italiano', cc: 'it' },
  { code: 'ru', short: 'RU', label: 'Русский', cc: 'ru' },
  { code: 'fr', short: 'FR', label: 'Français', cc: 'fr' },
  { code: 'tln', short: 'TLN', label: 'Talian', cc: 'it', cc2: 'br' },
]

export function detectLangFromPath(pathname) {
  const segments = pathname.split('/').filter(Boolean)
  if (segments.length > 0 && VALID_LANGS.includes(segments[0])) {
    return segments[0]
  }
  return 'en'
}

export function localePath(key, lang = 'en') {
  const base = lang === 'en' ? '' : '/' + lang
  if (!key) return base + '/'
  const slugs = LANG_SLUGS[lang] ?? LANG_SLUGS.en
  const slug = slugs[key] ?? key
  return base + '/' + slug
}
