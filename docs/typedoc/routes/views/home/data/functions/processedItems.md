[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [routes/views/home/data](../README.md) / processedItems

```ts
function processedItems(view): PortfolioItem[]
```

Defined in: [src/routes/views/home/data.ts:48](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/routes/views/home/data.ts#L48)

Projects list reshaped for the mosaic. The DB stores portfoliolist
as either an array or a keyed object (locale-dependent), so both
shapes normalize to an array; each item gets a computed `featured`
flag driving the 2-column span in the masonry layout.

## Parameters

### view

[`ViewHome`](../../Home/classes/ViewHome.md)

## Returns

[`PortfolioItem`](../../types/interfaces/PortfolioItem.md)[]
