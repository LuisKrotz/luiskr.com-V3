[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [components/media/figure/load](../README.md) / mediaPlaceholder

```ts
function mediaPlaceholder(w, h): string
```

Defined in: [src/components/media/figure/load.ts:60](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/components/media/figure/load.ts#L60)

Inline SVG placeholder — a URL-encoded empty <svg> carrying the media's
real width/height (definite intrinsic size) plus the viewBox aspect.
The width/height attrs matter: a viewBox-only SVG is intrinsic-ratio-only
and the <img> would collapse to the ~300×150 default replaced size under
`width:auto`, so carousel placeholders keep their natural box before any
bytes arrive (zero-CLS without shipping a real image).

## Parameters

### w

`number`

### h

`number`

## Returns

`string`
