[**luiskr.com**](../../../README.md)

***

[luiskr.com](../../../README.md) / [core/i18n](../README.md) / localePath

```ts
function localePath(key, lang?): string;
```

Defined in: [core/i18n.ts:125](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/i18n.ts#L125)

Builds a localized URL for a route key ('about', 'privacy', …).
English paths stay un-prefixed (/about); other locales get
/<lang>/<localized-slug>. Unknown keys fall back to the raw key —
`localePath('portfolio/x', 'fr')` → `/fr/portfolio/x`.

## Parameters

### key

`string`

route key matching a LANG_SLUGS field, or a raw slug

### lang?

`string` = `LOCALES.EN`

locale code

## Returns

`string`

absolute path
