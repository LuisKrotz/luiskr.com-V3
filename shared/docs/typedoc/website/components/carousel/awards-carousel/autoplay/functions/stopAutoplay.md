[**luiskr.com**](../../../../../../README.md)

***

[luiskr.com](../../../../../../README.md) / [website/components/carousel/awards-carousel/autoplay](../README.md) / stopAutoplay

```ts
function stopAutoplay(host): void;
```

Defined in: [website/components/carousel/awards-carousel/autoplay.ts:43](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/carousel/awards-carousel/autoplay.ts#L43)

Stops auto-advance (hover, reduced-motion, offscreen). Cancels the
pending RAF so no stray tick survives, then emits `autoplaystop` for
progress-bar listeners.

## Parameters

### host

[`AwardsCarousel`](../../../AwardsCarousel/classes/AwardsCarousel.md)

The AwardsCarousel element.

## Returns

`void`
