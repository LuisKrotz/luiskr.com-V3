[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [components/carousel/awards-carousel/observer](../README.md) / onResize

```ts
function onResize(host): void
```

Defined in: [src/components/carousel/awards-carousel/observer.ts:68](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/components/carousel/awards-carousel/observer.ts#L68)

Refits on container resize — instant re-jump to the current index since
slide geometry changed; smooth scroll would animate to a stale offset.

## Parameters

### host

[`AwardsCarousel`](../../../AwardsCarousel/classes/AwardsCarousel.md)

The AwardsCarousel element.

## Returns

`void`
