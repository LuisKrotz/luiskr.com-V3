/**
 * @file @core/tokens/locales.js
 * @description Supported language locales for i18n routing and CMS data
 * fetching. The codes are the keys of `translations/<locale>` in Firebase
 * and the URL prefixes on the site (`/de/…`, `/br/…`).
 */

/**
 * Locale codes. Most are ISO-639 codes; the site also serves dialects and
 * contact languages with custom codes:
 *   hrk = Hunsrik (German-Brazilian dialect), cas = Rioplatense Spanish,
 *   riv = Portuñol (Uruguay/Brazil border), gn = Guaraní, tln = Talian
 *   (Italian-Brazilian dialect), gl = Galego, ca = Català, ga = Gaeilge.
 * PT/HRX/TLI are legacy aliases kept so old URLs still resolve to a locale.
 * @type {Readonly<Record<string, string>>}
 */
export const LOCALES = Object.freeze({
  EN: 'en',
  BR: 'br',
  PT: 'pt',
  ES: 'es',
  DE: 'de',
  FR: 'fr',
  IT: 'it',
  RU: 'ru',
  HRX: 'hrx',
  HRK: 'hrk',
  CAS: 'cas',
  RIV: 'riv',
  GN: 'gn',
  TLI: 'tli',
  TLN: 'tln',
  GL: 'gl',
  CA: 'ca',
  NL: 'nl',
  GA: 'ga',
})
