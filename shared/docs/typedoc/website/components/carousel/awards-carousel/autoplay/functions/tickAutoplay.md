[**luiskr.com**](../../../../../../README.md)

***

[luiskr.com](../../../../../../README.md) / [website/components/carousel/awards-carousel/autoplay](../README.md) / tickAutoplay

```ts
function tickAutoplay(host): void;
```

Defined in: [website/components/carousel/awards-carousel/autoplay.ts:60](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/carousel/awards-carousel/autoplay.ts#L60)

Autoplay RAF tick — advances once `duration` has elapsed. The elapsed
calculation `now - start + accumulated` lets pause/resume continue a
partially-spent dwell instead of restarting it. `currentIndex + 1`
landing past the last real slide routes through the clone — nav.ts's
teleport then jumps back to index 0 invisibly.

## Parameters

### host

[`AwardsCarousel`](../../../AwardsCarousel/classes/AwardsCarousel.md)

The AwardsCarousel element.

## Returns

`void`
