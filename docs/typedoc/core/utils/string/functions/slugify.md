[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [core/utils/string](../README.md) / slugify

```ts
function slugify(text): string
```

Defined in: [src/core/utils/string.ts:58](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/core/utils/string.ts#L58)

Converts a string into a clean, URL-safe and DOM-id-safe slug.
Pipeline: lowercase → drop non-word/non-space/non-dash chars → collapse
whitespace+underscores to `-` → collapse consecutive dashes. e.g.
"METCHA — Leather!" → "metcha-leather".

## Parameters

### text

`string`

## Returns

`string`
