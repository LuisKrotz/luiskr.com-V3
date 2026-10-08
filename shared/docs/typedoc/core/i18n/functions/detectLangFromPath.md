[**luiskr.com**](../../../README.md)

***

[luiskr.com](../../../README.md) / [core/i18n](../README.md) / detectLangFromPath

```ts
function detectLangFromPath(pathname): string;
```

Defined in: [core/i18n.ts:103](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/i18n.ts#L103)

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
