[**luiskr.com**](../../../../../../README.md)

***

[luiskr.com](../../../../../../README.md) / [website/components/carousel/custom-carousel/nav](../README.md) / checkInfiniteLoop

```ts
function checkInfiniteLoop(c): void;
```

Defined in: [website/components/carousel/custom-carousel/nav.ts:273](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/carousel/custom-carousel/nav.ts#L273)

Clone-teleport check — runs after the scroll debounce: when a clone is
parked at the track's center, instant-jump to its real twin and re-sync
active classes. This is the *user-driven* wrap path (touch/wheel scroll
past an edge) — the programmatic path goes through carouselGoTo.

## Parameters

### c

[`CustomCarousel`](../../../CustomCarousel/classes/CustomCarousel.md)

The CustomCarousel element.

## Returns

`void`
