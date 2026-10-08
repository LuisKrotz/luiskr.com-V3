[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/utils/wasm/wasm-layout](../README.md) / calcAspectScaled

```ts
function calcAspectScaled(
   width, 
   height, 
   maxW?
): number;
```

Defined in: [core/utils/wasm/wasm-layout.ts:275](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/wasm/wasm-layout.ts#L275)

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
