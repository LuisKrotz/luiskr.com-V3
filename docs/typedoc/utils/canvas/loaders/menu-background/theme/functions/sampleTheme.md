[**luiskr.com**](../../../../../../README.md)

---

[luiskr.com](../../../../../../README.md) / [utils/canvas/loaders/menu-background/theme](../README.md) / sampleTheme

```ts
function sampleTheme(host): void
```

Defined in: [core/utils/canvas/loaders/menu-background/theme.ts:20](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/core/utils/canvas/loaders/menu-background/theme.ts#L20)

Reads the --menu-ink / --menu-ink-2 custom properties from the canvas
element and converts them into shader ink colors. Sampling the canvas
(not the root) lets scoped overrides apply — e.g. .nav--playground
forces the dark ink set regardless of the global theme. Missing or
unparseable tokens fall back to white-on-dark / black-on-light.
_darkAtStart records the theme so _renderFrame can detect a flip.

## Parameters

### host

[`MenuBackgroundWebGL`](../../../menu-background-webgl/classes/MenuBackgroundWebGL.md)

## Returns

`void`
