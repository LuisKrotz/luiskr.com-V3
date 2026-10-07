[**luiskr.com**](../../../../../../README.md)

---

[luiskr.com](../../../../../../README.md) / [utils/canvas/widgets/theme-slider/init](../README.md) / triggerFallback

```ts
function triggerFallback(host): void
```

Defined in: [src/utils/canvas/widgets/theme-slider/init.ts:103](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/utils/canvas/widgets/theme-slider/init.ts#L103)

Switches to the non-WebGL path (CSS class on the host / Canvas2D) — used on context loss or init failure; releases any live GL first.

## Parameters

### host

[`ThemeSliderWebGL`](../../classes/ThemeSliderWebGL.md)

## Returns

`void`
