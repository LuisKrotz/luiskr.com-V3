[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/utils/canvas/gl-program](../README.md) / getWebGLContext

```ts
function getWebGLContext(canvas, attrs?): WebGLRenderingContext | null;
```

Defined in: [core/utils/canvas/gl-program.ts:20](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/gl-program.ts#L20)

Probes the canvas for a WebGL context — prefers `webgl`, falls back to
`experimental-webgl`. Returns null when the browser has no GL support or
when `?debug=webGLMode:fallback` forces the CSS/2D surface (callers then
take their fallback path).

## Parameters

### canvas

`HTMLCanvasElement`

### attrs?

`WebGLContextAttributes`

## Returns

`WebGLRenderingContext` \| `null`
