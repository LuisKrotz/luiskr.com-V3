[**luiskr.com**](../../../README.md)

---

[luiskr.com](../../../README.md) / [core/i18n](../README.md) / VALID\_LANGS

```ts
const VALID_LANGS: readonly (
  | 'en'
  | 'br'
  | 'es'
  | 'de'
  | 'fr'
  | 'it'
  | 'ru'
  | 'hrk'
  | 'cas'
  | 'riv'
  | 'gn'
  | 'tln'
  | 'gl'
  | 'ca'
  | 'nl'
  | 'ga'
)[]
```

Defined in: [src/core/i18n.ts:62](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/core/i18n.ts#L62)

Ordered list of routable locale codes — drives `detectLangFromPath` and
the CMS locale switcher. Order matches LANG_OPTIONS (picker order).
