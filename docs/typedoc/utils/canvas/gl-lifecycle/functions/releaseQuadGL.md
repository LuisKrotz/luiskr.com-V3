[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [utils/canvas/gl-lifecycle](../README.md) / releaseQuadGL

```ts
function releaseQuadGL(canvas, host, onLost?): void
```

Defined in: [src/utils/canvas/gl-lifecycle.ts:47](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/canvas/gl-lifecycle.ts#L47)

Frees the quad program + buffer and force-loses the context. The
`onLost` listener (from watchContextLoss) is detached first so the
asynchronous loss event cannot fire the widget's fallback (or mark
the canvas) during a deliberate teardown — and without preventDefault
no zombie context is ever restored.

## Parameters

### canvas

`HTMLCanvasElement` \| `null`

### host

[`QuadGLResources`](../interfaces/QuadGLResources.md)

### onLost?

`EventListener` \| `null`

## Returns

`void`
