[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [utils/canvas/gl-program](../README.md) / getUniforms

```ts
function getUniforms(gl, program, names): Record<string, WebGLUniformLocation | null>
```

Defined in: [src/utils/canvas/gl-program.ts:128](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/canvas/gl-program.ts#L128)

Resolves a uniform-location map — keys are the caller's shorthand,
values are the shader's `u_*` names (identical keys work too).

## Parameters

### gl

`WebGLRenderingContext` \| `WebGL2RenderingContext`

### program

`WebGLProgram`

### names

`Record`\<`string`, `string`\>

## Returns

`Record`\<`string`, `WebGLUniformLocation` \| `null`\>
