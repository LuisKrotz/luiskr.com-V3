[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [components/carousel/awards-carousel/autoplay](../README.md) / stopAutoplay

```ts
function stopAutoplay(host): void
```

Defined in: [src/components/carousel/awards-carousel/autoplay.ts:43](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/components/carousel/awards-carousel/autoplay.ts#L43)

Stops auto-advance (hover, reduced-motion, offscreen). Cancels the
pending RAF so no stray tick survives, then emits `autoplaystop` for
progress-bar listeners.

## Parameters

### host

[`AwardsCarousel`](../../../AwardsCarousel/classes/AwardsCarousel.md)

The AwardsCarousel element.

## Returns

`void`
