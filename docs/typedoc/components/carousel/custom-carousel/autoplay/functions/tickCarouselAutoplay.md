[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [components/carousel/custom-carousel/autoplay](../README.md) / tickCarouselAutoplay

```ts
function tickCarouselAutoplay(c, timestamp): void
```

Defined in: [src/components/carousel/custom-carousel/autoplay.ts:134](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/components/carousel/custom-carousel/autoplay.ts#L134)

Autoplay RAF tick: elapsed/duration → ringProgress 0–1 → paint →
advance when the cycle completes, then rebase the clock for the next
slide. The ring resets before goTo so the new slide starts empty.

## Parameters

### c

[`CarouselAutoplayHost`](../interfaces/CarouselAutoplayHost.md)

### timestamp

`number`

## Returns

`void`
