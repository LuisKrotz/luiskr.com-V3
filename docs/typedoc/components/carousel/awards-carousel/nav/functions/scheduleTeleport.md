[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [components/carousel/awards-carousel/nav](../README.md) / scheduleTeleport

```ts
function scheduleTeleport(host, targetIdx): void
```

Defined in: [src/components/carousel/awards-carousel/nav.ts:54](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/components/carousel/awards-carousel/nav.ts#L54)

Clone→real teleport for the infinite loop: waits 420ms (just past
the smooth-scroll duration) so the clone finishes animating in, then
instant-jumps to its real twin — invisible because the clone and
real slide are pixel-identical.

## Parameters

### host

[`AwardsCarousel`](../../../AwardsCarousel/classes/AwardsCarousel.md)

### targetIdx

`number`

## Returns

`void`
