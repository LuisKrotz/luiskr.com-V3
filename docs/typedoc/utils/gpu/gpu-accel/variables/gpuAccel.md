[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [utils/gpu/gpu-accel](../README.md) / gpuAccel

```ts
const gpuAccel: GPUAccelerator
```

Defined in: [src/utils/gpu/gpu-accel.ts:320](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/utils/gpu/gpu-accel.ts#L320)

Shared GPU accelerator singleton — one offscreen context + texture
serves every media upload, so the page never holds duplicate pipelines.
