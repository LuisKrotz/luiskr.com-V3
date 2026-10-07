[**luiskr.com**](../../../README.md)

---

[luiskr.com](../../../README.md) / [core/i18n](../README.md) / detectLangFromPath

```ts
function detectLangFromPath(pathname): string
```

Defined in: [src/core/i18n.ts:91](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/core/i18n.ts#L91)

Extracts the locale segment from a URL path; defaults to English when
the first segment isn't a valid locale code. `/de/ueber` → 'de',
`/about` → 'en' (English is the un-prefixed default).

## Parameters

### pathname

`string`

`location.pathname`

## Returns

`string`

locale code from LOCALES
