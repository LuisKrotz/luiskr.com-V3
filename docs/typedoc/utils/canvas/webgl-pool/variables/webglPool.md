[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [utils/canvas/webgl-pool](../README.md) / webglPool

```ts
const webglPool: WebGLPoolManager
```

Defined in: [core/utils/canvas/webgl-pool.ts:241](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/core/utils/canvas/webgl-pool.ts#L241)

Shared pool singleton — one observer + one entry map governs every WebGL
canvas so purge/restore stays consistent and the context budget is global.
