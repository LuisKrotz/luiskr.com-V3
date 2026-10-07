[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [utils/gpu/gpu-info](../README.md) / glContextOptions

```ts
function glContextOptions(overrides?): WebGLContextAttributes
```

Defined in: [src/utils/gpu/gpu-info.ts:118](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/gpu/gpu-info.ts#L118)

Builds WebGL context attributes with the correct `powerPreference` hint
for this device. Callers merge their rendering-specific flags on top.

## Parameters

### overrides?

`WebGLContextAttributes` = `{}`

## Returns

`WebGLContextAttributes`
