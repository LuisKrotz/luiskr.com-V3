[**luiskr.com**](../../../../../../README.md)

***

[luiskr.com](../../../../../../README.md) / [website/components/carousel/awards-carousel/nav](../README.md) / goTo

```ts
function goTo(host, idx): void;
```

Defined in: [website/components/carousel/awards-carousel/nav.ts:107](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/carousel/awards-carousel/nav.ts#L107)

Navigate to slide idx. idx may be out-of-range (−1 or len): the call
scrolls to the matching CLONE slide at that edge and schedules an
instant teleport to its real twin — the user sees a continuous wrap
scroll while the clone→real swap is invisible. In-range idx scrolls
directly; the NAVIGATION_SETTLE_DELAY isNavigating window suppresses
scroll-handler teleports until the smooth animation settles.
`((idx % len) + len) % len` normalizes idx into [0,len) — the double
modulo handles negative idx (−1 → len−1) where a single % yields −1.

## Parameters

### host

[`AwardsCarousel`](../../../AwardsCarousel/classes/AwardsCarousel.md)

The AwardsCarousel element.

### idx

`number`

Target index — may be −1 or len for edge wraps.

## Returns

`void`
