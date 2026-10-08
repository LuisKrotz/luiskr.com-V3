[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/utils/canvas/gl-program](../README.md) / getUniforms

```ts
function getUniforms(
   gl, 
   program, 
   names
): Record<string, WebGLUniformLocation | null>;
```

Defined in: [core/utils/canvas/gl-program.ts:128](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/gl-program.ts#L128)

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
