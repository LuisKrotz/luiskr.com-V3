[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [core/tokens/locales](../README.md) / LOCALES

```ts
const LOCALES: Readonly<{
  EN: 'en'
  BR: 'br'
  PT: 'pt'
  ES: 'es'
  DE: 'de'
  FR: 'fr'
  IT: 'it'
  RU: 'ru'
  HRX: 'hrx'
  HRK: 'hrk'
  CAS: 'cas'
  RIV: 'riv'
  GN: 'gn'
  TLI: 'tli'
  TLN: 'tln'
  GL: 'gl'
  CA: 'ca'
  NL: 'nl'
  GA: 'ga'
}>
```

Defined in: [src/core/tokens/locales.ts:17](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/core/tokens/locales.ts#L17)

Locale codes. Most are ISO-639 codes; the site also serves dialects and
contact languages with custom codes:
hrk = Hunsrik (German-Brazilian dialect), cas = Rioplatense Spanish,
riv = Portuñol (Uruguay/Brazil border), gn = Guaraní, tln = Talian
(Italian-Brazilian dialect), gl = Galego, ca = Català, ga = Gaeilge.
PT/HRX/TLI are legacy aliases kept so old URLs still resolve to a locale.
