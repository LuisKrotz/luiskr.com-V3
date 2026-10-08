[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [utils/wasm/wasm-layout](../README.md) / calcCarouselScrollTarget

```ts
function calcCarouselScrollTarget(idx, slideWidth, gap?): number
```

Defined in: [core/utils/wasm/wasm-layout.ts:116](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/core/utils/wasm/wasm-layout.ts#L116)

Scroll offset that brings slide `idx` into view, counting per-slide
width + gap: idx·(slideWidth+gap).

## Parameters

### idx

`number`

Slide index.

### slideWidth

`number`

Rendered slide width in px.

### gap?

`number` = `0`

Inter-slide gap in px.

## Returns

`number`

scrollLeft target in px.
