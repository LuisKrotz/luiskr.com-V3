[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [components/carousel/custom-carousel/nav](../README.md) / scrollToElement

```ts
function scrollToElement(c, el): void
```

Defined in: [src/components/carousel/custom-carousel/nav.ts:167](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/components/carousel/custom-carousel/nav.ts#L167)

Smooth-centers a slide element in the track — null-safe on both ends
(clone nodes may be absent in the ≤2-item side-by-side layout).

## Parameters

### c

[`CustomCarousel`](../../../CustomCarousel/classes/CustomCarousel.md)

The CustomCarousel element.

### el

`Element` \| `null`

Slide element to center; null is a no-op.

## Returns

`void`
