[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [utils/wasm/wasm-layout](../README.md) / calcColsForWidth

```ts
function calcColsForWidth(vw): number
```

Defined in: [core/utils/wasm/wasm-layout.ts:213](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/core/utils/wasm/wasm-layout.ts#L213)

Home-mosaic column count for a viewport width — the legacy stepped
table (1–7 columns); kept alongside MOSAIC_COLS which callers should
prefer for new layout work.

## Parameters

### vw

`number`

Viewport width in px.

## Returns

`number`

Column count 1–7.
