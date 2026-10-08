[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [website/views/home/data](../README.md) / processedItems

```ts
function processedItems(view): PortfolioItem[];
```

Defined in: [website/views/home/data.ts:48](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/views/home/data.ts#L48)

Projects list reshaped for the mosaic. The DB stores portfoliolist
as either an array or a keyed object (locale-dependent), so both
shapes normalize to an array; each item gets a computed `featured`
flag driving the 2-column span in the masonry layout.

## Parameters

### view

[`ViewHome`](../../Home/classes/ViewHome.md)

## Returns

[`PortfolioItem`](../../types/interfaces/PortfolioItem.md)[]
