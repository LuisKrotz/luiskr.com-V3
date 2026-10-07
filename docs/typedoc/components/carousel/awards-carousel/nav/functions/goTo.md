[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [components/carousel/awards-carousel/nav](../README.md) / goTo

```ts
function goTo(host, idx): void
```

Defined in: [src/components/carousel/awards-carousel/nav.ts:84](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/components/carousel/awards-carousel/nav.ts#L84)

Navigate to slide idx. idx may be out-of-range (−1 or len): the call
scrolls to the matching CLONE slide at that edge and schedules an
instant teleport to its real twin — the user sees a continuous wrap
scroll while the clone→real swap is invisible. In-range idx scrolls
directly; the 400ms isNavigating window suppresses scroll-handler
teleports until the smooth animation settles.

## Parameters

### host

[`AwardsCarousel`](../../../AwardsCarousel/classes/AwardsCarousel.md)

### idx

`number`

## Returns

`void`
