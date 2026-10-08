[**luiskr.com**](../../../../../../README.md)

***

[luiskr.com](../../../../../../README.md) / [website/components/carousel/awards-carousel/observer](../README.md) / onResize

```ts
function onResize(host): void;
```

Defined in: [website/components/carousel/awards-carousel/observer.ts:68](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/carousel/awards-carousel/observer.ts#L68)

Refits on container resize — instant re-jump to the current index since
slide geometry changed; smooth scroll would animate to a stale offset.

## Parameters

### host

[`AwardsCarousel`](../../../AwardsCarousel/classes/AwardsCarousel.md)

The AwardsCarousel element.

## Returns

`void`
