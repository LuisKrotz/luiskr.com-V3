[**luiskr.com**](../../../../README.md)

***

[luiskr.com](../../../../README.md) / [core/utils/dom](../README.md) / svgPlaceholder

```ts
function svgPlaceholder(w?, h?): string;
```

Defined in: [core/utils/dom.ts:98](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/dom.ts#L98)

Generates an ultra-lightweight inline SVG placeholder data URI with exact
dimensions. An empty `<svg width height viewBox>` weighs ~110 bytes,
decodes instantly, and — crucially — gives the `<img>` a definite intrinsic
size AND aspect ratio, so `width:auto` layouts reserve the real natural box
while the actual image streams in (zero CLS, no uniform-width stretching).
Without the width/height attrs the SVG is intrinsic-ratio-only and the img
collapses to the ~300×150 default replaced size. Default is FHD
1920×1080 (16:9), the common media shape. `encodeURIComponent` (not
base64) keeps the URI readable and is the spec-supported form for
`data:image/svg+xml` per RFC 2397 — b64 would inflate size ~33%.

## Parameters

### w?

`number` = `COVER_DIMENSIONS.FHD_WIDTH`

Intrinsic width to declare (px).

### h?

`number` = `COVER_DIMENSIONS.FHD_HEIGHT`

Intrinsic height to declare (px).

## Returns

`string`

`data:image/svg+xml;charset=utf-8,…` URI for img.src.
