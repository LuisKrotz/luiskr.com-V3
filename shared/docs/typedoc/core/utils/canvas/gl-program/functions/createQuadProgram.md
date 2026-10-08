[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/utils/canvas/gl-program](../README.md) / createQuadProgram

```ts
function createQuadProgram(
   gl, 
   vsSource, 
   fsSource, 
   label, 
   opts?
): 
  | {
  program: WebGLProgram;
  quadBuffer: WebGLBuffer;
}
  | null;
```

Defined in: [core/utils/canvas/gl-program.ts:69](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/gl-program.ts#L69)

Creates quad program.

## Parameters

### gl

`WebGLRenderingContext` \| `WebGL2RenderingContext`

### vsSource

`string`

### fsSource

`string`

### label

`string`

### opts?

[`QuadProgramOptions`](../interfaces/QuadProgramOptions.md) = `{}`

## Returns

  \| \{
  `program`: `WebGLProgram`;
  `quadBuffer`: `WebGLBuffer`;
\}
  \| `null`
