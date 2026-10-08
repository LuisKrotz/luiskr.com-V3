[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [utils/wasm/wasm-layout](../README.md) / calcMosaicCols

```ts
function calcMosaicCols(vw): number
```

Defined in: [core/utils/wasm/wasm-layout.ts:223](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/core/utils/wasm/wasm-layout.ts#L223)

Mosaic column count via the MOSAIC_COLS breakpoint map (last key ≤ vw
wins) — scales 1→14 columns from phones to 10K walls.

## Parameters

### vw

`number`

Viewport width in px.

## Returns

`number`

Column count 1–14.
