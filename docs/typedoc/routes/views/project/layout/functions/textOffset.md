[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [routes/views/project/layout](../README.md) / textOffset

```ts
function textOffset(c, items, idx): number
```

Defined in: [src/routes/views/project/layout.ts:71](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/routes/views/project/layout.ts#L71)

Start offset for the text run at index `idx`: cumulative real chars of
the preceding items × the per-char delay, plus the per-index step — so
sequential sections cascade rather than all starting at t=0.

## Parameters

### c

[`ViewProject`](../../Project/classes/ViewProject.md)

The ViewProject instance — supplies textDelay via the facade.

### items

`unknown`

Section text items (expected string[]).

### idx

`number`

Index of this item in the section.

## Returns

`number`

Start offset in ms (0 for non-array input).
