[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [utils/canvas/gl-program](../README.md) / createQuadProgram

```ts
function createQuadProgram(
  gl,
  vsSource,
  fsSource,
  label,
  opts?
): {
  program: WebGLProgram
  quadBuffer: WebGLBuffer
} | null
```

Defined in: [src/utils/canvas/gl-program.ts:69](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/utils/canvas/gl-program.ts#L69)

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
