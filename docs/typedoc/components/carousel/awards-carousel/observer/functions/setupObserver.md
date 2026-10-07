[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [components/carousel/awards-carousel/observer](../README.md) / setupObserver

```ts
function setupObserver(host): void
```

Defined in: [src/components/carousel/awards-carousel/observer.ts:19](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/components/carousel/awards-carousel/observer.ts#L19)

Autoplay only runs while ≥50% of the carousel is on screen
(threshold [0, 0.5] gives a clean two-state signal); below that or
under reduced-motion it pauses — offscreen animation would burn
frames the user can't see.

## Parameters

### host

[`AwardsCarousel`](../../../AwardsCarousel/classes/AwardsCarousel.md)

## Returns

`void`
