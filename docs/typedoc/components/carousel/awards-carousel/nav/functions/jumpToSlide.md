[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [components/carousel/awards-carousel/nav](../README.md) / jumpToSlide

```ts
function jumpToSlide(host, idx, smooth?): void
```

Defined in: [src/components/carousel/awards-carousel/nav.ts:41](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/components/carousel/awards-carousel/nav.ts#L41)

Instant centering jump (offsetLeft variant — no smooth scroll): used
for the invisible clone→real teleport and resize refits. Retries one
frame later when layout hasn't produced measurable widths yet (a
display:none parent yields clientWidth 0 — waiting a frame beats
computing a bogus 0-offset jump).

## Parameters

### host

[`AwardsCarousel`](../../../AwardsCarousel/classes/AwardsCarousel.md)

The AwardsCarousel element.

### idx

`number`

Real-slide index; `children[idx + 1]` skips the leading
last-clone prepended to the track.

### smooth?

`boolean` = `false`

true for a smooth jump, false (default) for instant.

## Returns

`void`
