[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [utils/canvas/webgl-mode](../README.md) / webglContext

```ts
function webglContext(
  canvas,
  attrs?,
  alsoWebGL2?
): WebGLRenderingContext | WebGL2RenderingContext | null
```

Defined in: [src/utils/canvas/webgl-mode.ts:69](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/canvas/webgl-mode.ts#L69)

`canvas.getContext('webgl')` + the 'experimental-webgl' alias in one call.
Returns null in fallback mode without touching the canvas at all — a
canvas that failed `getContext('webgl')` once can never hand it out
again, so probing must be skipped entirely, not faked.

## Parameters

### canvas

`HTMLCanvasElement`

### attrs?

`WebGLContextAttributes`

### alsoWebGL2?

`boolean` = `false`

## Returns

`WebGLRenderingContext` \| `WebGL2RenderingContext` \| `null`
