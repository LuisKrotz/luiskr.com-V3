[**luiskr.com**](../../../../../../README.md)

***

[luiskr.com](../../../../../../README.md) / [website/components/carousel/custom-carousel/autoplay](../README.md) / startCarouselAutoplay

```ts
function startCarouselAutoplay(c): void;
```

Defined in: [website/components/carousel/custom-carousel/autoplay.ts:58](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/carousel/custom-carousel/autoplay.ts#L58)

Starts the autoplay RAF loop unless latched off or already running.
`autoplayStart` is backdated by `autoplayElapsed` so a pause→resume
continues the cycle mid-dwell — the ring picks up where it drained to
instead of restarting the countdown.

## Parameters

### c

[`CarouselAutoplayHost`](../interfaces/CarouselAutoplayHost.md)

The carousel host.

## Returns

`void`
