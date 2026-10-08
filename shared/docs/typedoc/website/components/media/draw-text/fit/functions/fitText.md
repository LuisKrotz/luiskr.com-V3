[**luiskr.com**](../../../../../../README.md)

***

[luiskr.com](../../../../../../README.md) / [website/components/media/draw-text/fit](../README.md) / fitText

```ts
function fitText(host): void;
```

Defined in: [website/components/media/draw-text/fit.ts:81](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/media/draw-text/fit.ts#L81)

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
