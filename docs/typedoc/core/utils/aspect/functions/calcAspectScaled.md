[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [core/utils/aspect](../README.md) / calcAspectScaled

```ts
function calcAspectScaled(width, height, maxWidth): number
```

Defined in: [src/core/utils/aspect.ts:18](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/core/utils/aspect.ts#L18)

Calculates aspect-ratio scaled height while preserving proportions.
Formula: `height_out = (h/w) × maxWidth` — the intrinsic ratio (h/w)
scaled to the bounding width. Rounded to an integer pixel so it can land
directly on a style/attribute. Returns the raw height (or 0) when any
input is missing rather than NaN — callers render `height || fallback`.

## Parameters

### width

`number`

Intrinsic width

### height

`number`

Intrinsic height

### maxWidth

`number`

Target max bounding width

## Returns

`number`

Scaled integer height
