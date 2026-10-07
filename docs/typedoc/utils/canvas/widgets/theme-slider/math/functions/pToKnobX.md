[**luiskr.com**](../../../../../../README.md)

---

[luiskr.com](../../../../../../README.md) / [utils/canvas/widgets/theme-slider/math](../README.md) / pToKnobX

```ts
function pToKnobX(host, p): number
```

Defined in: [src/utils/canvas/widgets/theme-slider/math.ts:40](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/utils/canvas/widgets/theme-slider/math.ts#L40)

Normalized position → knob pixel X inside the track. The knob is
inset 32px from each capsule end (≈ its own radius) so it never
overhangs the rounded border; p/2 maps 0–2 → 0–1 of that inset span.

## Parameters

### host

[`ThemeSliderWebGL`](../../classes/ThemeSliderWebGL.md)

### p

`number`

## Returns

`number`
