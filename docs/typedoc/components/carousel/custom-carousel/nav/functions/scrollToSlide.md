[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [components/carousel/custom-carousel/nav](../README.md) / scrollToSlide

```ts
function scrollToSlide(c, idx): void
```

Defined in: [src/components/carousel/custom-carousel/nav.ts:205](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/components/carousel/custom-carousel/nav.ts#L205)

Smooth-centers real-slide idx — `children[idx + 1]` because a clone of
the last slide is prepended to the track (index 0 is the clone).

## Parameters

### c

[`CustomCarousel`](../../../CustomCarousel/classes/CustomCarousel.md)

The CustomCarousel element.

### idx

`number`

Real-slide index.

## Returns

`void`
