[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/utils/gpu/gpu-accel-shaders](../README.md) / GPU\_ACCEL\_FS

```ts
const GPU_ACCEL_FS: "\n  precision lowp float;\n  varying vec2 v_uv;\n  uniform sampler2D u_image;\n  void main() {\n    gl_FragColor = texture2D(u_image, v_uv);\n  }\n";
```

Defined in: [core/utils/gpu/gpu-accel-shaders.ts:19](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/gpu/gpu-accel-shaders.ts#L19)

Single-sampler fragment shader — blits the bound texture.
