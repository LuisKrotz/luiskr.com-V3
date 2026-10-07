[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [components/carousel/awards-carousel/nav](../README.md) / jumpToSlide

```ts
function jumpToSlide(host, idx, smooth?): void
```

Defined in: [src/components/carousel/awards-carousel/nav.ts:32](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/components/carousel/awards-carousel/nav.ts#L32)

Instant centering jump (offsetLeft variant — no smooth scroll): used
for the invisible clone→real teleport and resize refits. Retries one
frame later when layout hasn't produced measurable widths yet.

## Parameters

### host

[`AwardsCarousel`](../../../AwardsCarousel/classes/AwardsCarousel.md)

### idx

`number`

### smooth?

`boolean` = `false`

## Returns

`void`
