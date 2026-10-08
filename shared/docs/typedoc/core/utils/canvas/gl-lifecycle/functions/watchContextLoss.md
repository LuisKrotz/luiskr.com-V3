[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/utils/canvas/gl-lifecycle](../README.md) / watchContextLoss

```ts
function watchContextLoss(canvas, onLost): EventListener;
```

Defined in: [core/utils/canvas/gl-lifecycle.ts:30](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/gl-lifecycle.ts#L30)

Attaches a `webglcontextlost` listener that runs `onLost` (the widget's
fallback trigger) without preventDefault — a lost context stays lost
and the CSS/2D fallback takes over. Returns the bound handler so
`releaseQuadGL` can detach it before an intentional `loseContext()`.

## Parameters

### canvas

`HTMLCanvasElement`

### onLost

() => `void`

## Returns

`EventListener`
