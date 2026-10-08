[**luiskr.com**](../../../../../../README.md)

---

[luiskr.com](../../../../../../README.md) / [utils/canvas/widgets/flag/texture](../README.md) / flagImage

```ts
function flagImage(renderer, cc): HTMLImageElement
```

Defined in: [core/utils/canvas/widgets/flag/texture.ts:53](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/core/utils/canvas/widgets/flag/texture.ts#L53)

Builds (once) and caches the flag's composited <img> for country code
cc — composite means the base flag plus any overlays (e.g. the EU
circle for split-locale flags) baked into one source image. The <img>
stays the fallback decode path and the natural-aspect probe.

## Parameters

### renderer

[`FlagRenderer`](../../renderer/classes/FlagRenderer.md)

### cc

`string`

## Returns

`HTMLImageElement`
