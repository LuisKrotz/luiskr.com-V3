[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [components/carousel/custom-carousel/autoplay](../README.md) / tickCarouselAutoplay

```ts
function tickCarouselAutoplay(c, timestamp): void
```

Defined in: [website/components/carousel/custom-carousel/autoplay.ts:161](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/website/components/carousel/custom-carousel/autoplay.ts#L161)

Autoplay RAF tick: elapsed/duration → ringProgress 0–1 → paint →
advance when the cycle completes, then rebase the clock for the next
slide. The ring resets before goTo so the new slide starts empty.

## Parameters

### c

[`CarouselAutoplayHost`](../interfaces/CarouselAutoplayHost.md)

The carousel host.

### timestamp

`number`

RAF timestamp (ms) — the clock source for this frame.

## Returns

`void`
