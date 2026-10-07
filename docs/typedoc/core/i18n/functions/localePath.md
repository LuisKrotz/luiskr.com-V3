[**luiskr.com**](../../../README.md)

---

[luiskr.com](../../../README.md) / [core/i18n](../README.md) / localePath

```ts
function localePath(key, lang?): string
```

Defined in: [src/core/i18n.ts:110](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/core/i18n.ts#L110)

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
