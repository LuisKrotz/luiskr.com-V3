[**luiskr.com**](../../../../../../README.md)

***

[luiskr.com](../../../../../../README.md) / [website/components/carousel/custom-carousel/lifecycle](../README.md) / onDestroy

```ts
function onDestroy(host): void;
```

Defined in: [website/components/carousel/custom-carousel/lifecycle.ts:68](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/carousel/custom-carousel/lifecycle.ts#L68)

Teardown: autoplay clock, WebGL arrows, observers, timers — every async handle released so nothing fires after disconnect.

## Parameters

### host

[`CustomCarousel`](../../../CustomCarousel/classes/CustomCarousel.md)

## Returns

`void`
