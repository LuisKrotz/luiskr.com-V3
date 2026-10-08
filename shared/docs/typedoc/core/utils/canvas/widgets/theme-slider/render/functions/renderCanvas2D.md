[**luiskr.com**](../../../../../../../README.md)

***

[luiskr.com](../../../../../../../README.md) / [core/utils/canvas/widgets/theme-slider/render](../README.md) / renderCanvas2D

```ts
function renderCanvas2D(host): void;
```

Defined in: [core/utils/canvas/widgets/theme-slider/render.ts:107](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/theme-slider/render.ts#L107)

Canvas2D fallback renderer — mirrors the shader's composition.
NOTE: `host.ctx` is never assigned in this class — _triggerFallback()
instead hides the canvas and activates the CSS/DOM fallback on the
wrapper. This path is dormant defensive code kept so a future caller
can supply a 2d context and still get a sensible scene.

## Parameters

### host

[`ThemeSliderWebGL`](../../classes/ThemeSliderWebGL.md)

## Returns

`void`
