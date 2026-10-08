[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [utils/data/sanitize](../README.md) / sanitizeHtml

```ts
function sanitizeHtml(html): string
```

Defined in: [core/utils/data/sanitize.ts:75](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/core/utils/data/sanitize.ts#L75)

Sanitize an HTML string, preserving allowed tags and attributes only.

## Parameters

### html

`string`

Raw HTML string (possibly from CMS / i18n store).

## Returns

`string`

Safe HTML string ready for use in innerHTML.
