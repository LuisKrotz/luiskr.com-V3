[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/utils/wasm/wasm-layout](../README.md) / calcMosaicCols

```ts
function calcMosaicCols(vw): number;
```

Defined in: [core/utils/wasm/wasm-layout.ts:242](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/wasm/wasm-layout.ts#L242)

Mosaic column count via the MOSAIC_COLS breakpoint map (last key ≤ vw
wins) — scales 1→14 columns from phones to 10K walls.

## Parameters

### vw

`number`

Viewport width in px.

## Returns

`number`

Column count 1–14.
