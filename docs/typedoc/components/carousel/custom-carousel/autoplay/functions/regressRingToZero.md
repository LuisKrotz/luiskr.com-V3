[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [components/carousel/custom-carousel/autoplay](../README.md) / regressRingToZero

```ts
function regressRingToZero(c): void
```

Defined in: [src/components/carousel/custom-carousel/autoplay.ts:87](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/components/carousel/custom-carousel/autoplay.ts#L87)

Drains ringProgress to 0 at −4%/frame instead of snapping — the ring
visibly unwinds when autoplay stops, matching the "paused" affordance.
autoplayElapsed stays proportional so a resume continues the cycle.

## Parameters

### c

[`CarouselAutoplayHost`](../interfaces/CarouselAutoplayHost.md)

## Returns

`void`
