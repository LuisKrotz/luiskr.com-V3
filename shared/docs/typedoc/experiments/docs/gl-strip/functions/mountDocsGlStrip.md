[**luiskr.com**](../../../../README.md)

***

[luiskr.com](../../../../README.md) / [experiments/docs/gl-strip](../README.md) / mountDocsGlStrip

```ts
function mountDocsGlStrip(canvas, host): DocsGlHandle | null;
```

Defined in: [experiments/docs/gl-strip.ts:51](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/docs/gl-strip.ts#L51)

Mounts the animated strip on `canvas`.

## Parameters

### canvas

`HTMLCanvasElement`

Target canvas (already sized by CSS; backing store syncs
  to devicePixelRatio each resize).

### host

`HTMLElement`

Element receiving the `docs-gl-fallback` class on loss.

## Returns

[`DocsGlHandle`](../interfaces/DocsGlHandle.md) \| `null`

Handle with destroy(), or null when WebGL is unavailable.
