[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [core/utils/dom](../README.md) / svgPlaceholder

```ts
function svgPlaceholder(w?, h?): string
```

Defined in: [src/core/utils/dom.ts:82](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/core/utils/dom.ts#L82)

Generates an ultra-lightweight inline SVG placeholder data URI with exact
dimensions. An empty `<svg width height viewBox>` weighs ~110 bytes,
decodes instantly, and — crucially — gives the `<img>` a definite intrinsic
size AND aspect ratio, so `width:auto` layouts reserve the real natural box
while the actual image streams in (zero CLS, no uniform-width stretching).
Without the width/height attrs the SVG is intrinsic-ratio-only and the img
collapses to the ~300×150 default replaced size. Default is FHD
1920×1080 (16:9), the common media shape.

## Parameters

### w?

`number` = `COVER_DIMENSIONS.FHD_WIDTH`

### h?

`number` = `COVER_DIMENSIONS.FHD_HEIGHT`

## Returns

`string`
