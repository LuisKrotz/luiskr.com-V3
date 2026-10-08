[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [routes/views/home/data](../README.md) / isFeatured

```ts
function isFeatured(view, item): boolean
```

Defined in: [website/views/home/data.ts:34](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/website/views/home/data.ts#L34)

Featured detection accepts three sources: explicit boolean/string/1
on the item itself (CMS stores typed values loosely), or membership
in featuredLinks — the set built from components/projects entries
flagged at the canonical source. Either path spans the tile 2 cols.

## Parameters

### view

[`ViewHome`](../../Home/classes/ViewHome.md)

### item

[`PortfolioItem`](../../types/interfaces/PortfolioItem.md)

## Returns

`boolean`
