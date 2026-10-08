[**luiskr.com**](../../../../../../README.md)

***

[luiskr.com](../../../../../../README.md) / [website/components/home/awards/data](../README.md) / legalLinks

```ts
function legalLinks(): LegalLink[];
```

Defined in: [website/components/home/awards/data.ts:48](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/home/awards/data.ts#L48)

Legal-page links for the footer row — CMS `legal-footer` list preferred,
bundled per-locale fallback when empty. Both lists are filtered through
HAS_LINK so a bare locale-root row (the stored home link) never renders.

## Returns

[`LegalLink`](../interfaces/LegalLink.md)[]

Validated {link, page} rows.
