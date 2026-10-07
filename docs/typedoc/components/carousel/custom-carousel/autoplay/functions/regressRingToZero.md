[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [components/carousel/custom-carousel/autoplay](../README.md) / regressRingToZero

```ts
function regressRingToZero(c): void
```

Defined in: [src/components/carousel/custom-carousel/autoplay.ts:112](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/components/carousel/custom-carousel/autoplay.ts#L112)

Drains ringProgress to 0 by RING_REGRESS_STEP per frame instead of
snapping — the ring visibly unwinds when autoplay stops, matching the
"paused" affordance. autoplayElapsed stays proportional so a resume
continues the cycle. Self-terminating: a resumed autoplay flag or
progress reaching 0 ends the RAF chain.

## Parameters

### c

[`CarouselAutoplayHost`](../interfaces/CarouselAutoplayHost.md)

The carousel host.

## Returns

`void`
