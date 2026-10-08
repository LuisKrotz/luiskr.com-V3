[**luiskr.com**](../../../../../../README.md)

---

[luiskr.com](../../../../../../README.md) / [utils/canvas/widgets/flag/draw](../README.md) / drawFlag

```ts
function drawFlag(renderer, flag, time): boolean
```

Defined in: [core/utils/canvas/widgets/flag/draw.ts:17](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/core/utils/canvas/widgets/flag/draw.ts#L17)

Renders one wave-shader frame for a flag (or its split pair for dual
flags like en-GB/en-US hybrids) onto the shared canvas, then blits
the result to the flag's own 2D canvas at time t.

## Parameters

### renderer

[`FlagRenderer`](../../renderer/classes/FlagRenderer.md)

### flag

[`FlagWebGL`](../../../flag-webgl/classes/FlagWebGL.md)

### time

`number`

## Returns

`boolean`
