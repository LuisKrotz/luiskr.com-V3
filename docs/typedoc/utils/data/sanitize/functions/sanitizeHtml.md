[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [utils/data/sanitize](../README.md) / sanitizeHtml

```ts
function sanitizeHtml(html): string
```

Defined in: [src/utils/data/sanitize.ts:75](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/data/sanitize.ts#L75)

Sanitize an HTML string, preserving allowed tags and attributes only.

## Parameters

### html

`string`

Raw HTML string (possibly from CMS / i18n store).

## Returns

`string`

Safe HTML string ready for use in innerHTML.
