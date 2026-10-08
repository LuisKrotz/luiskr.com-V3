[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [components/carousel/custom-carousel/arrows](../README.md) / destroyWebGLArrows

```ts
function destroyWebGLArrows(c): void
```

Defined in: [website/components/carousel/custom-carousel/arrows.ts:147](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/website/components/carousel/custom-carousel/arrows.ts#L147)

Destroys both arrow widgets — called on viewport exit (contexts are
released offscreen to keep the pool small) and on destroy. Nulling the
refs lets the next mount rebuild fresh.

## Parameters

### c

[`CustomCarousel`](../../../CustomCarousel/classes/CustomCarousel.md)

The CustomCarousel element.

## Returns

`void`
