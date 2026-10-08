[**luiskr.com**](../../../../../../README.md)

***

[luiskr.com](../../../../../../README.md) / [website/components/carousel/custom-carousel/nav](../README.md) / carouselOnPrevClick

```ts
function carouselOnPrevClick(c): void;
```

Defined in: [website/components/carousel/custom-carousel/nav.ts:313](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/carousel/custom-carousel/nav.ts#L313)

Prev-arrow click — replays the WebGL arrow's click animation
(triggerClick), permanently stops autoplay (user intent overrides the
ambient cycle — the "true" latch), then navigates one step back.

## Parameters

### c

[`CustomCarousel`](../../../CustomCarousel/classes/CustomCarousel.md)

The CustomCarousel element.

## Returns

`void`
