[**luiskr.com**](../../../../../../README.md)

***

[luiskr.com](../../../../../../README.md) / [website/components/carousel/awards-carousel/observer](../README.md) / setupObserver

```ts
function setupObserver(host): void;
```

Defined in: [website/components/carousel/awards-carousel/observer.ts:22](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/carousel/awards-carousel/observer.ts#L22)

Autoplay only runs while ≥50% of the carousel is on screen
(threshold [0, 0.5] gives a clean two-state signal); below that or
under reduced-motion it pauses — offscreen animation would burn
frames the user can't see. When IntersectionObserver itself is
absent (very old engines, some test DOMs) the carousel degrades to
always-visible so content still shows.

## Parameters

### host

[`AwardsCarousel`](../../../AwardsCarousel/classes/AwardsCarousel.md)

The AwardsCarousel element.

## Returns

`void`
