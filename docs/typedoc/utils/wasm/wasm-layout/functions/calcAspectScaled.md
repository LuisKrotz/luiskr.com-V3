[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [utils/wasm/wasm-layout](../README.md) / calcAspectScaled

```ts
function calcAspectScaled(width, height, maxW?): number
```

Defined in: [src/utils/wasm/wasm-layout.ts:256](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/utils/wasm/wasm-layout.ts#L256)

Height rescaled for a width capped at maxW, preserving aspect ratio:
height·(maxW/width) — only shrinks; widths under maxW return height
untouched. Rounded so CSS heights stay integer pixels.

## Parameters

### width

`number`

Intrinsic width.

### height

`number`

Intrinsic height.

### maxW?

`number` = `COVER_DIMENSIONS.FHD_WIDTH`

Width cap (defaults to FHD so 4K masters don't downscale mid-layout).

## Returns

`number`

Rescaled height.
