[**luiskr.com**](../../../../../../README.md)

***

[luiskr.com](../../../../../../README.md) / [website/components/carousel/custom-carousel/sizing](../README.md) / setHeightVar

```ts
function setHeightVar(c): void;
```

Defined in: [website/components/carousel/custom-carousel/sizing.ts:202](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/carousel/custom-carousel/sizing.ts#L202)

Publishes --carousel-item-height on the enclosing <section>: the first
item's intrinsic ratio applied to the host width ((h/w)·hostW), capped
at MAX_HEIGHT_VH — aspect-correct heights before image decode so slides
never pop. When the item lacks a size the measured slide height is the
fallback; a ≤0 result bails rather than writing a 0px var. The
getPropertyValue read guards the setProperty — same-value writes would
still dirty the style recalc.

## Parameters

### c

[`CustomCarousel`](../../../CustomCarousel/classes/CustomCarousel.md)

The CustomCarousel element.

## Returns

`void`
