[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [components/carousel/custom-carousel/nav](../README.md) / checkInfiniteLoop

```ts
function checkInfiniteLoop(c): void
```

Defined in: [src/components/carousel/custom-carousel/nav.ts:273](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/components/carousel/custom-carousel/nav.ts#L273)

Clone-teleport check — runs after the scroll debounce: when a clone is
parked at the track's center, instant-jump to its real twin and re-sync
active classes. This is the _user-driven_ wrap path (touch/wheel scroll
past an edge) — the programmatic path goes through carouselGoTo.

## Parameters

### c

[`CustomCarousel`](../../../CustomCarousel/classes/CustomCarousel.md)

The CustomCarousel element.

## Returns

`void`
