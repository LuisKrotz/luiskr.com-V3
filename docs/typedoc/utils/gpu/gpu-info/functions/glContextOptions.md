[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [utils/gpu/gpu-info](../README.md) / glContextOptions

```ts
function glContextOptions(overrides?): WebGLContextAttributes
```

Defined in: [src/utils/gpu/gpu-info.ts:123](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/utils/gpu/gpu-info.ts#L123)

Builds WebGL context attributes with the correct `powerPreference` hint
for this device. Callers merge their rendering-specific flags on top.

## Parameters

### overrides?

`WebGLContextAttributes` = `{}`

## Returns

`WebGLContextAttributes`
