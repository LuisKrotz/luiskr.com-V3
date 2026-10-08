[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/utils/gpu/gpu-info](../README.md) / glContextOptions

```ts
function glContextOptions(overrides?): WebGLContextAttributes;
```

Defined in: [core/utils/gpu/gpu-info.ts:123](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/gpu/gpu-info.ts#L123)

Builds WebGL context attributes with the correct `powerPreference` hint
for this device. Callers merge their rendering-specific flags on top.

## Parameters

### overrides?

`WebGLContextAttributes` = `{}`

## Returns

`WebGLContextAttributes`
