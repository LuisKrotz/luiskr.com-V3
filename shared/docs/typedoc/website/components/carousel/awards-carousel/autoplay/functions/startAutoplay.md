[**luiskr.com**](../../../../../../README.md)

***

[luiskr.com](../../../../../../README.md) / [website/components/carousel/awards-carousel/autoplay](../README.md) / startAutoplay

```ts
function startAutoplay(host): void;
```

Defined in: [website/components/carousel/awards-carousel/autoplay.ts:21](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/carousel/awards-carousel/autoplay.ts#L21)

Starts the auto-advance ticker. Bails (and actively stops any running
cycle) under reduced-motion or before ≥50% visibility — autoplay must
never run on an unseen or motion-sensitive carousel. Re-bases the clock
on each start so a fresh cycle always gets a full dwell.

## Parameters

### host

[`AwardsCarousel`](../../../AwardsCarousel/classes/AwardsCarousel.md)

The AwardsCarousel element.

## Returns

`void`
