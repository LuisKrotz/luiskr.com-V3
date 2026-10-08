[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/utils/gpu/gpu-accel](../README.md) / gpuAccel

```ts
const gpuAccel: GPUAccelerator;
```

Defined in: [core/utils/gpu/gpu-accel.ts:320](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/gpu/gpu-accel.ts#L320)

Shared GPU accelerator singleton — one offscreen context + texture
serves every media upload, so the page never holds duplicate pipelines.
