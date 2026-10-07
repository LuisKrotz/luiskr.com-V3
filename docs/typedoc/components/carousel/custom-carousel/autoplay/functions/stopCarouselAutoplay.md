[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [components/carousel/custom-carousel/autoplay](../README.md) / stopCarouselAutoplay

```ts
function stopCarouselAutoplay(c, permanently?): void
```

Defined in: [src/components/carousel/custom-carousel/autoplay.ts:82](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/components/carousel/custom-carousel/autoplay.ts#L82)

Stops autoplay and drains the progress ring. `permanently` latches
_autoplayPermanentlyStopped — every user-initiated navigation
(arrow/dot/swipe/hover) passes true so the carousel never auto-plays
again on this page; visibility/modal stops pass false and may resume.

## Parameters

### c

[`CarouselAutoplayHost`](../interfaces/CarouselAutoplayHost.md)

The carousel host.

### permanently?

`boolean` = `false`

Latch user intent — no future resumes.

## Returns

`void`
