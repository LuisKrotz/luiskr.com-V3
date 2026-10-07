[**luiskr.com**](../../../../../../README.md)

---

[luiskr.com](../../../../../../README.md) / [utils/canvas/widgets/flag/draw](../README.md) / drawFlag

```ts
function drawFlag(renderer, flag, time): boolean
```

Defined in: [src/utils/canvas/widgets/flag/draw.ts:17](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/canvas/widgets/flag/draw.ts#L17)

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
