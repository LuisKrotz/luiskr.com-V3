[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/utils/wasm/wasm-layout](../README.md) / calcColumnWidth

```ts
function calcColumnWidth(
   cols, 
   width, 
   gap
): number;
```

Defined in: [core/utils/wasm/wasm-layout.ts:68](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/wasm/wasm-layout.ts#L68)

Column pixel width for a grid: total width minus inter-column gaps,
divided evenly. Formula: (width − (cols−1)·gap) / cols.

## Parameters

### cols

`number`

Column count.

### width

`number`

Available grid width in px.

### gap

`number`

Inter-column gutter in px.

## Returns

`number`

Per-column width in px.
