[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [utils/gpu/gpu-accel-shaders](../README.md) / GPU\_ACCEL\_VS

```ts
const GPU_ACCEL_VS: '\n  attribute vec2 a_position;\n  varying vec2 v_uv;\n  void main() {\n    v_uv = vec2(a_position.x * 0.5 + 0.5, 1.0 - (a_position.y * 0.5 + 0.5));\n    gl_Position = vec4(a_position, 0.0, 1.0);\n  }\n'
```

Defined in: [src/utils/gpu/gpu-accel-shaders.ts:9](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/utils/gpu/gpu-accel-shaders.ts#L9)

Fullscreen-quad vertex shader emitting flipped-normalized UVs.
