/**
 * @file core/locale/lang-slugs.ts
 * @description Canonical localized route-slug table — the per-locale path
 * segments after the locale prefix. English is canonical/un-prefixed; every
 * other locale maps its routes through this table. CMS may override these
 * at runtime via `translations/<loc>/slugs`.
 *
 * This file is a ZERO-IMPORT leaf by design: node build scripts
 * (scripts/build/build-locale-pages.mjs, scripts/build/generate-sitemap.js) import it
 * directly with native type stripping — any import here would break plain-
 * node resolution (`.js` specifiers only resolve under bundler/jest).
 */

/** One locale's localized route segments (keys match the router's route ids). */
export interface LangSlugMap {
  about: string
  contact: string
  privacy: string
  gdpr: string
  terms: string
  earthPlayground: string
}

/**
 * Localized route slugs per locale — the path segments after the locale
 * prefix. English is canonical/un-prefixed; every other locale maps its
 * routes through this table (`/br/sobre`, `/de/nutzungsbedingungen`, …).
 * CMS may override these at runtime via `translations/<loc>/slugs`.
 *
 * Slugs are ASCII-folded (no diacritics — `ueber` not `über`,
 * `termes-d-us` not `termes-d'ús`) so URLs survive servers and clients
 * that mishandle percent-encoded UTF-8, and stay readable when pasted
 * into plain-text contexts.
 */
export const LANG_SLUGS: Record<string, LangSlugMap> = {
  en: {
    about: 'about',
    contact: 'contact',
    privacy: 'privacy-policy',
    gdpr: 'gdpr',
    terms: 'terms-of-use',
    earthPlayground: 'earth-playground',
  },
  br: {
    about: 'sobre',
    contact: 'contato',
    privacy: 'politica-de-privacidade',
    gdpr: 'lgpd',
    terms: 'termos-de-uso',
    earthPlayground: 'playground-da-terra',
  },
  es: {
    about: 'acerca',
    contact: 'contacto',
    privacy: 'politica-de-privacidad',
    gdpr: 'rgpd',
    terms: 'terminos-de-uso',
    earthPlayground: 'playground-de-la-tierra',
  },
  de: {
    about: 'ueber',
    contact: 'kontakt',
    privacy: 'datenschutzrichtlinie',
    gdpr: 'dsgvo',
    terms: 'nutzungsbedingungen',
    earthPlayground: 'erde-playground',
  },
  hrk: {
    about: 'iwwer-mich',
    contact: 'kontakt',
    privacy: 'dateschutz-erklerung',
    gdpr: 'datenschutz',
    terms: 'nutzungsbedingunge',
    earthPlayground: 'erd-playground',
  },
  cas: {
    about: 'sobre-mi',
    contact: 'contacto',
    privacy: 'politica-de-privacidad',
    gdpr: 'rgpd',
    terms: 'terminos-de-uso',
    earthPlayground: 'playground-de-la-tierra',
  },
  riv: {
    about: 'sobre-yo',
    contact: 'contato',
    privacy: 'politica-de-privacidade',
    gdpr: 'lgpd-gdpr',
    terms: 'termos-de-uso',
    earthPlayground: 'playground-da-terra',
  },
  gn: {
    about: 'che-rehegua',
    contact: 'kontakt',
    privacy: 'marandu-nangarekoha',
    gdpr: 'lgpd-gdpr',
    terms: 'oipuruva-nemoarandu',
    earthPlayground: 'yvy-nembosarai',
  },
  it: {
    about: 'chi-sono',
    contact: 'contatti',
    privacy: 'informativa-sulla-privacy',
    gdpr: 'gdpr',
    terms: 'termini-di-utilizzo',
    earthPlayground: 'playground-della-terra',
  },
  ru: {
    about: 'obo-mne',
    contact: 'kontakty',
    privacy: 'politika-konfidentsialnosti',
    gdpr: 'gdpr',
    terms: 'usloviya-ispolzovaniya',
    earthPlayground: 'zemnaya-pesochnitsa',
  },
  fr: {
    about: 'a-propos',
    contact: 'contact',
    privacy: 'politique-de-confidentialite',
    gdpr: 'rgpd',
    terms: 'conditions-utilisation',
    earthPlayground: 'playground-de-la-terre',
  },
  tln: {
    about: 'de-mi',
    contact: 'contato',
    privacy: 'informativa-su-la-privacy',
    gdpr: 'gdpr',
    terms: 'condission-de-uso',
    earthPlayground: 'playground-della-terra',
  },
  gl: {
    about: 'sobre-min',
    contact: 'contacto',
    privacy: 'politica-de-privacidade',
    gdpr: 'rgpd',
    terms: 'termos-de-uso',
    earthPlayground: 'playground-da-terra',
  },
  ca: {
    about: 'quant-a-mi',
    contact: 'contacte',
    privacy: 'politica-de-privacitat',
    gdpr: 'rgpd',
    terms: 'termes-d-us',
    earthPlayground: 'playground-de-la-terra',
  },
  nl: {
    about: 'over-mij',
    contact: 'contact',
    privacy: 'privacybeleid',
    gdpr: 'avg',
    terms: 'gebruiksvoorwaarden',
    earthPlayground: 'aarde-playground',
  },
  ga: {
    about: 'faoi-mhe',
    contact: 'teagmhail',
    privacy: 'beartas-probhaideachta',
    gdpr: 'gdpr',
    terms: 'tearmai-usaide',
    earthPlayground: 'playground-an-domhain',
  },
}
