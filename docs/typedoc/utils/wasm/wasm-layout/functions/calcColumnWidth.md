[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [utils/wasm/wasm-layout](../README.md) / calcColumnWidth

```ts
function calcColumnWidth(cols, width, gap): number
```

Defined in: [core/utils/wasm/wasm-layout.ts:68](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/core/utils/wasm/wasm-layout.ts#L68)

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
