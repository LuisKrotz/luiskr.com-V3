[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/utils/data/sanitize](../README.md) / sanitizeHtml

```ts
function sanitizeHtml(html): string;
```

Defined in: [core/utils/data/sanitize.ts:75](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/data/sanitize.ts#L75)

Sanitize an HTML string, preserving allowed tags and attributes only.

## Parameters

### html

`string`

Raw HTML string (possibly from CMS / i18n store).

## Returns

`string`

Safe HTML string ready for use in innerHTML.
