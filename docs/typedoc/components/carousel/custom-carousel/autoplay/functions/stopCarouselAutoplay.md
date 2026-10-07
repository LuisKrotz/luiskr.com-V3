[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [components/carousel/custom-carousel/autoplay](../README.md) / stopCarouselAutoplay

```ts
function stopCarouselAutoplay(c, permanently?): void
```

Defined in: [src/components/carousel/custom-carousel/autoplay.ts:60](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/components/carousel/custom-carousel/autoplay.ts#L60)

Stops autoplay and drains the progress ring. `permanently` latches
_autoplayPermanentlyStopped — every user-initiated navigation
(arrow/dot/swipe/hover) passes true so the carousel never auto-plays
again on this page; visibility/modal stops pass false and may resume.

## Parameters

### c

[`CarouselAutoplayHost`](../interfaces/CarouselAutoplayHost.md)

### permanently?

`boolean` = `false`

## Returns

`void`
