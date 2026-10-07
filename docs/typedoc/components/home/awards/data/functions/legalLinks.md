[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [components/home/awards/data](../README.md) / legalLinks

```ts
function legalLinks(): LegalLink[]
```

Defined in: [src/components/home/awards/data.ts:48](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/components/home/awards/data.ts#L48)

Legal-page links for the footer row — CMS `legal-footer` list preferred,
bundled per-locale fallback when empty. Both lists are filtered through
HAS_LINK so a bare locale-root row (the stored home link) never renders.

## Returns

[`LegalLink`](../interfaces/LegalLink.md)[]

Validated {link, page} rows.
