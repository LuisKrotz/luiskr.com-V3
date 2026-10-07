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

Defined in: [src/utils/canvas/gl-program.ts:69](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/canvas/gl-program.ts#L69)

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
