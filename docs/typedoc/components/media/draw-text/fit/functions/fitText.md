[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [components/media/draw-text/fit](../README.md) / fitText

```ts
function fitText(host): void
```

Defined in: [src/components/media/draw-text/fit.ts:81](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/components/media/draw-text/fit.ts#L81)

Measures and (only when overflowing) scales the host's font size and
letter spacing so the widest word fits the parent's content box.
Clears the inline overrides first so re-measurement is always relative
to the stylesheet ramp. No-ops without the `fit` attribute, without a
measurable box, or when the text already fits.

## Parameters

### host

[`DrawText`](../../../DrawText/classes/DrawText.md)

— the draw-text element

## Returns

`void`
