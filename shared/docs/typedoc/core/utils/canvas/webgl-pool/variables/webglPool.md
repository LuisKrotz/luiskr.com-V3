[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/utils/canvas/webgl-pool](../README.md) / webglPool

```ts
const webglPool: WebGLPoolManager;
```

Defined in: [core/utils/canvas/webgl-pool.ts:241](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/webgl-pool.ts#L241)

Shared pool singleton — one observer + one entry map governs every WebGL
canvas so purge/restore stays consistent and the context budget is global.
